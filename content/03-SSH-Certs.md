---
title: Why SSH certificates are awesome
description: How Certificates are used by big tech companies to secure thousands of servers
url: blog/ssh-certificates
author: Ian Muchina
image: "https://i.imgur.com/3vXme79.jpg"
date: 2020-05-15 11:30:00 +03:00
modified: 2020-05-15 10:30:00 +03:00
comments: true
---

Big Tech companies such as Facebook, Google, Netflix, Uber with thousands of users and servers use SSH Certificates to manage access. This post will go over why that's the case

## What is SSH?

SSH is a protocol used by system administrators and developers to communicate securely with a server. Authentication can be done with SSH keys or passwords.

## Passwords and why they’re not recommended

We all know passwords and have used them at some point. Those secret string of characters you have to remember to prove your identity.

![How many times have you forgotten your password?](/img/posts/ssh_certs/2fYbsnl.png.webp)

Passwords are good and better than nothing, but securing a server with just a password is not recommended especially on critical systems.

1. Weak passwords can be brute-forced
2. Sometimes passwords have to be shared for group accounts.
3. Only one compromised server is enough to phish all user credentials.
4. Revocation of compromised user passwords is not easy or convenient
5. Without a second factor, they are a single point of failure

You can improve the security by using tools like fail2ban to block IP addresses that have multiple failed login attempts.

## Why use keys?

Keys are the default authentication method on most cloud providers eg: Digital Ocean. There is a good reason for this. Keys are more secure than passwords

> SSH keys are a matching set of cryptographic keys which can be used for authentication.

![Keys are awesome](/img/posts/ssh_certs/jC5HqKn.png.webp)

> Each set contains a public and a private key. The public key can be shared freely without concern, while the private key must be vigilantly guarded and never exposed to anyone. source

## Why SSH Keys are more secure

- One user account can have multiple keys. This makes auditing easier
- Keys can be password protected. Note the password is just for unlocking the key and never sent to the server
- Keys can be combined with passwords
- Keys can be revoked

Keys are created with the `ssh-keygen` command.

When creating keys, it is a good idea to encrypt them with a password. So that even if the key is leaked, the password will add another layer of security.

## Managing SSH keys

To connect to a server using keys, a user’s public key has to be in the authorized_keys file on every server they want to connect to.

This method of managing keys is the most common and works okay for small teams but it can be a burden for large organizations with many users.
![Managing keys is a pain](/img/posts/ssh_certs/RHoK5W9.png.webp)

> But growth creeps upon you, and before you know it you are securing significant assets with sub-standard methods

Key management issues

- The `authorized_keys file` on all servers has to be maintained regularly
- Issuing a new key is a long process
- Losing a key locks you out

The task of updating the `authorized_keys` file can and should be automated for large companies. This method "works" but there is a much better alternative

## SSH Certificates

This is where public keys are signed by a Certificate Authority(CA). This method scales very well across thousands of machines. It can be used for both user and host verification. This method eliminates the Trust on first use requirement.
![Certificates are never talked about that much](/img/posts/ssh_certs/KnaoAHm.png.webp)

### Advantages of certificates

SSH certificates are underrated and awesome in my opinion. They have some good features:

- Server configuration is done only once
- Updating the `authorized_keys` file on every server is not needed.
- Audits are easier since every key is unique
- Works perfectly for giving users access to offline/air-gapped servers
- Keys can expire

## Available Metadata

The signed key can contain the following useful information

### 1. Key Expiry date & time

This is how long a key is valid. The value can range from minutes to years.
Netflix set their certificates to expire after two minutes. That's enough time for a developer to login into a server and start an ssh session. Note that the session does not terminate when a certificate expires, only when a user logs out

#### 2. Principals

Principals control which user accounts and hosts a user has access to.
For example, there can be a `root_staging` principal which allows users to login as root on a staging server

You can Parse this data offline with `ssh-keygen -Lf /Path/To/Signed_Cert`

You can also use [this site](https://gravitational.com/resources/ssh-certificate-parser/)

## Open Source Implementations

There are many solutions to giving users SSH access. All these are available on GitHub. Note that documentation is not that good for some tools though
![](/img/posts/ssh_certs/uphOO5p.png.webp)

### 1. [Keybase Certificate Authority bot](https://keybase.io/blog/keybase-ssh-ca)

This is a keybase chatbot that signs public keys. it is cli based. The bot doesn't need any ports open.

- Used internaly @ Keybase
- Only supports keybase Authentication
- Good [Documentation](https://keybase-ssh-ca-bot.readthedocs.io/en/latest/)

[Blog post](https://keybase.io/blog/keybase-ssh-ca) on keybase SSH

#### 2. [Cashier ](https://github.com/nsheridan/cashier)

- Controlled via a web interface
- Integrates well with LDAP or Active Directory
- Google, Github or Gitlab login available
- Key revocation page

[Video](https://youtu.be/NCEQj27A3XA) on The Tool

#### 3. [BLESS - By Netflix](https://github.com/Netflix/bless)

- Used internally @ Netflix,
- Runs on AWS Lambda
- [Video](https://youtu.be/JwLGsWYVjqU) on the tool

#### 4. [SSHrimp - by Stoggi](https://github.com/stoggi/sshrimp)

- Runs on AWS Lambda
- Authenticate with OpenID connect
- Still in Beta

### 5. [Keymaster - Symantec](https://github.com/Cloud-Foundations/keymaster)

- Supportts Oauth2 login
- Integrates well with LDAP/Active Directory
- Made by Symantec
- [Documentation](https://github.com/Cloud-Foundations/keymaster/blob/master/docs/Keymaster-DesignDoc.md)

_More Tools_

- [Smallstep CA](https://github.com/smallstep/certificates)
- [Uber's PAM module](https://github.com/uber/pam-ussh)

### Video Resources

For those that prefer videos to blog posts

- [Public key Cryptography Explained](https://www.youtube.com/watch?v=GSIDS_lvRv4)
- [The Key Exchange Problem](https://www.youtube.com/watch?v=vsXMMT2CqqE)
- [Conference Talks on SSH Certificates](https://www.youtube.com/playlist?list=PLYiD9Y1aw76Y0NlUeFDl_YWfkZmdRcYpj)

## Further Reading

I'm not the first one to write about this topic, so here's related content covering it

### Blog Posts

- [ How SSH is secured At Facebook](https://engineering.fb.com/production-engineering/scalable-and-secure-access-with-ssh/)
- [ SSH at scale - CAs and Principals](https://medium.com/@dmuth/ssh-at-scale-cas-and-principals-b27edca3a5d)
- [ How to SSH Properly](https://gravitational.com/blog/how-to-ssh-properly/)
- [If you’re not using SSH certificates you’re doing SSH wrong](https://smallstep.com/blog/use-ssh-certificates/)

![](/img/posts/ssh_certs/YqKOBwg.png.webp)

### Whitepapers and Manuals

- [Redhat Deployment Guide](https://access.redhat.com/documentation/en-us/red_hat_enterprise_linux/6/html/deployment_guide/openssh-sssd)
- [NIST whitepaper on SSH automation](https://nvlpubs.nist.gov/nistpubs/ir/2015/NIST.IR.7966.pdf)
- [IETF Memo on recomended practice](https://tools.ietf.org/html/draft-ylonen-sshkeybcp-01)
- [ssh-keygen manual](https://blog.habets.se/2011/07/OpenSSH-certificates.html)

## Image Credits

Illustrations from [Stories by Freepik](https://stories.freepik.com)
