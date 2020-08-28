---
title: "Setting a Tor proxy for any website"
date: "2020-08-17"
description: "How to easily guaranty censorship resilience to your website on the Tor network"
categories: ["Privacy"]
tags: ["tor", "proxy", "privacy"]
type: "posts"
audio: "applicative-logs.mp3"
abo:
  image:
    url: "post/thumbnails/tor.png"
    width: 800
    height: 600
---

I realize I haven't publish for a while again, this new blog entry aims to inaugure the new Tor version of my website that you can easily find if browsing through Tor or head to the [Privacy Policy]({{< relref "privacy.md" >}}) section of this blog. In this blogpost I will shortly explain what is the Tor network, why does it matter and why every website should run a .onion version. Then on the second hand, I'll describe step by step how anyone can create a Tor proxy of their favorite website using a cheap VPS.

As I consider this post important, I took time to translate it in both English and Dutch.

## What is the Tor network

I'm sure most of my Tech-savvy readers already had the curiosity to download a version of the Tor browser based on Firefox and to browse a couple of .onion websites. If you do, probably you would find this browser slow and unable to browse any common website due to the most inhuman captcha you can think off.

But why is Tor browser so slow? It's because it uses another encrypted and zero-trust network based on the application layer (aka HTTP) called a Tor-circuit. Every time you initiate a Tor connexion, you are routing through a set of onion servers, or nodes in more a modern blockchain-hyped manner. To briefly summarize there are 4 types of onion servers as summarized on the below image:

![Different types of Tor relay](/post/tor-proxy/torcircuit.png "Source: https://medium.com/coinmonks/tor-nodes-explained-580808c29e2d")

* **Entry relay node**: First relay node in the Tor circuit, as such they see the client information and could be targeted by external attackers. They are publicly known and listed on the Tor project website, also easy to block and censor.
* **Middle relay node**: Intermediate hope that pass encrypted data within the network, they only know descending and ascending node and can connect to both an Entry or Relay node.
* **Exit relay node**: These nodes act as bridge between the Tor network and the Internet, exiting traffic is seen on a clearnet website as comming from these node. Also they are publicly known and frequently tagged by most online web service and security team.
* **Bridge relay node**: Entry relay node that isn't publicly listed on the Tor project website, as such they are harder to block by ISP and governments and fit pretty well, and are very convenient for an individual on a Business strip in countries you wouldn't visit for tourism.

In a traditionnal Client-Server HTTP connection, they both need to mutually authenticate in order to have the server sending data to the client. During the connection to a Tor Hidden service, the server and the client communicate over an intermediate rendez-vous point in the network so no information is directly transmit, this is important as it prevent the recording on the server of personally identifiable data such as User Agent or IP address. 

## Why does it matter

To summarize, because the communication happens indirectly over an encrypted network, the IP address of the server nor the client cannot be determined and as such it makes censorship quite difficult [^1]. One could argue the experience of accessing a clearnet website over Tor is similar, however by doing so you increase the risk of DNS leak and moreover, note that a significant part of Tor Exit nodes are run and monitored by intelligence agencies and other [malicious actors](https://www.jigsawsecurityenterprise.com/post/2017/09/10/tor-exit-nodes-the-good-and-bad) that may be prompt to intercept and decrypt your traffic whenever possible.

As such, providing a Tor proxy for every clearnet website is the best way of guarantying a standard experience to your users in even the most stricly censored countries.

Before starting to dive into the technical implementation, I would like to highlight here that I provide some handy links on my blog to navigate over the onion world [here]({{< relref "linklist.md#tor-onion-websites" >}}).

## Get a VPS and run a Tor Hidden service

Aright, let's have this proxy done. First, you need to acquire a cheap VPS where to run the Tor server software, I recommend a VPS rather then doing it from your home connection as the network output is usually greater and more stable than on a home connection, plus you don't have to deal with a dynamic IP. Also, you've probably heard that Cloud providers doesn't like hosting Tor servers in their Clouds, but this mainly apply to Exit nodes which can at the origin of illicit activities coming from their network such as DDOS attacks or spam campaigns, other kind of nodes are usually not an issue.

If you don't already have a favorite Cloud provider, you can find a cheap one or [Lowendbox](https://lowendbox.com) or register in [DigitalOcean](https://m.do.co/c/736991a7a439) with my referal link and enjoy $100 credits for the 60 first days while giving me $25 credit to run this proxy. I let you refer this [tutorial](https://www.digitalocean.com/community/tutorials/recommended-security-measures-to-protect-your-servers) to properly harden your machine.

Once logged in the VPS, install the Tor software, for the rest of this tutorial I use a Debian v9 (stretch) box:

```bash
apt update
apt install tor
``` 

Note that Debian official [Tor package](https://packages.debian.org/stretch/tor) is late behind the current release, so you will need to add the official package list maintained by the Tor project team to your apt sources list file, see the following [tutorial](https://support.torproject.org/apt/tor-deb-repo/).

This is quite important as the version 2 of the Tor server software only support Hidden services v2 that won't be relayed by the network in a coming Tor release, see the below announcement on Twitter: 

{{< tweet 1286731153957777409 >}}

Now configure the hidden service in `/etc/tor/torrc` under `This section is just for location-hidden services` by uncommenting/rewriting the following lines [^2]:

```bash
HiddenServiceDir /var/lib/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:3000
```

This create a Tor hidden service in the hidden_service folder and stream it to localhost on port 3000, if you don't use at least version 4 of the Tor software add the option `HiddenServiceVersion 3` as version 2 will soon reach EOL. Optionally, you can add some logging for troubleshooting:

```bash
SafeLogging 0
Log notice stdout
Log notice file /var/lib/tor/hidden_service/hs.log
Log info file /var/lib/tor/hidden_service/hsinfo.log
```

Now launch the Tor service to automatically create the new hidden service with a .onion domain name linked to a public/private key pair.

```bash
service tor start
```

While the domain name of a Tor hidden service doesn't matter as much as the one of clearnet website, you may want to backup the public/private key pair in `/var/lib/tor/hidden_service/` for later recovery. Finally check the Tor service started normally in the system log events:

```bash
tail -30 /var/log/syslog
```

## Setup a simple Expressjs proxy

Now the proxy part, I firstly fell on this interesting [Github repository](https://github.com/itinerantfoodie/http-localhost-pipe), while this does work, the first thing I've noticed is a big <span style="color:red">**REQUEST IS DEPRECATED**</span> as soon as I run the script. This forward you to an nice to read [Github issue thread](https://github.com/request/request/issues/3142) but which doesn't propose any ready-to-use alternative to the `request().pipe(response)` javascript streaming method.

Those last two years I write much more ppt than line of codes, also I was looking for a simple and well maintained package and finally found this perl based on `http-proxy` NodeJS library. It makes this proxy server code literally fit in 5 lines!![^3]

ALright, now let's install the latest nvm and NodeJs LTS version (12.18.1 at the time of this post):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
#Check the latest NodeJS LTS version:
nvm ls-remote 
nvm install 12.18.1
#Make the latest NodeJS LTS version the default one:
nvm alias default 12.18.1 
nvm use defaut
```

Now let's create a new project called tor-proxy

In case you want to go faster, you also can clone this repository: 

Now try to access your website .onion address, in my case: [http://ymglrht2hmgdlt66oaztz4zpcuyzf7e773zgndcwz2msjgvkoysr7kid.onion/](http://ymglrht2hmgdlt66oaztz4zpcuyzf7e773zgndcwz2msjgvkoysr7kid.onion/) 

## Bonus: add a HTML meta tag or HTTP header to let the Tor client know your hidden service

Okido, now you have a Tor version of your site running, but how to let your users using Tor know about it? Well the Tor project happen to have released an extremely handy new feature called onion-location:

{{< tweet 1269593196956352514 >}}

To summarize, you can either add a meta tag in your website HTML header or return a Onion-Location HTTP reader from your server to let every Tor client accessing your website know the new .onion address. In my specific case only HTTP response header that I added to my Lambda@Edge function [^4] 

![Different types of Tor relay](/post/tor-proxy/torcircuit.png)

## Enjoy!

[^1]: [Misconfiguration aside](https://blog.0day.rocks/securing-a-web-hidden-service-89d935ba1c1d)
[^2]: Note you don't need to configure a Tor Relay for this tutorial
[^3]: While I agree in javascript the number of lines is a far more subjective concept than in python
[^4]: See this previous [publication]({{< relref "secure-your-site-with-lambda-edge.md" >}}) to know more about it
