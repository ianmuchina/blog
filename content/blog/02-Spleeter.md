---
title: Isolating vocals from songs using Spleeter
description: Use AI to isolate vocals and instrumentals from songs
url: blog/Spleeter
author: Ian Muchina
image: "https://i.imgur.com/4Rv0z6Y.jpg"
date: 2020-03-08 10:00:00 +03:00
modified: 2020-05-06 10:49:47 +03:00
comments: true
---

Isolating vocals from a song in the past has had a high barrier to entry. It is
now an easy thing to do . In this article, I will go over the various methods.

## 1. The browser method

This is done entirely online. Open a browser, go to a upload a song and get
vocal and instrumental stems. This is a simple method which relies on third
party websites to process the music.

## Steps

The only requirement is a browser.

1.  Go to <a href="https://moises.ai/" target="_blank">moises.ai</a>
2.  Create an account
3.  Upload a song
4.  Wait for the isolation to be done
5.  Enjoy !!

## Advantages

- Can be done from any device with a browser even a mobile phone
- Requires no special knowledge
- Easy user interface

## Disadvantages

- Only 5 uploads per month
- There's a queue that may affect your waiting time

You can use <a href="https://ezstems.com" target="_blank">ezstems.com</a> as an
alternative for more upload options and it works in a simmilar way.

## 2. The App Method

This second method is simmilar to the first, but only uses the computer's
resources. ![Screenshot of image](/img/spleeter/uJrx7GI.jpg)

### Steps

This method only works on windows

1. Download and install the latest version of
   <a href="https://www.python.org/downloads/" target="_blank">Python</a>
2. During the installation make sure add to path checkbox is selected.
3. Download
   <a href="https://github.com/lazydevyo/SpleetGUI/releases" target="_blank">SpleetGUI</a>
4. Extract the zip file
5. Install SpleetGUI

\*I have no idea if it is safe to use

## 3. Command line Method

This last is done entirely from the command line and is great for those familiar
with the command line. For this method, you will require git and
[conda](https://docs.conda.io/projects/conda/en/latest/user-guide/install/).

After they are both installed, type the following commands to install spleeter.

```console
$ git clone https://github.com/Deezer/spleeter
$ conda install -c conda-forge spleeter
```

To run spleeter:

```console
$ python3 -m spleeter -i your_song.mp3 -p spleeter:2stems -o output
```

## How Does it Work?

![xkcd comic](/img/spleeter/machine-learning.webp)

Machine learning is artificial intelligence that can automatically learn from
past data. You give it enough data and it can literally learn like humans,
through practice

For more detailed information, check out the
[spleeter documentation](https://github.com/deezer/spleeter/wiki/2.-Getting-started)

## Conclusion

This is a great tool that can be used to get clean vocals from almost any song.
It also works well to de-noise a track.
