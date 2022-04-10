---
title: Static Tweet embed
description: Staticlly embed tweet
author: Ian Muchina
date: 2022-04-03
draft: true
---

[The official tweet embed](https://help.twitter.com/en/using-twitter/how-to-embed-a-tweet)
provides you with a `<blockquote>` element with the tweet text and a third party
script to replace the text with an iframe. 

The official embed has some disadvantages.

- Heavy _(2.5MB)_
- Loads slowly
- Causes the page to shift around when it's done loading.

A faster way of embedding tweets is to create static markup and style it with 
some css. 

I made an one using hugo that looks close to the twitter embed one with most of
twitter's features 

## Showcase

{{<tweet id="1206619392559202309">}}
{{<tweet id="1502719927265943554">}}
{{<tweet id="1492869877459259396">}}

{{<tweet id="1511347529522294788">}}

{{<tweet id="1359546517485404163">}}

{{<tweet id="1493000412042989568">}}

## Inspiration 

This is not an new idea and lots of people have already done it.

{{<tweet id="1342948708799942657">}}

{{<tweet id="1330273157245243394">}}

{{<tweet id="1317703500508397568">}}



<!-- 

Features

- Links
- Opengraph Previews
- Polls
- Images
- Videos 
- Hashflags
- Quote tweets -->
<!-- 

## Hashflags

Hashflags are the custom emoji you see after a twitter hashtag. Here's an example.

{{<tweet id="1503264472781234177">}}

## Getting active hashflags


To get the current hashflags there's an unofficial api you can access at 
`pbs.twimg.com/hashflag/config-{date}.json`

Here's an example on getting the latest hashflags with bash.

```bash
DATE_STR=$(date -u "+%Y-%m-%d-%H")
wget "https://pbs.twimg.com/hashflag/config-$DATE_STR.json"
```

The `-u` flag tells the `date` command to use print the [UTC time](https://en.wikipedia.org/wiki/Coordinated_Universal_Time).
The date format string prints the values as follows.

- `%Y` - Year (2022)
- `%m` - Month (01..12)
- `%d` - Day of month (01..31)
- `%H` - Hour (00..23)

### Archiving hashflag data
The hashflag data is deleted at the start of each month. To archive it, I wrote 
a few scripts to back up the json data & download the images.


Inspiration

- [Static tweets in Eleventy and Hugo](https://www.brycewray.com/posts/2022/02/static-tweets-eleventy-hugo-part-2/)
- [Nextjs Demo](https://static-tweet.vercel.app/)

 -->
