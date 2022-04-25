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

## Images

## Hashflags

Hashflags are emojis that appear after a twitter hashtag. Here's an example

{{<tweet id="1499276391157805058">}}

To display hashflags I needed the data. There's an unofficial api to get active
data on hashflags at
{{<unsafe>}}
    <a href="#" id="hashflag_link">https://pbs.twimg.com/hashflag/config-2022-03-22-18.json</a>
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

The api only returns data for dates within the current month. To archive it, I 
made a github repo containing all the data I could 
find. I got past data from hashflags.io and got the recent data directly from the
api. The repo uses github actions to update itself when there's a new hashflag.

## Examples

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
