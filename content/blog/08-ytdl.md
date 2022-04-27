---
title: Some youtube-dl aliases
description: Making youtube-dl easy to use
permalink: /blog/youtube-dl-aliases
author: Ian Muchina
date: 2021-03-26 08:00:00 +03:00
comments: true
---


Setup some variables 

```bash
# Default Command
CMD="youtube-dl"

# Use yt-dlp if avaiable
command -v yt-dlp >/dev/null &&
  CMD="yt-dlp" ARGS=""

# Quality Options
Q_HD="720"
Q_FHD="1080"
Q_DEFAULT="$Q_HD"
```

### Default command

Saves video to `~/Videos/Channel/video.mp4` without video Id.
```sh
# Video
ydl() {
  "$CMD" "$ARGS" \
    --no-playlist \
    --embed-subs \
    --format "[height<=$Q_DEFAULT]" \
    --output "$HOME/Videos/%(uploader)s/%(title)s.%(ext)s" "$@"
}
```

## 720p Video
- Single video
- No playlist
- Saves to `~/Videos/Uploader/Title.mp4`

```bash
# Video (720p)
yhd() {
  "$CMD" "$ARGS" \
    --no-playlist \
    --embed-subs \
    --format "[height<=$Q_HD]" \
    --output "$HOME/Videos/%(uploader)s/%(title)s.%(ext)s" "$@"
}
```

## 720p video playlist

- Download entire playlist
- Saves to `~/Videos/Uploader/Playlist/Title.mp4`

```bash
ypl() {
  "$CMD" "$ARGS" \
    --yes-playlist \
    --format "[height<=$Q_DEFAULT]" \
    --output "$HOME/Videos/%(uploader)s/%(playlist)s/%(title)s.%(ext)s" "$@"
}
```

## Audio

- Outputs to mp3
- Does not download entire playlist
- Saves to `~/Music/Uploader/Title.mp3`
- Embeds Video thumbnail as cover art

```bash
# Audio
ymp3() {
  "$CMD" "$ARGS" \
    --extract-audio \
    --audio-format mp3 \
    --no-playlist \
    --embed-thumbnail \
    --format "bestaudio" \
    --output "$HOME/Music/%(uploader)s/%(title)s.%(ext)s" "$@"
}
```

## Audio Playlist

- Saves to `~/Videos/Uploader/Playlist/Title.mp3`
- Adds thumbnail as cover art

```bash
# Audio Playlist
ypl3() {
  "$CMD" "$ARGS" \
    --extract-audio \
    --audio-format mp3 \
    --yes-playlist \
    --embed-thumbnail \
    --format "bestaudio" \
    --output "$HOME/Music/%(uploader)s/%(playlist)s/%(title)s.%(ext)s" "$@"
}

```

