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
  - [ ] Accessible Overlay
  - [x] Summary
    - [x] no image
    - [x] square image
    - [x] wide image
  - [x] Player
  - [ ] App
  - [x] Spaces: not-started & recording
- [x] - Voice tweet
- [x] - Poll: final & not-final
- [x] - Twitter Topics

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
  id: string; // Tweet id string
  mode?: string; // focus, timeline, thread, minimal
  inline?: string; // video, img, gif, profile, all, none
  selfHost?: string; // video, img, gif, profile, all, none
}
```

```yaml
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
```

## Hashflags

Twitter has a hashflag api at
`pbs.twimg.com/hashflag/config-{yyy}-{mm}-{d}-{h}.json` The time must be in UTC
timezone if you want the get latest data.

The bash `date` utility makes this simple and it's what I use.

Here's an example

```sh
wget "https://pbs.twimg.com/hashflag/config-$(date -u "+%Y-%m-%d-%H").json"
```

The date value is valid for past dates up to the beginning of the current month.
At the start of each month, json responses are not returned. There's also some
responses that return weird 404s that's not readable. Idk what that is.

The hashflag images expire after a while so it's not safe to use the twitter
cdn. The images are named after the campaign name. The campaign names have no
clear format. Updates to the same hashtag might have a `v2` or year number.

I put together some scripts to download the images, and convert the json to
something easier for hugo to handle. The repo is available at
[ianmuchina/HashflagArchive](https://github.com/ianmuchina/HashflagArchive). I
also added past data from the hashflags.io website. The hashflags are

There's also a website with more data at
[talk.tf/hashflags](https://talk.tf/hashflags/)

The Images are pngs and are not optimized. I plan to compress the pngs using
`optipng` and test using `webp` & `avif` variants.

I really like the hashflags.io site and I might add branded likes button
feature.

## Nice accounts

# API Docs

## Auth

Get a valid `Authorization` Header from devtools in incognito. The current one
is
`AAAAAAAAAAAAAAAAAAAAANRILgAAAAAAnNwIzUejRCOuH5E6I8xnZz4puTs=1Zv7ttfk8LF81IUq16cHjhLTvJu4FA33AGWWjCpTnA`
but it might change.

Make `POST` Request to `api.twitter.com/1.1/guest/activate.json` with a valid
Authorization header. The response will be a json object containing the Guest
token.

```json
{
  "guest_token": "12345679890"
}
```

## Tweet Data

Make GET Request to `cdn.syndication.twimg.com/tweet?id=123456` with a valid
tweet id. That's it. Does not require any auth. Does not have all the data eg:
retweet count. The v2 or graphql is way better. Endpoint is used by the official
embed.

## Spaces Data

Make GET Request to `twitter.com/i/api/graphql/{hash}/AudioSpaceById`. The hash
is probably api versoning. Currently using `lFpix9BgFDhAMjn9CrW6jQ` but it might
get outdated.

From there you can inspect the json for the space details and participants.

It's a lot of trouble to keep up with the unofficial api and I plan on using the
v2 api but It currently works

There's an extra step if you want the actual recording. For now I just redirect
to the twitter page. I like the UI, especially the captions.

I made a basic cli tool to get the m3u link. That you can paste in vlc or
download with youtube dl. I plan on using http2 for fast downloads and natively
merging the aac files in go. I'm not sure about directly hosting the space
recordings on my site. Maybe uploading to a platform.

I mostly got the cli idea from a
[89z/mech](https://github.com/89z/mech/tree/master/twitter)
