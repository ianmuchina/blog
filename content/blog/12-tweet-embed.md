---
title: Static twitter embed
description: Embeding tweets as plain html and css
author: Ian Muchina
date: 2022-04-20
draft: false
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
- Hard to style
- Does not preserve deleted tweets

## The solution

A good solution would be to get the tweet data from the api then use plain HTML 
& CSS to display it. This will give you perfect lighthouse scoes.

I implemented one for this blog. Here's an example.

```html
{{</*tweet id="20"*/>}}
```

{{<tweet id="20">}}


I had a lot of fun implementing it and I even added some features not available
in the official embed.

## Features

### OpenGraph Previews

{{<tweet id="1459194182459961346">}}

{{<tweet id="1480948780769976328">}}

{{<tweet id="1445135742561394692">}}

### Polls

{{<tweet id="1504102594192584705">}}

### Hashflags

One of the unreleased features I added were hashflags, the emojis that appear after a hashtag.

Here's an example using an expired hashflag.

{{<tweet id="1400374052087238658">}}

There's no official hashflag api but  display hashflags on my embed I used an unofficial api that returns a list of
the active hashflags. The url is {{<unsafe>}}<a href="#" id="hashflag_link">https://pbs.twimg.com/hashflag/config-2022-03-22-18.json</a>{{</unsafe>}}

<!-- Script to update the link above with a valid url -->
{{<unsafe>}}
    <script>
    // Changes html link from js
    function setHLink(){
    let date = new Date().toISOString().split('T')[0];

    let url = `pbs.twimg.com/hashflag/config-${date}-00.json`

    hashflag_link.innerText = url
    hashflag_link.href = `https://${url}`
    }
    setHLink()
    </script>
{{</unsafe>}}

The api only returns data for dates within the current month. I made an archive
repo on github that automatically updates itself using github actions. I was 
able to get some useful data from the [hashflags.io](https://hashflags.io) website.


## Spaces

I also added a Twitter spaces card. It's simple and only links to the space page
on twitter.com which is a better experience for users.

{{<tweet id="1508565972147326977">}}

## The ideal implementation

My implementation only works on hugo. An ideal implementation would consist of 
two parts:

1. A publicly accessible api to return the plain html.
2. A customizable CSS file to style the markup

This has some advantages:

- Works on any static site generator/CMS
- Websites are free to modify the styles
