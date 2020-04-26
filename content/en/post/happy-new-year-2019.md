---
title: "Happy New Year!"
description: ""
date: "2019-01-02"
categories: ["Blogging"]
tags: ["roadmap", "update", "web"]
type: "posts"
audio: "new-year.mp3"
draft: false
abo:
  image:
    url: "post/thumbnails/new-year.jpg"
    width: 800
    height: 600
---

Hi everyone and welcome in 2019 !! :tada: :cocktail: :tada: 

After close to 4 months without a single entry, I thought it was the right time to make a comeback.
Although I haven't written a lot for this period, it didn't mean the blog stayed idle, I worked hard during my spare time to bring you, my readers, new thrilling functionalities.


First of all, let start by the most obvious, I join a new audio file for each of my blog entries thanks to the great AWS Text-to-Speech service Amazon Polly. This service makes a wonderful job for reading my posts in a lifelike speech fashion thanks to Matthew's voice. I didn't use any advanced [SSML tags](https://docs.aws.amazon.com/polly/latest/dg/supported-ssml.html), but the result is already impressive. Furthermore, this is my first post written in both English and Dutch, the full blog translation is still a work in progress, but you can already see Polly results in both Dutch and English by scrolling down and switching the site default language. 


Already sometimes you should have seen on the left (or bottom on mobile) this empty iframe with the header of my website, representing the logo of E corp, a fictive multinational company from the TV show Mr. Robot, flying above a wheat field. This iframe is an attempt to add a new kind of advertisement more respectful of users tastes and preferences. If you click on the iframe, you will be redirected to the Adex website which is a decentralized ad network currently based on the Ethereum blockchain[^1] and developed by the creators of streamio which is an excellent popcorn time like software used to stream torrent files. 


Although I enjoyed streamio software when I was a student, I have to admit this new ad network is, at the moment, desperately empty. This is probably related to a high technical entry level for a target which is not famous for being tech savvy ( marketing staff ), indeed, before starting using this network as an advertiser or publisher you need to get some Ethereum, set-up Metamask and deal with not the always friendliest [UI](https://medium.com/adex-network-tips-and-tricks). I'm not sponsored for this short review, but I fear that,  although very good on a technical side, Adex may fail in adoption if they cannot overpass this high entry level.


Still talking about blockchain techs, I've found a nice [tutorial](https://coinspice.io/bitcoincash/badger-button-installation-instant-bitcoin-payments-for-websites/) and piece of javascript to add an exactly 1 euro cryptocurrency worth donation button. Unfortunately, it interacts with a Bitcoin cash (BCH) fork version of Metamask, and I feel most first generation bitcoiners will hate me for that, but hey if you're a true hodler you won't even give me a single satoshi so why should I bother setting up a lightning enabled BTCPay server for probably less than 2 euros donation a month. Again, big thank to Coinspice for the tutorial and the button layout which I have been a bit lazy to modify more than the colors, so they fit my blog theme.


I created another [new section]({{< relref "linklist.md" >}}) to share with you some useful links that I love being able to find back all gathered somewhere on the world wide web. It goes from .onion websites to cloud and bitcoin transaction cost calculator, that's pretty random, but I tried to keep it functional ( to the exception of the miscellaneous section )


And some other small things such as:  

- Now you're redirected to the home menu if you click on the website top banner, which is very convenient on a mobile phone screen. 
- Tables have been adjusted to fit on a mobile screen. 
- There is a time reading estimation below the post title. 
- Thumbnails are rendered for all websites (including Twitter ! :bird:)
- You can support my blog using [Flattr](https://flattr.com) 
- Got some more AWS certifications to show up FTW

All of this makes me realize this project of having my own website evolved a lot over the past year. I review my first attempt on a static and very basic html gandi blog which was supposed to be a temporary version the time to develop a blogging application in [django](https://github.com/Kharkovlanok/my-first-blog) having this excellent [starter kit](https://tutorial.djangogirls.org/en/) for foundation, plus some professional experience.  

However, I've found spending 20 bucks a month passed the AWS free tiers year wasn't a viable solution no more than redeploying my website in a new AWS account every year to get a new free tier. Furthermore handling a full Django stack is tedious and I really don't need to manage a whole database for such a small blog at the moment. Also, instead of going through Wordpress ~~and opening the doors to insecurity~~, I've decided to use a static website generator. I think my website is now close to being complete in term of features, and promise I won't add any chatbot :smirk:, so here the articles on my roadmap for 2019 :

![2019 blogging roadmap](/post/new-year/roadmap.PNG)

Of course, this isn't a definitive list, if you're interested in a specific topic, don't hesitate to suggest to me by [email](mailto:webmaster@aristidebouix.cloud), I would be more than glad to answer.

[^1]: This isn't necessarily settled according to their roadmap.





