---
title: Parse JSON with comments in Go
draft: true
date: 2022-05-23
---

The Go standard library can't parse json files containing comments or trailing
commas. Doing so gives you the following error.

```
invalid character '/' looking for beginning of object key string
```

To prevent this error, you need to sanitize the json using the
[hujson](https://github.com/tailscale/hujson) package from Tailscale.

Here's an example on how to use it, also available in the
[Go playground.](https://go.dev/play/p/ogGACb2KtIE)

```go {linenos=inline,hl_lines=[21,"31-38"]}
package main

import (
	"encoding/json"
	"fmt"

	"github.com/tailscale/hujson"
)

const data = `{
  // Comment
  "foo": "bar",
}`

type x struct {
	Foo string `json:"foo"`
}

func main() {
	var t x
	data, err := standardizeJSON([]byte(data))
	err = json.Unmarshal(data, &t)
	if err != nil {
		fmt.Println(err)
		return
	}

	fmt.Println(t.Foo)
}

func standardizeJSON(b []byte) ([]byte, error) {
	ast, err := hujson.Parse(b)
	if err != nil {
		return b, err
	}
	ast.Standardize()
	return ast.Pack(), nil
}
```
