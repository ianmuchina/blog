# Tweet shortcode

## Tasks

- Make code reusable with partial templates
- Visual Tests

### Macro Layouts

- [ ] thread
- [ ] focus
- [ ] timeline
- [ ] minimal-thread

### profile-pic

- [ ] focus
- [ ] thread & timeline
- [ ] quote-tweet
- [ ] thread-start - first tweet in thread
- [ ] thread-mid - middle tweet in thread
- [ ] thread-end - last tweet in thread
- [ ] thread-truncated - user clicks to expand thread

### UserInfo

- [ ] Verified
- [ ] in-timeline
- [ ] thread-self
- [ ] thread-reply

### Content

- Text:
  - [ ] whitespace
  - [ ] newlines
  - [ ] emoji
  - [ ] entities:
    - [ ] urls
    - [ ] hashtags
      - [ ] hashflags:
        - [ ] expired
        - [ ] current
    - [ ] symbols
    - [ ] mentions
  - [ ] in-reply-to

- Photos:
  - [ ] 1-4 images
  - [ ] Tags

- Gif:
  - [ ] Gif label
  - [ ] Hide cast icon
- Video:
  - [ ] Handle Multiple qualities

- Cards:
  - [ ] Summary
    - [ ] no image
    - [ ] square image
    - [ ] wide image
  - [ ] Player
  - [ ] App
  - [ ] Spaces: not-started ended
- Voice tweet
- Poll: final & not-final

### Quote tweet

- Test for most combination

### Footer

- stats:
  - [ ] reply
  - [ ] rt
  - [ ] like
  - [ ] quote rt

### Extras

- [ ] twitter logo
- [ ] replace the tweet glyph in twitterchirp
- [ ] source labels
- [ ] x-govt official
- [ ] x-affiliated site
- [ ] restricted reply to x
- [ ] tweet is deleted
- [ ] user is suspended
- [ ] tweet has sensitive media
- [ ] user info on hover.
- [ ] private account.

## css bugs

- [ ] character truncation.
- [ ] line truncation

## component

## Tasks

- size vars
- color vars
- layout change via classes with least dom manipulation
- clean css/scss
- default colors

## shortcode API

Single tweet: id="id_str" mode="focus, timeline, thread" embed="img, video, all"
(media to base64 encode as data uris) embed_max_quality="sd|360, hd|720,
uhd|1080"

Thread: start="id_str" end="id_str" mode="default, minimal, prose"
