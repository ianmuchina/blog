#!/usr/bin/env -S deno run --allow-net --allow-read --allow-write

// Download a tweet and the local data/assets needed to render it.
// Usage: ./addTweet 40

import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, extname, join } from "node:path";

const root = Deno.cwd();
const syndicationFile = "data/api/cdn.syndication.twimg.com/tweet-result.json";
const endpointsFile = "data/api/endpoints.json";
const assetsFile = "data/assets.json";

type JsonMap = Record<string, any>;

function log(message: string) {
  console.log(`[GetTweet] ${message}`);
}

const tweetId = Deno.args[0];
if (!tweetId || !/^\d+$/.test(tweetId)) {
  console.error("Usage: ./addTweet TWEET_ID");
  Deno.exit(2);
}

const syndication = await readJson<JsonMap>(syndicationFile, {});
const endpoints = await readJson<JsonMap>(endpointsFile, {});
const assets = await readJson<JsonMap>(assetsFile, {});
const tweets = new Map<string, Record<string, unknown>>();
const downloaded = new Set<string>();
const selectedVideoURLs = new Set<string>();

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const path = local(file);
    log(`read ${file}`);
    return JSON.parse(await readFile(path, "utf8")) as T;
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      log(`read ${file}: not found, using empty value`);
      return fallback;
    }
    throw error;
  }
}

async function writeJson(file: string, value: unknown) {
  const path = local(file);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, `${JSON.stringify(value, null, 2)}\n`);
  log(`write ${file}`);
}

function local(file: string): string {
  const path = join(root, file);
  const relative = path.slice(root.length + 1);
  if (
    relative === ".." ||
    relative.startsWith(`..${Deno.build.os === "windows" ? "\\" : "/"}`)
  ) {
    throw new Error(`Refusing to write outside the repository: ${file}`);
  }
  return path;
}

async function fetchJson(url: string, init?: RequestInit) {
  log(`${init?.method ?? "GET"} ${url}`);
  const response = await fetch(url, {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers ?? {}),
    },
  });
  log(`${response.status} ${response.statusText} ${url}`);
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}: ${url}`);
  }
  return await response.json();
}

async function fetchTweet(id: string): Promise<Record<string, unknown>> {
  const urls = [
    `https://cdn.syndication.twimg.com/tweet-result?id=${id}&token=a`,
    `https://cdn.syndication.twimg.com/tweet?id=${id}&token=a`,
  ];

  let lastError: unknown;
  for (const url of urls) {
    try {
      const tweet = (await fetchJson(url)) as Record<string, unknown>;
      const key = String(tweet.id_str ?? id);
      syndication[key] = tweet;
      const endpoint = {
        file: "api/cdn.syndication.twimg.com/tweet-result.json",
        key,
      };
      endpoints[url] = endpoint;
      endpoints[url.replace("&token=a", "")] = endpoint;
      log(`stored tweet ${key} from ${url}`);
      return tweet;
    } catch (error) {
      log(`failed tweet request ${url}: ${error}`);
      lastError = error;
    }
  }
  throw lastError;
}

async function visitTweet(id: string) {
  if (tweets.has(id)) {
    log(`tweet ${id}: already visited`);
    return;
  }

  log(`visit tweet ${id}`);
  const tweet = await fetchTweet(id);
  tweets.set(id, tweet);
  await collectAssets(tweet);

  const nestedIds = new Set<string>();
  collectNestedTweetIds(tweet, nestedIds);
  nestedIds.delete(id);
  log(`tweet ${id}: found ${nestedIds.size} related tweet(s)`);
  for (const nestedId of nestedIds) await visitTweet(nestedId);
}

function collectNestedTweetIds(value: unknown, ids: Set<string>) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) collectNestedTweetIds(item, ids);
    return;
  }

  const object = value as Record<string, unknown>;
  for (const field of [
    "parent",
    "quoted_tweet",
    "retweeted_status",
    "retweeted_tweet",
  ]) {
    const related = object[field];
    if (related && typeof related === "object" && !Array.isArray(related)) {
      const relatedID = (related as Record<string, unknown>).id_str;
      if (typeof relatedID === "string") ids.add(relatedID);
    }
  }
  if (typeof object.in_reply_to_status_id_str === "string") {
    ids.add(object.in_reply_to_status_id_str);
  }

  if (
    typeof object.id_str === "string" &&
    typeof object.text === "string" &&
    object.user &&
    typeof object.user === "object"
  ) {
    ids.add(object.id_str);
  }

  for (const child of Object.values(object)) collectNestedTweetIds(child, ids);
}

async function collectAssets(value: unknown) {
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value)) {
    for (const item of value) await collectAssets(item);
    return;
  }

  const object = value as Record<string, unknown>;
  const variants = Array.isArray(object.variants)
    ? object.variants.filter(isVideoVariant)
    : [];

  if (variants.length > 0) {
    const best = variants.reduce((current, candidate) =>
      videoWidth(candidate) > videoWidth(current) ? candidate : current
    );
    selectedVideoURLs.add(String(best.src));
  }

  for (const [key, child] of Object.entries(object)) {
    // video.html selects the highest-width MP4 variant. Download only that
    // variant while retaining all variants in the cached tweet JSON.
    if (key === "variants" && variants.length > 0) {
      const best = variants.reduce((current, candidate) =>
        videoWidth(candidate) > videoWidth(current) ? candidate : current
      );
      await collectAssets(best);
      continue;
    }

    if (typeof child === "string" && isBinaryURL(child, key)) {
      if (child.includes("video.twimg.com/") && !selectedVideoURLs.has(child)) {
        continue;
      }
      await downloadAsset(child);
    } else {
      await collectAssets(child);
    }
  }
}

function isVideoVariant(value: unknown): value is Record<string, unknown> {
  return (
    !!value &&
    typeof value === "object" &&
    !Array.isArray(value) &&
    (value as Record<string, unknown>).type === "video/mp4" &&
    typeof (value as Record<string, unknown>).src === "string"
  );
}

function videoWidth(value: Record<string, unknown>): number {
  const src = String(value.src);
  const match = src.match(/(\d{3,4})x\d{3,4}/);
  return match ? Number(match[1]) : 0;
}

function isBinaryURL(value: string, key: string): boolean {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return false;
  }

  if (!/^https?:$/.test(url.protocol)) return false;
  if (!/^(pbs\.twimg\.com|video\.twimg\.com)$/.test(url.hostname)) return false;
  if (url.pathname.includes("/vmap/")) return false;
  return (
    key === "url" ||
    key === "src" ||
    key === "poster" ||
    key.startsWith("media_url") ||
    key.endsWith("_url_https")
  );
}

async function downloadAsset(urlString: string) {
  const requestedURL = new URL(urlString);
  const sourceURL = sourceQualityURL(requestedURL);
  const sourceURLString = sourceURL.toString();

  if (downloaded.has(sourceURLString)) {
    log(`asset ${urlString}: source quality already downloaded this run`);
    return;
  }
  if (assets[urlString]) {
    log(`asset ${urlString}: already in assets.json`);
    return;
  }
  downloaded.add(sourceURLString);

  log(`GET source-quality asset ${sourceURLString}`);
  const response = await fetch(sourceURL);
  log(`${response.status} ${response.statusText} asset ${sourceURLString}`);
  if (!response.ok) {
    log(`skip asset ${urlString}: HTTP ${response.status}`);
    return;
  }

  const contentType = (response.headers.get("content-type") ?? "")
    .split(";", 1)[0]
    .toLowerCase();
  if (!contentType.startsWith("image/") && !contentType.startsWith("video/")) {
    log(`skip asset ${urlString}: content type ${contentType}`);
    return;
  }

  const bytes = new Uint8Array(await response.arrayBuffer());
  const relative = mirroredAssetPath(sourceURL, contentType);
  const path = local(join("assets/remote", relative));
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);

  const asset = {
    path: join("remote", relative).replaceAll("\\", "/"),
    media_type: contentType,
    cache_key: "",
  };
  assets[urlString] = asset;
  assets[sourceURLString] = asset;
  log(`stored ${contentType} asset at assets/remote/${relative}`);
}

function sourceQualityURL(url: URL): URL {
  const result = new URL(url);
  if (
    result.hostname === "pbs.twimg.com" &&
    result.pathname.includes("/card_img/")
  ) {
    result.searchParams.set("name", "orig");
  }
  return result;
}

function mirroredAssetPath(url: URL, contentType: string): string {
  let path = url.pathname.replace(/^\/+/, "") || "index";
  if (!extname(path)) path += extension(contentType);

  if (url.search) {
    const hash = createHash("sha256")
      .update(url.search.slice(1))
      .digest("hex")
      .slice(0, 8);
    const suffix = extname(path);
    path = `${path.slice(0, -suffix.length)}-${hash}${suffix}`;
  }
  return join(url.hostname, path).replaceAll("\\", "/");
}

function extension(contentType: string): string {
  return (
    {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/gif": ".gif",
      "image/webp": ".webp",
      "video/mp4": ".mp4",
      "video/webm": ".webm",
    }[contentType] ?? ".bin"
  );
}

await visitTweet(tweetId);
await writeJson(syndicationFile, syndication);
await writeJson(assetsFile, assets);
await writeJson(endpointsFile, endpoints);

log(`saved ${tweets.size} tweet(s), ${downloaded.size} new asset(s)`);
log(`syndication records: ${Object.keys(syndication).length}`);
log(`asset records: ${Object.keys(assets).length}`);
log(`endpoint records: ${Object.keys(endpoints).length}`);
