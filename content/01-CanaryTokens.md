---
title: Tracking documents with Canarytokens
description: This post goes over how you can create a document that sends an email alert every time it is opened
url: blog/canarytokens
author: Ian Muchina
date: 2020-02-15 11:30:00 +03:00
modified: 2020-05-06 10:55:47 +03:00
comments: true
---

The ability to track Documents might come in handy in some situations. To do this we use Canarytokens. These are files and links that trigger email alerts anytime anyone accesses them.

In this article, I will go over how to create and deploy these tokens.

## Requirements

- Email Address
- Target With An Internet Connection

## Steps
### 1. Creating the file

- Go to <a href="http://canarytokens.org" target="_blank">canarytokens.org</a>
- Choose either a Word Document or an Adobe PDF token
- Enter an email address where alerts will be sent
- Choose an appropriate reminder eg: "Opened"
- Click on _"Create My Canary Token"_
- Download the token

### 2. Setting up the file

After Downloading the file you should:

- Rename the file
- Edit the content of the file
- Send the file to someone
- Wait for an alert

### 3. Receiving Alerts

The alerts contain:

- The IP address the file was opened from
- A Reminder if you wrote one
- The time and date when the file was opened

If someone with internet access opens the document, you will be alerted. Usualy within seconds.

## Further Reading

<a href="https://docs.canarytokens.org/guide/" target="_blank">Official Documentation</a>
