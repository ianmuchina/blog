---
title: Running my website on $1 monthly
description: My website costs me less than a dollar monthly to run. I take advantage of a few free services to achieve this.
url: blog/site-cost
author: Ian Muchina
image: "https://res.cloudinary.com/muchina/image/upload/v1589888887/pexels-photo-3584969_nguh5o.jpg"
date: 2020-05-19 14:30:00 +03:00
modified: 2020-05-19 19:30:00 +03:00
comments: true
---

This website costs me almost nothing to run. I take advantage of a few free services. This site is [fast](https://developers.google.com/speed/pagespeed/insights/?url=https%3A%2F%2Fianmuchina.com%2F) and looks okay. Here's what I use.

## 1. DNS : Cloudflare

![](/img/site-cost/cloudflare.svg)

DNS is what enables the translation of website names to IP addresses.
I use Cloudflare to manage the DNS of my domain at `ianmuchina.com`. I can have unlimited subdomains.

## 2. CDN: Cloudflare

Cloudflare have over 200 datacenters worldwide meant for just this purpose.
![](/img/site-cost/cloudflare-network.webp)

When using Cloudflare's Content Delivery Network, someone in Nairobi gets the site assets from a datacenter in Mombasa instead of somewhere further like France or USA.

A content delivery network greatly improves speed.

## 4. Framework : Hugo

![](/img/site-cost/jekyll.svg)

I use Jekyll to generate the static files of my website. Jekyll has some awesome free themes. However it can take a bit of time to configure for those not familiar with it.

## 5. Hosting: Cloudflare + GitHub

![](/img/site-cost/Netlify_logo.svg)

Netlify is what builds my site from the configuration files of my site. I use netlify with github. The static content is regenerated anytime I modify the config files

## 6. Domain Registrar - CLoudflare

![](/img/site-cost/Namecheap-Logo.svg)

One gets a domain from a domain registrar. You can get a free one from [Freenom](https://www.freenom.com). I have a freenom domain that I dont use at muchina.gq, but I abandoned it in favor of ianmuchina.com. Most .com domains are not that expensive and cost around $12 per year.

## 7. SSL: Cloudflare

![](/img/site-cost/ssl.svg)

A site with SSL correctly configured has a padlock alongside the domain name. When using the cloudflare CDN, your site automatically gets free SSL

## TLDR:

_Take advantage of Cloudflare & Github Pages and just pay for the domain._