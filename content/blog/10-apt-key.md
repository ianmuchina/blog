---
title: apt-key is not being deprecated for security reasons
description: 
url: blog/apt-key-deprecated
author: Ian Muchina
image: "https://i.imgur.com/z6vWzNg.jpg"
date: 2021-05-19
---

`apt-key` is a tool for managing the keys `apt` uses to verify packages. It is a command-line wrapper around `gpg`.

You cannot install `apt-key`, It is already there, as part `apt`.

```
root@debian:~# apt install apt-key
E: Unable to locate package apt-key
```

Why is it not a separate package? IDK.

## Why it was deprecated

**TLDR:** `apt-key` is not being deprecated for security reasons, but a more boring one, dependencies.

A while back [gpg was removed](https://github.com/Debian/apt/commit/87d468fe355c87325c943c40043a0bb236b2407f) from the list of dependencies in `apt`. This change meant `apt-key` could not work out of the box on a fresh Debian install. Users would have to manually `apt install gpg` if they wanted to use `apt-key`.

[The commit message](https://github.com/Debian/apt/commit/87d468fe355c87325c943c40043a0bb236b2407f) gives the following reason.

> most users will never use apt-key.
> `apt-key` depends on `gpg` to function. However, `apt` only depends on the smaller `gpgv` tool to verify packages.

Pretty self-explanatory. The developers wanted to reduce the install size of `apt`.

## The alternative

The alternative is placing the keys inside `/etc/apt/trusted.gpg.d/`. To add a new key, you would only need `curl` & `echo`.

For example, to install `vscode`.

```sh
# Instal curl
apt update && apt install curl
# Download the gpg key
curl https://packages.microsoft.com/keys/microsoft.asc \
    -o /etc/apt/trusted.gpg.d/microsoft.asc
# Add repo to sources.list
echo deb [arch=amd64] http://packages.microsoft.com/repos/code stable main \
    > /etc/apt/sources.list.d/vscode.list
# Install vscode
apt update && apt install code
```

I think this method is easier to understand & automate than `apt-key`.

## What about security?

Many `apt-key` related articles & answers mention security as the reason for the deprecation. The most common advice is to place keys in `/usr/share/keyrings` instead of `/etc/apt/trusted.gpg.d/`. You then use the `signed-by` feature to limit the repos the key can sign.

This has little security impact. Even the developers implementing the `signed-by` feature [acknowledge it.](https://github.com/Debian/apt/commit/b0d408547734)

> Not immensely useful from a security perspective all by itself

The advice is basically this:

![Meme showing a gate-no-wall.](/img/apt-key/gate-no-walls.jpg)

Don't add repos you don't trust. It's hard to do so securely.

## More on Linux security

[Untrusted Debs](https://wiki.debian.org/UntrustedDebs) - Debian Wiki

[Linux Server "best practices"](https://youtu.be/fKuqYQdqRIs) - Live Overflow
