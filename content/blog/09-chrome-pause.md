---
title: "Stop chrome from pausing when switching desktops"
description: Switch between desktop environments without breaking your browser
date: 2021-04-04
url: /chrome-pauses
author: Ian Muchina
tags: [Linux]
comments: true
---

Sometimes I switch desktop environments because, why not? Every time I switch
between gnome and kde, I face the same issue. Chrome pauses.

When chrome displays the paused sign, it’s an issue with cookies. In this case,
the cookies are encrypted, and chrome can’t decrypt them because it’s looking
for the decryption key in the wrong keyring.

## Too many keyrings

A keyring is a lot like a password manager. The only difference is that keyrings
are meant for programs, and password managers are meant for humans.
[For security](https://chromium.googlesource.com/chromium/src/+/master/docs/security/faq.md#does-the-password-manager-store-my-passwords-encrypted-on-disk),
chrome stores the key used to decrypt cookies in the keyring.

All major operating systems have some sort of keyring implementation. Windows
has one, Mac has one. Linux has several. On Linux, chrome decides the keyring it
will use based on the current desktop environment.

When switching desktop environments, chrome will switch keyrings without
migrating the keys. This makes chrome forget the key needed to decrypt the
cookies.

## Stick with one

The solution is to hardcode the keyring chrome will use. You can do this with
the --password-store flag, which has 3 options:

- gnome (to use GNOME Keyring)
- kwallet (to use KDE’s KWallet)
- basic (to use the plain text store. No encryption)

To set the flag, first install menu-libre.

```
sudo apt install menulibre
```

Then using menu-libre, edit chrome’s command.

```
/usr/bin/google-chrome-stable --password-store=kwallet5 %U
```

Hopefully, that works, and you can switch desktops without breaking your
browser.

## Further reading

[Benefits of keyrings](https://wiki.gnome.org/Projects/GnomeKeyring/SecurityFAQ)
