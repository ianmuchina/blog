---
title: Notes on Web Performance
description:
date: 2023-03-31
draft: true
---

There are 2 main things that affect the performance of network-based
applications.

1. **Bandwidth**
2. **Latency**

In an ideal world, the latency is low and bandwidth is high.

Bandwidth problems become more important when the things being sent over the
network are large files while latency issues become more important when the
things being sent become smaller/require realtime feedback

### The Jevons Paradox: Faster sites are slower

These seemingly minor optimizations can be critical if you want to target users
on high latency, low bandwidth environments.

Here's a story about reducing youtube load speeds I found fascinating, showing
how optimizations enable more people to access internet services.

> The product went from being unusable for people with slow connections to
> usable, which caused so many users with slow connections to start using the
> product that load times actually increased.
>
> source: [The modern web on a slow connection](https://danluu.com/web-bloat/)

The irony of making something faster but analytics reports that the app has
become slower is just mind blowing.

note to self: I'm now interested in looking at data from Chrome UX report for
similar insights

I wanted to find the original source, so I did some digging and found a 2017
[csstricks post](https://css-tricks.com/web-really-sucks-slow-connection/)
referencing a blog post from 2012, titled
[Page Weight Matters](https://blog.chriszacharias.com/page-weight-matters), from
an ex-youtube dev about the
[Youtube Feather Project](https://blog.youtube/news-and-events/introducing-feather-lighter-way-to/)
developed back in December 2009

Here's an excerpt

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

> Large numbers of people who were previously unable to use YouTube before were
> suddenly able to.

I also found it interestnig that Youtube Feather and
[SPDY](https://en.wikipedia.org/wiki/SPDY) _(the predecessor to http2)_ were
announced at around the same time.

## Reducing Bandwidth

### Lossless compression

Lossless compression is great for text based content and is the obvious low
hanging fruit when looking at performance.

Here's a chart showing how brotli compression improved load speed and saved
bandwidth.

{{<tweet id="924348105553620994">}}

Notice how the Indian linkedin users get **2%** more out of brotli than the USA
users.

Here's another example where tailwind goees from 1Mb to 33kb

{{<tweet id="1288994693498511360">}}

Here's another one demonstrating even better benefits when using
[brotli shared dictionaries](https://github.com/WICG/compression-dictionary-transport).

Check out the
[chrome status page](https://chromestatus.com/feature/5124977788977152) &
[bug tracker](https://bugs.chromium.org/p/chromium/issues/detail?id=1413922) for
implementation status of custom dictionaries

{{<tw-thread end="1633950510431477761">}}

[Brotli compression using a reduced dictionary](https://blog.cloudflare.com/brotli-compression-using-a-reduced-dictionary/)

There's also zstd from facebook that is simmilar to brotli but not implemented
in browsers {{<tw-thread end="1623722590366752769">}}

### Audio Compression

There isn't that much innovation happening in the audio compression but I found
one interesting thing.

Facebook is
[Using AI for lossy audio compression](https://ai.facebook.com/blog/ai-powered-audio-compression-technique/)
& acheives a 10x size reduction. ie: great audio quality at smaller sizes

Here's a chart showing the difference.

<!-- TODO: Use markdown -->

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

- Use [Multicast](#TODO)

### Image compression

[JPEG-XL](https://jpegxl.info/) is a new universal image format that's good at
everything.

{{<tw-thread end="1346702130623737862">}}

https://encode.su/threads/3544-JXL-reference-software-version-0-2-released?p=67989&viewfull=1#post67989

{{<unsafe>}}
<img loading='lazy' style='aspect-ratio:;border-radius:0' src='/D63zMYd.png'/>
{{</unsafe>}}

http://www.stuartcheshire.org/rants/latency.html

## Latency

The other problem to solve when dealing with web performance is latency,
especially network latency. There's several ways to reduce it.

### Do all the processing locally.

Eliminating the server and doing everything on the client side is a common way
to tackle performance problems.

A good example is [squoosh.app](https://squoosh.app) is much faster than using
an online image compression service since the

This is the main reason client side routing is always used for long running web
applications

{{<tweet id="1513827666406744064">}}

There's one issue with CSR. It's fragile.

Client side routing provides the fastest page navigations but is very fragile
and requires using a lot of tooling and monitoring.

Here's an example video from 2016 showing using github from airport wifi

{{<unsafe>}}
<video muted controls poster='/gh-screenshot.avif' preload='none' style='aspect-ratio:16/9;width:100%;border-radius:8px' src='/4zG0AZRZD6Q-640x360.webm'></video>
{{</unsafe>}}

[source: Youtube](https://www.youtube.com/watch?v=4zG0AZRZD6Q)

SPAs need lots of work to function properly compared to simple MPAs

Doing a lot of things in the client can lead to lots of crashes that defeat the
whole point of improving user experience.

## pre-fetch things the application will need

When visiting some documentation websites like
[kit.svelte.dev](https://kit.svelte.dev/docs/web-standards),
[devdocs.io/](https://devdocs.io/) from a desktop device, the page navigation is
much faster than anything a multi page app could ever do.

Pre fetching things is not always good and could have a negative impact on users
on low-end devices.

Here's a clip from the video
[Clean Code : Horrible Performance](https://www.youtube.com/clip/UgkxnavUDaSW8pEbZAWpDuQDOEmOzHXfXAdE)
on youtube. {{<unsafe>}}
<video controls poster='/destiny-poster.avif' preload='metadata' style='aspect-ratio:16/9;width:100%;border-radius:8px' src='/destiny.webm'></video>
{{</unsafe>}}

The important takeaway here is to measure and test everything and challenge
assumptions. Not that doing things in the client is bad.

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

| queries  |   Mean [s] | Min [s] | Max [s] |     Relative |
| :------- | ---------: | ------: | ------: | -----------: |
| `100`    |  1.2 ± 0.1 |   1.079 |   1.551 |         1.00 |
| `250`    |  1.7 ± 0.2 |   1.546 |   2.165 |  1.41 ± 0.23 |
| `500`    |  2.6 ± 1.0 |   2.095 |   5.667 |  2.20 ± 0.93 |
| `750`    |  2.8 ± 0.0 |   2.840 |   2.957 |  2.40 ± 0.27 |
| `1,000`  |  3.7 ± 0.2 |   3.552 |   4.401 |  3.12 ± 0.41 |
| `2,000`  |  7.7 ± 3.7 |   6.125 |  18.453 |  6.46 ± 3.22 |
| `5,000`  | 24.3 ± 6.3 |  18.985 |  33.615 | 20.21 ± 5.72 |
| `10,000` | 89.8 ± 0.6 |  89.177 |  91.297 | 74.57 ± 8.44 |

browser application. Since twitetr thannk

Move the servers closer to the user for dynamic applications eg: game servers
CDNs

Improve the hardware

Build a own private fiber optic cable network eg:
[Cloudflare Backbone](https://blog.cloudflare.com/cloudflare-backbone-internet-fast-lane/)
and directly lower the latency

[TLS 1.3 0 RTT](https://blog.cloudflare.com/introducing-0-rtt/)

## http2

## Resources

The Website Obesity Crisis:
[https://idlewords.com/talks/website_obesity.htm](https://idlewords.com/talks/website_obesity.htm)

## I

For services serving millions of users or multimedia applications _(ie: netflix,
instagram, spotify, etc)_ bandwidth is a major problem. Significant engineering
effort goes into making these applications require less and less bandwidth.

This i
