---
title: How to prevent CLS in Hugo
description: Use render hooks to automatically set width & height on Images
date: 2022-07-04
---

{{<tweet id="1514079310990254081">}}

Preventing CLS requires setting explicit width and height attributes on all
pictures. Here are the steps I took to optimize the images in hugo using the
[render hooks](https://gohugo.io/templates/render-hooks/) feature.

1. Get the raw image data from a URL
2. Decode the image data
3. If available, set the width & height attributes
4. Otherwise, fallback to the default template without the attributes

Here's the complete code snippet.

```go-html-template
<!-- layouts/_default/_markup/render-image.html -->
{{ $alt := .Text }}
{{ $src := .Destination }}
<!-- Load & decode image -->
{{ $img := os.ReadFile $src | resources.FromString $src }}

{{/* Set Dimensions on Raster Images */}}
{{ if ne $img.MediaType.SubType "svg" }}
  <img
    alt="{{ $alt }}"
    src="{{ $src | safeURL }}"
    width="{{ $img.Width }}"
    height="{{ $img.Height }}"
/>
{{ end }}

{{/* Svgs & Images that failed to load */}}
{{ if or (not $img) (eq $img.MediaType.SubType "svg") }}
  <img src="{{ $src | safeURL }}" alt="{{ $alt }}" />
{{ end }}
```

For this render hook to work, images must be stored in the `/img` folder
relative to the project root with this configuration file.

```yaml
# config.yaml
module:
  mounts:
    - source: static
      target: static
    - source: img
      target: static/img
```

## Further development

- Suport Remote Image sources.
- Support different local image sources _eg: `/content`, `/static` or
  `/assets`_.
- Multiple image formats & sizes.
