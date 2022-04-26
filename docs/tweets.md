# Tweet shortcode

# Layout
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

- [x] Verified
- [ ] in-timeline
- [ ] thread-self
- [ ] thread-reply

### Content

- Text:
  - [x] whitespace & newlines
  - [ ] twemoji
  - [x] entities
    - [x] urls
    - [x] Hashtags
    - [x] Hashflags
      - [x] expired
      - [x] current
    - [x] Symbols
    - [x] User mentions (not case sensitive)
  - [ ] in-reply-to

- Photos:
  - [x] 1-4 images
  - [ ] GEO Tags
  - [ ] Mention Tags

- Gif:
  - [ ] Gif label with css
  - [ ] Hide cast icon on mobile
- Video:
  - [x] Handle Multiple qualities: only using the best quality

- Cards:
  - [x] Summary
    - [x] no image
    - [x] square image
    - [x] wide image
  - [x] Player
  - [ ] App
  - [x] Spaces: not-started & recording
- [x] - Voice tweet
- [x] - Poll: final & not-final

### Quote tweet

- Test for all combinations

### Footer

- stats:
  - [ ] reply
  - [ ] rt
  - [ ] like
  - [ ] quote rt

### Extras

- [ ] source labels
- [ ] twitter logo
- [ ] replace the tweet glyph in twitterchirp
- [ ] x-govt official
- [ ] x-affiliated site
- [ ] restricted reply to x
- [ ] tweet is deleted
- [ ] user is suspended
- [ ] tweet has sensitive media
- [ ] user info on hover.
- [ ] private account.

## css bugs

- [ ] character truncate
- [ ] line clamp
  - [ ] Opengraph small
  - [ ] Opengraph large
  - [ ] Full Name alongside checkmark

## Fluff

- size variables
- color variables
- macro layout change with css classes
- clean css/scss
- default colors
- Separate repo for modularity

## Props


```ts
interface tweet {
  id: string        // Tweet id string
  mode?: string     // focus, timeline, thread, minimal
  inline?: string   // video, img, gif, profile, all, none
  selfHost?: string // video, img, gif, profile, all, none
}
```


		- hint?: picture, photo, text, icon, drawing
		- crop?: bool
		- sizes:
			# Profile Pic (3)
			- 25x
			- 50x
			- 100x

			# Potrait tall
			- x1200
			- x640
			- x512

			# Landscape
			- 640x
			- 512x
			- 320x

			# 16/9
			- 640x360
			- 320x180
			- 160x90

			# 16/18
			- 640x720
			- 320x360
			- 160x180

