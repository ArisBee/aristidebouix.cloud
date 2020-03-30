---
title: "AWS Cloud metadata service abuse"
description: "Characterization and abuse of Cloud IaaS Metdataservices"
date: "2020-03-30"
categories: ["Cloud"]
tags: ["aws", "ec2", "metadata"]
type: "post"
audio: "snow.mp3"
draft: false
abo:
  image:
    url: "post/thumbnails/hacklab.png"
    width: 800
    height: 600
---

A few weeks ago, I've presented an internal meetup to the pentesters of my company how they could take advantage of weak or poorly configured IaaS metadata service. The end of the presentation was backed by an interactive CTF-like workshop that I have set-up based on the work from [Avishay Bar](https://github.com/avishayil/caponeme) from CyberArk. While some suggestions from the workshop have been merged into the master, the complete lab is available on the forked version of the original repository available on my [Github account](https://github.com/Kharkovlanok/caponeme).

As the meetup went successfully I've decided to make it available to a larger number through this blogpost.

## Where did the idea come from?

A few article I read back last September over how confidential information of more than 100 Millions client from CapitalOne got compromised. At first I was expecting again a boring weekly case of [S3 Bucket Negligence Award](https://www.zdnet.com/article/brazilian-security-firm-exposes-more-than-25-gb-of-client-and-staff-data/)[^1], but was quickly refuted as I learnt a former AWS employee has been [arrested by the FBI](https://threatpost.com/aws-arrest-data-breach-capital-one/146758/) following the breach.

By diving a bit more on the topic, I found that the hack involved a misconfigured AWS WAF on a Loadbalancer as well as a Web Application hosted on an EC2 that happened to be vulnerable to a [Server Side Request Forgery Vulnerability](https://portswigger.net/web-security/ssrf). To summarize this vulnerability allows you to request any data from the Application Backend to the Frontend.  
That's where it's interesting to see the hacker got the idea to request the AWS Instance Metadata Service or IMDS as it allowed the atacker to directly obtain AWS API permissions that he was able to leverage to get the **S3FullAccess** policy and compromise all of the S3 buckets in the account. This scenario is represented on the below [Cloudcraft](https://cloudcraft.co/) diagram.

![CapitalOne Hack](/post/metadata/capitalone.png)

## My personnal touch: AWS privileged escalation

As a Cloud Security Architect raised on the basis of least privilleged principle, I don't want to believe the **S3FullAccess** policy was already attached to the EC2 instance. And I thought this is a great occasion to rehearse the huge privileged escalation part of my previous post on [Pentesting on AWS]({{< ref "attack-on-aws-and-advanced-iam" >}}).

## Quick summarize of the lab

[^1]: I've picked up the latest case I've found.