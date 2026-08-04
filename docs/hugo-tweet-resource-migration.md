---
title: Hugo tweet resource migration
description:
  Findings and implementation notes from moving tweet data and media out of
  Hugo's remote-resource cache.
date: 2026-07-31
draft: false
---

## Findings

Hugo's old `data.GetJSON` calls had to be replaced after the upgrade. Remote
resource cache keys were also unstable across Hugo versions, so the durable
source of truth is now committed data and media rather than
`resources/filecache`.

The endpoint index in `data/api/endpoints.json` maps each request URL to a JSON
file and object key. Syndication responses are stored in
`data/api/cdn.syndication.twimg.com/tweet-result.json`; REST and GraphQL-style
responses use the same endpoint-file convention. Binary images and videos are
mirrored below `assets/remote/`, with `data/assets.json` mapping their original
URLs to local paths.

One Hugo-specific issue was important: the dotted host directory
`cdn.syndication.twimg.com` was not reliably addressable through `site.Data`.
The shared `local-api.html` partial therefore reads the mapped file from `data/`
and unmarshals it before selecting the object key. This preserves the file
format while avoiding the broken directory lookup.

Guest-token activation remains live by design. It is not included in local API
snapshots, and its cache invalidation remains controlled by the Makefile.
Hashflags also remain remote because their GitHub archive is stable; they are
not locally cached.

The reusable `scripts/resourceMigrate/main.go` tool parses Hugo's cache mapping,
materializes JSON and binary responses, stays within the repository root, and
skips live APIs, hashflags, and cached non-2xx responses. `scripts/GetTweet` and
`addTweet` provide a simple path for adding a tweet snapshot and its related
assets.

The same tool can merge another mapping file without replacing existing data:

```sh
go run ./scripts/resourceMigrate --root . --mapping mapping2.jsonl
```

For `mapping2.jsonl`, the migration added 287 assets and 246 JSON responses,
skipped 33 intentionally unsupported or non-success responses, and found no
missing cache entries.

## Migration instructions

Run these commands from the repository root. The mapping file and Hugo cache
must be inside the repository; the tool rejects paths that escape the root.

### 1. Check the inputs

The mapping file is a JSONL file produced by the cache inspection workflow. The
corresponding response bodies must be present in:

- `resources/filecache/getresource/` for `getremote` rows
- `resources/filecache/getjson/` for `getjson` rows

The migration does not contact Twitter or any other network endpoint. It reads
the cached response files, including their HTTP status and content type.

### 2. Run a dry run

From the repository root, use a subshell so the Go module is selected correctly:

```sh
(cd scripts/resourceMigrate && \
  go run . --root ../.. --mapping mapping2.jsonl --dry-run)
```

The command reports counts for `assets`, `json`, `skipped`, and `missing` but
does not write site data or assets. Investigate any `missing` count before
continuing. A non-zero count generally means that the mapping references a cache
key that is not present in the local Hugo cache.

### 3. Merge the mapping

After the dry run looks correct, run the same command without `--dry-run`:

```sh
(cd scripts/resourceMigrate && \
  go run . --root ../.. --mapping mapping2.jsonl)
```

The migration is additive. It merges records into existing files instead of
discarding previous mappings:

- JSON responses are merged into the endpoint file selected from the URL.
- `data/api/endpoints.json` receives the URL-to-file-and-key mapping.
- Binary responses are mirrored below `assets/remote/`.
- `data/assets.json` receives the original-URL-to-local-path mapping.

Existing binary files are never silently overwritten with different content.
Cached non-2xx responses are skipped, so a cached 404 cannot create a zero-byte
asset. Hashflag URLs and the live guest-token endpoint are intentionally
excluded.

### 4. Add one new tweet

For a new tweet, use the wrapper from the repository root:

```sh
./addTweet 40
```

`addTweet` runs `scripts/GetTweet`, requests the syndication response with the
required `token=a` query parameter, recursively discovers related tweets, and
downloads referenced profile images, images, and videos. It updates the
syndication JSON file, endpoint index, and asset manifest. It does not use the
authenticated REST lookup endpoint, because an unavailable/deleted tweet may
return 404 there while syndication still provides a usable snapshot.

The script requires Deno network, read, and write permissions. It is verbose by
design: the request URLs, response statuses, stored records, assets, and final
counts are printed so a failed migration can be diagnosed without opening the
cache files manually.

### 5. Validate the result

After either migration path, build with both Hugo versions used by this site:

```sh
pnpm exec hugo --quiet
hugo --quiet
```

Check that the generated output contains tweet markup rather than an empty
shortcode result. For example:

```sh
rg -c '<article class="tweet' public/blog/12-tweet-embed/index.html
```

Review changes before committing. Commit `data/api/`, `data/assets.json`,
`assets/remote/`, and intentional source changes. Do not commit mapping files,
`out.patch`, or `resources/filecache/`; those are local migration inputs and
cache state.

## Validation

The migration was committed as `70980e9`
(`Migrate Hugo tweet resources to local data`). These checks passed:

```sh
pnpm exec hugo --quiet
hugo --quiet
go test ./...
```

The generated blog output contains rendered tweet articles, including tweet 20.
Temporary `mapping.jsonl`, `out.patch`, and local resource-cache files remain
untracked and were not included in the commit.
