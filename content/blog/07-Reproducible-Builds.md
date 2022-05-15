---
title: Reproducible Builds
description: Why are reproducible buids are so important
url: blog/reproducible-builds
author: Ian Muchina
image: "https://i.imgur.com/j7Dmyu2.png"
date: 2021-01-13 11:30:00 +03:00
comments: true
---

A reproducible build is one that produces the same byte for byte output when
given the same input. These builds aren't common. Mostly because of compiler
defaults.

The things that can make a build non-reproducible are:

- Timestamps
- Unique IDs
- Build paths
- _etc_

## Why they matter

Reproducible builds have inherent security. They allow us to verify the source
code a binary comes from. This makes detecting changes or tampering
straightforward.

1. Compile the program on at least two different systems
2. Compare the checksums.
3. If they match, that's good. If they don't match, something is wrong.

The builds have more integrity, which benefits everyone. For security-minded
people, it means a straightforward way of detecting backdoors in the build
process. For open source enthusiasts, it means a clear way of detecting GPL
violations. For everyone else, we get safer software.

You can find out how to acheive reproducible builds at
[reproducible-builds.org/docs](https://reproducible-builds.org).

## Attacks on build systems

Back-doors introduced in the build process are not easy to detect. Most of the
detection happens too late when the damage is already done. The attacks can have
a high impact in a short period, so early detection is important.

There have been many attacks like this in the past. Some of them are:

- [SUNSPOT](https://www.crowdstrike.com/blog/sunspot-malware-technical-analysis/),
  An attack on SolarWinds that affected
  [lots of important people](https://businessinsider.com/tech-insider/heres-a-list-of-the-us-agencies-and-companies-that-were-reportedly-hacked-in-the/n58jz32)
- [XcodeGhost](https://en.wikipedia.org/wiki/XcodeGhost) - Attack on an IDE for
  Mac. Lots of iOS apps were affected. Including Angry Birds

## Defending against them

Reproducible builds are the best way to defend against these kinds of attacks.
Attackers lose their incentive bacause they are detected quickly and need to
compromise more systems.

## The disadvantages

Like everything there are downsides. Some of them are:

- Need to use a specific compiler version
- No
  [Profile-guided optimization](https://en.wikipedia.org/wiki/Profile-guided_optimization)

## What they don't protect us from

Reproducible builds don't protect us from malicious developers. A developer
could knowingly write vulnerable code that looks like a mistake when discovered.
This called underhanded code.

- [Underhanded C Contest](https://en.wikipedia.org/wiki/Underhanded_C_Contest)
- [Underhanded Crypto Contest](https://underhandedcrypto.com/)

In the paper titled
[Trusting Trust](https://www.cs.cmu.edu/~rdriley/487/papers/Thompson_1984_ReflectionsonTrustingTrust.pdf)
Ken Thompson asks us:

> To what extent should one trust a statement that a program is free of Trojan
> horses? Perhaps it is more important to trust the people who wrote the
> software.

## Who does reproducible builds?

Many open-source projects have reproducible builds to assure users of their
integrity. Some of them include:

1. [Bitcoin](https://daniel-lima.github.io/bitcoin-devenv/vagrant/how-to/deterministically-build-bitcoin-core.html)
2. [Tor Browser](https://blog.torproject.org/deterministic-builds-part-two-technical-details)
3. [F-Droid](https://f-droid.org/docs/Reproducible_Builds/?title=Deterministic,_Reproducible_Builds)
4. [Signal](https://signal.org/blog/reproducible-android/.)
5. [Telegram](https://core.telegram.org/reproducible-builds)

You can find more at
[reproducible-builds](https://reproducible-builds.org/projects/)

### Linux distros

Around 80%-90% of the packages in Linux distributions _( Arch, Debian, OpenSUSE,
NixOS, Guix)_ are already reproducible. You can find the exact numbers at
[reproducible-builds.org](https://reproducible-builds.org/citests/).

## Digital signatures

Digital signatures still have their place. They are useful when verifying who a
document or message comes from. They aren't useful when verifying the source
code a binary comes from. Some forms of digital signatures can get in the way of
reproducible builds, as explained by telegram developers in
[this article](https://core.telegram.org/reproducible-builds).

## Conclusion

I'll conclude by quoting Mike Perry of the Tor project. He
[described](https://mailman.stanford.edu/pipermail/liberationtech/2013-June/009257.html#:~:text=believe)
the importance of reproducible-builds as follows:

> I don't believe that software development models based on trusting a single
> party can be secure against serious adversaries anymore, given the current
> trends in computer security.

This statement is true to this day.

---

## Further reading

Many people have written about reproducible builds and have gone into more
detail than I have in this post. Here are some of them.

### [reproducible-builds.org](https://reproducible-builds.org)

A website with technical information on reproducible builds. It also has status
updates on Linux distributions.

### [Reflections on Trusting Trust](https://www.win.tue.nl/~aeb/linux/hh/thompson/trust.html)

A paper by Ken Thompson. He asks us what if compilers had backdoors. Would it
possible to even detect & prevent such an attack?

### [Countering Compiler backdoors ](https://dwheeler.com/trusting-trust/)

David A. Wheeler answers the above question. He proposes a method called Diverse
Double-Compiling.

### [The Octopus Scanner Malware](https://securitylab.github.com/research/octopus-scanner-malware-open-source-supply-chain)

Writeup on the discovery of a supply chain attack that targeted developer's
machines.

### [Verifying the source code for binaries](https://lwn.net/Articles/555761/)

An Lwn article on reproducible builds
