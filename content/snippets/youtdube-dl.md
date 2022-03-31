---
title: youtube-dl
description: Making youtube-dl easy to use
permalink: /blog/youtube-dl-aliases
author: Ian Muchina
date: 2021-03-26 08:00:00 +03:00
tags: [tips]
comments: true
---
## Default

```sh
alias ydl='youtube-dl -o "./%(title)s.%(ext)s"'
```
* Doesn't change much of the defaults. Only removes unnecessary info from filename  eg: `video-title-dQw4w9WgXcQ.mp4 `  to  `video-title.mp4`

## 720p single video

```sh
alias yhd='youtube-dl -f "[height<=720]" -o "~/Videos/%(uploader)s/%(title)s.%(ext)s" --no-playlist '
```

* 720p
* Single video. No playlist
* Saves to `~/Videos/Uploader/Title.mp4`

## 720p video playlist

```bash
alias ypl='youtube-dl  -f "[height<=720]" -o "~/Videos/%(uploader)s/%(playlist)s/%(title)s.%(ext)s" '
```
* 720p
* Downloads entire playlist
* Saves to `~/Videos/Uploader/Playlist/Title.mp4`

## Audio

```sh
alias ymp3='youtube-dl -f "bestaudio" -o "~/Music/%(uploader)s/%(title)s.%(ext)s" --no-playlist -x --audio-format mp3 --embed-thumbnail ' 
```
* mp3
* Single audio. No playlist
* Saves to `~/Music/Uploader/Title.mp3`
* Adds thumbnail as cover art

## Audio Playlist

```sh
alias ypl3='youtube-dl -f "bestaudio" -o "~/Music/%(uploader)s/%(playlist)s/%(title)s.%(ext)s" -x --audio-format mp3 --embed-thumbnail'
```

* Downloads entire playlist
* Saves to `~/Videos/Uploader/Playlist/Title.mp3`
* Adds thumbnail as cover art