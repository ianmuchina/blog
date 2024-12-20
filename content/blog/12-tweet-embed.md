---
title: Static twitter embed
description: Embedding tweets as plain HTML and CSS
author: Ian Muchina
date: 2022-04-20
draft: false
image: "https://ianmuchina.com/img/og/tw.png"
---

[The official tweet embed](https://help.twitter.com/en/using-twitter/how-to-embed-a-tweet)
provides you with a `<blockquote>` element containing the tweet text and a third
party script to replace it with an `<iframe>` containing a better UI.

Here's an example of the code twitter provides.

```html
<!-- Markup-->
<blockquote class="twitter-tweet">
  <p>just setting up my twttr</p>
  — jack⚡️ (@jack) March 21, 2006
</blockquote>
<!--Script to enhance markup-->
<script src="https://platform.twitter.com/widgets.js"></script>
```

## The problem

This method of embedding tweets has some disadvantages:

- Causes a lot of [layout shifting](https://web.dev/optimize-cls/)
- Difficult to style
- Does not preserve deleted tweets

## The solution

A good solution would be to get the tweet data from the API then use plain HTML
& CSS to display it, which gives you the best lighthouse scores.

I implemented one for this blog. Here's an example.

```html
{{</*tweet id="20"*/>}}
```

{{<tweet id="20">}}

I had a lot of fun implementing it. I even added some features not available in
the official embed.

## Features

### Quote tweets

{{<tweet id="1513827666406744064">}}

### Threads

{{<tw-thread end="1520089470791557121">}}

{{<tw-thread end="1501634551151411200">}}

### OpenGraph Previews

{{<tweet id="1459194182459961346">}}

{{<tweet id="1480948780769976328">}}

{{<tweet id="1445135742561394692">}}

### Polls

{{<tweet id="1504102594192584705">}}

### Images

If supported, profile pictures & images are served as `webp`, which provides
smaller sizes than jpeg and is supported in
[90% of browsers](https://caniuse.com/webp)

<!-- 2 -->

{{<tweet id="1408575349286326272">}}

<!-- 3 -->

{{<tweet id="869317433814904832">}}

<!-- 4 -->

{{<tweet id="861627479294746624">}}

### Gifs & Videos

<!--  Gif  -->

{{<tweet id="870042717589340160">}}

<!--  The weekend  -->

{{<tweet id="1509951833321578499">}}

 <!--  Music  -->

{{<tweet id="1513944715703504914">}}

### Hashflags

One of the unreleased features I added were hashflags, the emojis that appear
after a hashtag.

Here's an example using an expired hashflag.

{{<tweet id="1400374052087238658">}}

The code that archives deleted hashflags can be found at
[github.com/ianmuchina/HashflagArchive](https://github.com/ianmuchina/HashflagArchive)
repo. It updates itself via github actions and a script.

## Spaces

I also added a Twitter spaces card. It's simple and only links to the space page
on twitter.

<!-- Note: Deleted -->

{{<tweet version="2022" id="1513569873439326209">}}

After the space expires it will display like this.
{{<tweet version="2022" id="1506727406609920003">}}

More tests are available at

[drafts.blog-byl.pages.dev/tests/tweet/](https://drafts.blog-byl.pages.dev/tests/tweet/)

### Deleted tweets

Tweets are still shown if they get deleted.
{{<tweet version="2022" id="1520174956310671364">}}

## Further development

- More Test cases
- avif file format
- Threads
- Image zooming
- Image placeholders
