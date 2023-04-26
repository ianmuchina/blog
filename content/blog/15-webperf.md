---
title: Notes on Web Performance
description:
date: 2023-04-26
---

There are 2 main things that affect the performance of network-based
applications.

1. Bandwidth
2. Latency

In an ideal world, the latency is low and bandwidth is high.

Bandwidth problems become more important when the things being sent over the
network are large files ie: >1MB. Latency issues become more important when the
things being sent become smaller/require realtime feedback ie: < 100kb.

Reducing page size & The time to first byte can be critical if you want to
target users on high latency, low bandwidth environments.

### The Jevons Paradox: Faster sites report slower loads

Back in 2008, the youtube website was around 1MB. The developers weren't happy
with that and created The
[Youtube Feather Project](https://blog.youtube/news-and-events/introducing-feather-lighter-way-to/)
to reduce the page size. The prototype with limited features was made in 3 days
and weighed around 98KB.

They did an A/B test with a few users for 1 week. After collecting and analyzing
the data the developers were confused. The page latency increased under Feather.

The reason? Geography.

> When we plotted the data geographically and compared it to our total numbers
> broken out by region, there was a disproportionate increase in traffic from
> places like **Southeast Asia**, **South America**, **Africa**, and even remote
> regions of **Siberia**. Further investigation revealed that, in these places,
> the average page load time under Feather was over **TWO MINUTES**! This meant
> that a regular video page, at over a megabyte, was taking more than **TWENTY
> MINUTES** to load! This was the penalty incurred before the video stream even
> had a chance to show the first frame. Correspondingly, entire populations of
> people simply could not use YouTube because it took too long to see anything.
> Under Feather, despite it taking over two minutes to get to the first frame of
> video, watching a video actually became a real possibility. Over the week,
> word of Feather had spread in these areas and our numbers were completely
> skewed as a result.

You can find the full post at
[Page Weight Matters](https://blog.chriszacharias.com/page-weight-matters)

The irony of making something faster but analytics reports slower loads is very
interesting. The general term for it is
[the Jevons Paradox](https://en.wikipedia.org/wiki/Jevons_paradox) and it
applies to many things eg: Website loading speed, electricity consumption _etc_.

I also found it interesting that Youtube Feather and
[SPDY](https://en.wikipedia.org/wiki/SPDY) _(the predecessor to http2)_ were
announced at around the same time.

I guess this is why milisecond improvements in page loads can increase revenue.

## Reducing Bandwidth

### Lossless compression

Lossless compression is great for text based content and is the obvious low
hanging fruit when looking at reducing bandwidth.

Here's a chart showing how brotli (a compression format) was used to improve
load speed and save bandwidth.

{{<tweet id="924348105553620994">}}

Notice how the Indian linkedin users get **2%** faster loads out of brotli than
the USA users.

Here's another example with tailwindcss.

{{<tweet id="1288994693498511360">}}

## Delta Compression

Delta compression is very useful when compressing a lot of similar data. If you
have a one line update to a file, you'd only need to download/store the one line
change, regardless of the original file size. This is very useful when doing a
lot of incremental changes.

The most common use of it is probably git. Another great example is the
[manyclangs](https://github.com/elfshaker/manyclangs) project which uses
[elfshaker](https://github.com/elfshaker/elfshaker) to compress **2,000** clang
builds from **400 GiB** down to **100 MiB** and only takes 4 seconds to load any
build.

Delta compression is also very useful when storing backups. You can use the
[bup](https://github.com/bup/bup) tool, if you want to compress lots of simmilar
files eg: excel sheets but don't want to directly use git.

I'd love if chromium had something like this so i can run any chrome version I
want.

## Shared Dictionaries

Dictionaries are commonly used to increase compression ratios for specific
loads. A dictionary contains things that appear frequently and take lots of
space.

The web platform will soon add support for compression dictionaries

- [Compression dictionary transport](https://github.com/WICG/compression-dictionary-transport)

Brotli has a feature where you can compress a new file using an old one as a
dictionary and can improve compression ratios dramatically.

I did some tests and they can be really good.

Compressing typescript version `5.0.2` with version `5.1.0-beta` as a shared
dictionary

brotli: 642KB brotli+dict: 135KB

This is good news for sites that make constant updates.

{{<tw-thread end="1633950510431477761">}}

You can perform test on your data at
[test.patrickmeenan.com/shared-brotli/static/](https://test.patrickmeenan.com/shared-brotli/static/)

Check out the
[chrome status page](https://chromestatus.com/feature/5124977788977152) &
[bug tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=1413922) for
implementation status of custom dictionaries.

Here's the script I used

```sh
#!/bin/bash
rm ./*.br
rm ./*.js

dict="cdnjs.cloudflare.com/ajax/libs/typescript/5.0.2/typescript.min.js"
new="cdnjs.cloudflare.com/ajax/libs/typescript/5.1.0-beta/typescript.min.js"
dec="smol.s"

# Compress using File as dictionary
echo "encoding shared br"
brotli -q 5 $new -o "$dec.shared.br" -D $dict
echo "encoding basic br"
brotli -q 5 $new -o "$dec.basic.br"

# verify
echo "decoding basic br"
brotli -d "$dec.basic.br" -o "basic-decoded.js"

echo "decoding shared br"
brotli -d "$dec.shared.br" -D $dict -o "shared-decoded.js"

echo "decoding shared br"
sha256sum $new "shared-decoded.js" "basic-decoded.js"
exa --no-user --no-time --no-permissions -l ./*.br
```

## Zstandard

Zstandard (zstd) is a compresion format from facebook that is simmilar to brotli
but requires less cpu for comparable compression ratios to brotli. It's sadly
not implemented in browsers. Here's a chart comparing them

{{<tw-thread end="1623722590366752769">}}

### Audio Compression

There isn't that much innovation happening in the audio compression but I found
one interesting thing.

Facebook is
[Using AI for lossy audio compression](https://ai.facebook.com/blog/ai-powered-audio-compression-technique/)
& acheives a 10x size reduction. ie: great audio quality at smaller sizes

Here's a chart showing the difference.

{{<unsafe>}}
<img loading='lazy' style='aspect-ratio:16/6;border-radius:0' src='/ai-sota-chart.webp'/>
{{</unsafe>}}

And Here's a video demonstrating the quality differences

{{<unsafe>}}
<video preload='metadata' controls poster='/poster-1.webp' style='aspect-ratio:16/9;width:100%;border-radius:8px' src='/311255641_624060969400419_1641488416212193643_n.mp4'></video>
{{</unsafe>}}

### Video Compression

Youtube uses their own custom chips for video compression.
[Warehouse-scale video acceleration: co-design and deployment in the wild](https://dl.acm.org/doi/abs/10.1145/3445814.3446723)

[The Alliance for Open Media](https://en.wikipedia.org/wiki/Alliance_for_Open_Media),
which is behind the [av1 video codec](https://en.wikipedia.org/wiki/AV1) & the
[avif image format](https://en.wikipedia.org/wiki/AVIF)

- [IP Multicast](https://www.bbc.co.uk/rd/projects/dynamic-adaptive-streaming-ip-multicast-dasm) -
  To reduce server load for broadcast streams eg: Sport Events, National events,
  etc

### Image compression

[JPEG-XL](https://jpegxl.info/) is a new universal image format that's good at
everything.

{{<tw-thread end="1346702130623737862">}}

{{<unsafe>}}
<img loading='lazy' style='aspect-ratio:;border-radius:0' src='/D63zMYd.png'/>
{{</unsafe>}}

[Chart is from encode.su](https://encode.su/threads/3544-JXL-reference-software-version-0-2-released?p=67989&viewfull=1#post67989)

## Latency

The other problem to solve when dealing with web performance is latency,
especially network latency. I really like the post titled:
[It's the Latency, Stupid](http://www.stuartcheshire.org/rants/latency.html)
which goes over why latency is important and why it's hard to reduce it compared
to increasing bandwidth.

There's several ways to reduce latency as a developer.

### Do all the processing locally.

Eliminating the server and doing everything on the client side is a common way
to tackle performance problems.

A good example is [squoosh.app](https://squoosh.app) an image compression web
app. It uses webAssembly which is slower than native but overall much faster
than using an online image compression service for one-off transformations.

Latency is the main reason Single Page Apps are a thing and why client side
routing is always used for long running web applications.

{{<tweet id="1513827666406744064">}}

There's one issue with client side routing, it's fragile and requires a lot of
tooling and monitoring. Although that's an implementation detail not tied to all
SPAs. There's SPA frameworks like [elm](https://elm-lang.org/) with
[zero runtime exceptions](https://vitez.me/elm-runtime-error).

Here's a video from 2016 showing a bug (hopefully fixed?) when using github from
airport wifi. Opening a new tab was faster than the client router.

{{<unsafe>}}
<video muted controls poster='/gh-screenshot.avif' preload='none' style='aspect-ratio:16/9;width:100%;border-radius:8px' src='/4zG0AZRZD6Q-640x360.webm'></video>
{{</unsafe>}}

[source: Youtube](https://www.youtube.com/watch?v=4zG0AZRZD6Q)

SPAs need more work to function properly compared to simple MPAs, especially for
document based sites. Doing a lot of things in the client can lead to more
crashes that defeat the whole point of improving user experience.

## pre-fetch things the application will need

When visiting some documentation websites like
[kit.svelte.dev](https://kit.svelte.dev/docs/web-standards),
[devdocs.io/](https://devdocs.io/) from a desktop device, the page navigation is
much faster than anything a multi page app could ever do.

Pre fetching things is not always good and could have a negative impact on users
on low-end devices.

## Use modern protocols

Specifically, adjust the backend to support batch requests and enable modern
protocols like http2 and http3.

It's pretty easy to setup a http2 server but surprisingly hard to make http2
requests from some languages. The solutions I could find that required little
configuration were the command line tools [`curl`]() & [`wget2`]() and the
python [httpx](https://www.python-httpx.org/http2/) library.

I liked the python one since it allowed me to reuse a client in 3 lines of code
despite me not really writing that much python code

Here's an example

```python3
client = httpx.AsyncClient(http2=True)
response = await client.get(...)
print(response.http_version)
# "HTTP/1.0", "HTTP/1.1", or "HTTP/2".
```

I noticed the benefit of `http2` when I had to making more than 10,000 http
requests to the twitter api for my archive-browser application. I did some tests
using curl and the difference is big

browser application. Since twitetr thannk

Move the servers closer to the user for dynamic applications eg: game servers
CDNs

Improve the hardware

Build a own private fiber optic cable network eg:
[Cloudflare Backbone](https://blog.cloudflare.com/cloudflare-backbone-internet-fast-lane/)
and directly lower the latency

## Measurments & analytics

All these are great strategies but need to be measurably faster espacially if
you have more users. Here's a story about how netflix preloading data lead to
increased crashes & less engagement, which is bad.

{{<unsafe>}}
<video controls poster='/destiny-poster.avif' preload='metadata' style='aspect-ratio:16/9;width:100%;border-radius:8px' src='/destiny.webm'></video>
{{</unsafe>}} Source:
[Clean Code : Horrible Performance](https://www.youtube.com/clip/UgkxnavUDaSW8pEbZAWpDuQDOEmOzHXfXAdE)
on youtube

The important takeaway here is to measure and test everything and challenge
assumptions. Not that doing things in the client is bad.

## You are not Google

All these tips are only important if you have a lot of users on restricted
devices. If you have few users on predictable hardware and your app works,
performance isn't really that important

## Further reading

Here's some relevant links

- [Brotli compression using a reduced dictionary](https://blog.cloudflare.com/brotli-compression-using-a-reduced-dictionary/)
- [Improving compression with a preset DEFLATE dictionary](https://blog.cloudflare.com/improving-compression-with-preset-deflate-dictionary/)
- [The Website Obesity Crisis](https://idlewords.com/talks/website_obesity.htm)
- [The modern web on a slow connection](https://danluu.com/web-bloat/)
- [web-really-sucks-slow-connection](https://css-tricks.com/web-really-sucks-slow-connection/)
- [How the BBC and ITV are fixing delays on World Cup live streams](https://www.wired.co.uk/article/england-vs-croatia-live-stream-bbc-iplayer-itv)

## More topics

I haven't covered everything performance related. Here's some of the topics.

- http2 & http3 multiplexing
- [TLS 1.3 0 RTT](https://blog.cloudflare.com/introducing-0-rtt/)
- Lighthouse
- Profiling websites with v8 profiler
- CSS Performance (is it even a thing)
- Image codec cpu usage
- Geographical Distribution
- Zstandard custom dictionaries
- Brotli cpu usage benchmarks vs other codecs for compression on the fly
- Image compression services
- Service Workers
