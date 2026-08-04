// resourceMigrate materializes Hugo's cached HTTP responses as local Hugo
// data and assets. It is intentionally reusable: running it again merges new
// responses into the existing endpoint files and asset manifest.
package main

import (
	"bufio"
	"bytes"
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"errors"
	"flag"
	"fmt"
	"io"
	"mime"
	"net/http"
	"net/url"
	"os"
	"path/filepath"
	"strings"
)

type mappingRow struct {
	Type       string `json:"type"`
	URI        string `json:"uri"`
	ID         string `json:"id"`
	UserKey    string `json:"userKey"`
	OptionsKey string `json:"optionsKey"`
}

type assetEntry struct {
	Path      string `json:"path"`
	MediaType string `json:"media_type"`
	CacheKey  string `json:"cache_key"`
}

type apiEntry struct {
	File string `json:"file"`
	Key  string `json:"key"`
}

func main() {
	rootFlag := flag.String("root", ".", "repository root; all inputs and outputs stay below it")
	mappingFlag := flag.String("mapping", "mapping.jsonl", "mapping path relative to repository root")
	cacheFlag := flag.String("cache", "resources/filecache", "Hugo filecache path relative to repository root")
	assetsFlag := flag.String("assets", "assets/remote", "binary asset destination relative to repository root")
	dataFlag := flag.String("data", "data", "JSON data destination relative to repository root")
	dryRun := flag.Bool("dry-run", false, "parse and report without writing files")
	flag.Parse()

	root, err := filepath.Abs(*rootFlag)
	if err != nil {
		fatal(err)
	}

	mappings, err := readMappings(safePath(root, *mappingFlag))
	if err != nil {
		fatal(err)
	}

	assets := make(map[string]assetEntry)
	apiFiles := make(map[string]map[string]json.RawMessage)
	apiIndex := make(map[string]apiEntry)
	var extractedAssets, extractedJSON, skipped, missing int

	for _, row := range mappings {
		if row.URI == "" || (row.Type != "getjson" && row.Type != "getremote") {
			continue
		}
		if isHashflag(row.URI) || isLiveAPI(row.URI) {
			skipped++
			continue
		}

		cacheKey, cachePath := findCacheFile(root, *cacheFlag, row)
		if cachePath == "" {
			missing++
			fmt.Printf("MISSING %s\n", row.URI)
			continue
		}

		body, mediaType, statusCode, err := readCachedResponse(cachePath)
		if err != nil {
			fatal(fmt.Errorf("%s: %w", cachePath, err))
		}
		if statusCode < http.StatusOK || statusCode >= http.StatusMultipleChoices {
			skipped++
			continue
		}

		if isAsset(mediaType) {
			rel, err := mirroredAssetPath(row.URI, mediaType)
			if err != nil {
				fatal(err)
			}
			path := safePath(root, filepath.Join(*assetsFlag, rel))
			if err := writeIfSafe(path, body, *dryRun); err != nil {
				fatal(err)
			}
			assets[row.URI] = assetEntry{
				Path:      filepath.ToSlash(filepath.Join("remote", rel)),
				MediaType: mediaType,
				CacheKey:  cacheKey,
			}
			extractedAssets++
			continue
		}

		if isJSON(mediaType, body) {
			file, key, err := apiLocation(row.URI)
			if err != nil {
				fatal(err)
			}
			if apiFiles[file] == nil {
				apiFiles[file] = make(map[string]json.RawMessage)
			}
			apiFiles[file][key] = append(json.RawMessage(nil), body...)
			apiIndex[row.URI] = apiEntry{File: file, Key: key}
			extractedJSON++
			continue
		}

		skipped++
	}

	if !*dryRun {
		if err := writeAssetsManifest(root, assets); err != nil {
			fatal(err)
		}
		if err := writeAPIData(root, apiFiles); err != nil {
			fatal(err)
		}
		if err := writeAPIIndex(root, filepath.Join(*dataFlag, "api", "endpoints.json"), apiIndex); err != nil {
			fatal(err)
		}
	}

	fmt.Printf("assets=%d json=%d skipped=%d missing=%d\n", extractedAssets, extractedJSON, skipped, missing)
}

func readMappings(path string) ([]mappingRow, error) {
	f, err := os.Open(path)
	if err != nil {
		return nil, err
	}
	defer f.Close()

	var rows []mappingRow
	scanner := bufio.NewScanner(f)
	scanner.Buffer(make([]byte, 64*1024), 16*1024*1024)
	for line := 1; scanner.Scan(); line++ {
		var row mappingRow
		if err := json.Unmarshal(scanner.Bytes(), &row); err != nil {
			return nil, fmt.Errorf("%s line %d: %w", path, line, err)
		}
		rows = append(rows, row)
	}
	return rows, scanner.Err()
}

func findCacheFile(root, cacheDir string, row mappingRow) (string, string) {
	keys := []string{row.ID, row.UserKey, row.OptionsKey}
	for _, key := range keys {
		if key == "" {
			continue
		}
		path := safePath(root, filepath.Join(cacheDir, cacheDirectory(row.Type), key))
		if info, err := os.Stat(path); err == nil && !info.IsDir() {
			return key, path
		}
	}
	return "", ""
}

func cacheDirectory(kind string) string {
	if kind == "getjson" {
		return "getjson"
	}
	return "getresource"
}

func readCachedResponse(path string) ([]byte, string, int, error) {
	raw, err := os.ReadFile(path)
	if err != nil {
		return nil, "", 0, err
	}
	if !bytes.HasPrefix(raw, []byte("HTTP/")) {
		return raw, detectMediaType("", raw), http.StatusOK, nil
	}
	response, err := http.ReadResponse(bufio.NewReader(bytes.NewReader(raw)), nil)
	if err != nil {
		return nil, "", 0, fmt.Errorf("parse HTTP response: %w", err)
	}
	defer response.Body.Close()
	body, err := io.ReadAll(response.Body)
	if err != nil {
		return nil, "", 0, err
	}
	return body, detectMediaType(response.Header.Get("Content-Type"), body), response.StatusCode, nil
}

func detectMediaType(header string, body []byte) string {
	mediaType := strings.ToLower(strings.TrimSpace(strings.Split(header, ";")[0]))
	if mediaType == "" {
		mediaType = http.DetectContentType(body)
	}
	return mediaType
}

func isAsset(mediaType string) bool {
	return strings.HasPrefix(mediaType, "image/") || strings.HasPrefix(mediaType, "video/")
}

func isHashflag(rawURL string) bool {
	return strings.HasPrefix(rawURL, "https://ianmuchina.github.io/HashflagArchive/img/")
}

func isLiveAPI(rawURL string) bool {
	return rawURL == "https://api.twitter.com/1.1/guest/activate.json"
}

func isJSON(mediaType string, body []byte) bool {
	if mediaType == "application/json" || strings.HasSuffix(mediaType, "+json") {
		return json.Valid(body)
	}
	return json.Valid(bytes.TrimSpace(body))
}

func mirroredAssetPath(rawURL, mediaType string) (string, error) {
	u, err := url.Parse(rawURL)
	if err != nil || u.Host == "" {
		return "", fmt.Errorf("invalid asset URL %q", rawURL)
	}

	path := filepath.ToSlash(filepath.Clean("/" + u.Path))
	path = strings.TrimPrefix(path, "/")
	if path == "" || path == "." {
		path = "index"
	}
	if filepath.Ext(path) == "" {
		path += extension(mediaType)
	}
	// A query can distinguish two resources with the same URL path.
	if u.RawQuery != "" && strings.Contains(path, ".") {
		suffix := sha256.Sum256([]byte(u.RawQuery))
		ext := filepath.Ext(path)
		path = strings.TrimSuffix(path, ext) + "-" + hex.EncodeToString(suffix[:4]) + ext
	}
	return filepath.Join(safeSegment(u.Host), path), nil
}

func apiLocation(rawURL string) (string, string, error) {
	u, err := url.Parse(rawURL)
	if err != nil || u.Host == "" {
		return "", "", fmt.Errorf("invalid API URL %q", rawURL)
	}

	if u.Host == "cdn.syndication.twimg.com" && (u.Path == "/tweet" || u.Path == "/tweet-result") {
		id := u.Query().Get("id")
		if id == "" {
			return "", "", fmt.Errorf("syndication URL has no id: %q", rawURL)
		}
		return filepath.ToSlash(filepath.Join("api", "cdn.syndication.twimg.com", "tweet-result.json")), id, nil
	}

	if u.Host == "twitter.com" && strings.HasPrefix(u.Path, "/i/api/graphql/") {
		parts := strings.Split(strings.Trim(u.Path, "/"), "/")
		endpoint := parts[len(parts)-1]
		if endpoint == "" {
			return "", "", fmt.Errorf("GraphQL URL has no endpoint: %q", rawURL)
		}
		key, err := graphqlKey(u)
		if err != nil {
			return "", "", err
		}
		return filepath.ToSlash(filepath.Join("api", "twitter", endpoint+".json")), key, nil
	}

	endpoint := strings.Trim(filepath.ToSlash(u.Path), "/")
	if endpoint == "" {
		endpoint = "index"
	}
	endpoint = strings.TrimSuffix(endpoint, filepath.Ext(endpoint))
	file := filepath.Join("api", safeSegment(u.Host), endpoint+".json")
	key := u.Query().Get("id")
	if key == "" {
		hash := sha256.Sum256([]byte(rawURL))
		key = hex.EncodeToString(hash[:8])
	}
	return filepath.ToSlash(file), safeSegment(key), nil
}

func graphqlKey(u *url.URL) (string, error) {
	variables := u.Query().Get("variables")
	var values map[string]any
	if variables != "" {
		if err := json.Unmarshal([]byte(variables), &values); err != nil {
			return "", fmt.Errorf("parse GraphQL variables for %q: %w", u.String(), err)
		}
	}
	for _, name := range []string{"tweetId", "focalTweetId", "id"} {
		if value, ok := values[name]; ok && fmt.Sprint(value) != "" {
			return safeSegment(fmt.Sprint(value)), nil
		}
	}
	hash := sha256.Sum256([]byte(u.String()))
	return hex.EncodeToString(hash[:8]), nil
}

func extension(mediaType string) string {
	if values, err := mime.ExtensionsByType(mediaType); err == nil && len(values) > 0 {
		return values[0]
	}
	return ".bin"
}

func safeSegment(value string) string {
	value = strings.ReplaceAll(value, "\\", "_")
	value = strings.ReplaceAll(value, "/", "_")
	value = strings.ReplaceAll(value, ":", "_")
	if value == "" || value == "." || value == ".." {
		return "_"
	}
	return value
}

func safePath(root, name string) string {
	path, err := filepath.Abs(filepath.Join(root, name))
	if err != nil {
		fatal(err)
	}
	rel, err := filepath.Rel(root, path)
	if err != nil || rel == ".." || strings.HasPrefix(rel, ".."+string(filepath.Separator)) {
		fatal(fmt.Errorf("path escapes repository root: %s", name))
	}
	return path
}

func writeIfSafe(path string, body []byte, dryRun bool) error {
	if dryRun {
		return nil
	}
	if existing, err := os.ReadFile(path); err == nil {
		if !bytes.Equal(existing, body) {
			return fmt.Errorf("refusing to overwrite different file: %s", path)
		}
		return nil
	} else if !errors.Is(err, os.ErrNotExist) {
		return err
	}
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, body, 0o644)
}

func writeAssetsManifest(root string, assets map[string]assetEntry) error {
	path := filepath.Join("data", "assets.json")
	existing := make(map[string]assetEntry)
	if err := readJSONIfPresent(safePath(root, path), &existing); err != nil {
		return err
	}
	for key, value := range assets {
		existing[key] = value
	}
	for key := range existing {
		if isHashflag(key) {
			delete(existing, key)
		}
	}
	return writeJSON(root, path, existing)
}

func writeAPIData(root string, files map[string]map[string]json.RawMessage) error {
	for file, records := range files {
		path := filepath.Join("data", file)
		existing := make(map[string]json.RawMessage)
		if err := readJSONIfPresent(safePath(root, path), &existing); err != nil {
			return err
		}
		for key, value := range records {
			existing[key] = value
		}
		if err := writeJSON(root, path, existing); err != nil {
			return err
		}
	}
	return nil
}

func writeAPIIndex(root, relative string, entries map[string]apiEntry) error {
	existing := make(map[string]apiEntry)
	if err := readJSONIfPresent(safePath(root, relative), &existing); err != nil {
		return err
	}
	for key, value := range entries {
		existing[key] = value
	}
	for key := range existing {
		if isLiveAPI(key) {
			delete(existing, key)
		}
	}
	return writeJSON(root, relative, existing)
}

func readJSONIfPresent(path string, target any) error {
	data, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		return nil
	}
	if err != nil {
		return err
	}
	return json.Unmarshal(data, target)
}

func writeJSON(root, relative string, value any) error {
	data, err := json.MarshalIndent(value, "", "  ")
	if err != nil {
		return err
	}
	path := safePath(root, relative)
	if err := os.MkdirAll(filepath.Dir(path), 0o755); err != nil {
		return err
	}
	return os.WriteFile(path, append(data, '\n'), 0o644)
}

func fatal(err error) {
	fmt.Fprintln(os.Stderr, "resourceMigrate:", err)
	os.Exit(1)
}
