---
title: Static twitter embed
description: Writing a hugo embed shortcode
author: Ian Muchina
date: 2022-04-10
draft: true
---

[The official tweet embed](https://help.twitter.com/en/using-twitter/how-to-embed-a-tweet)
provides you with a `<blockquote>` element with the tweet text and a third party
script to replace the text with an `<iframe>`. 


It works but it has some disadvantages.

- Heavy _(>2MB)_
- Loads slowly
- Causes the page to shift around when the `<iframe>` finally loads

A faster way of embedding tweets is to make it static. 
I made a hugo shortcode to embed tweets and it looks close enough to the 
official one. It has most features of the tweet embed (_other than proper quote 
tweet support_).


I added a few extra features not available with the official twitter embed.

- Support for the `avif` and `webp` image encoding formats.
- Self hosting pictures and videos
- Hashflags

All this was a pain to write and made me consider migrating to a javascript 
based static site genereator.


## Showcase

Here are some examples

Poll
{{<tweet id="1504102594192584705">}}

Video
{{<tweet id="1511347529522294788">}}

Image
{{<tweet id="1369539386744901632">}}

4 Images
{{<tweet id="1492869877459259396">}}
3 Images
{{<tweet id="869317433814904832">}}
