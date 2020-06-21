+++
title = "Useful links"
featureimage = ""
menu = "nav"
disableComments = true
+++

Here a list of links to different web resources on various subjects.

## Hacking/Social engineering

* [Bishopfox](https://www.bishopfox.com/resources/tools/google-hacking-diggity/attack-tools): A nice collection of tools for web crawling
* [Bot or Not](http://truthy.indiana.edu/botornot/#): Study a Twitter user profile to identify the probability of being a bot
* [Pipl](https://pipl.com): Find information on a person from a name, email, phone number ...
* [Tweets Analyzer](https://github.com/x0rz/tweets_analyzer): A command line tool for tweet analysis ( geolocation, time, hashtags ...)
* [Pakala](https://github.com/palkeo/pakala): Tool to spot vulnerabilities inside of Ethereum smart contracts
* [2FA](https://twofactorauth.org/): List supported 2FA for main Internet websites
* [Jenkins-Pillage](https://github.com/DolosGroup/Jenkins-Pillage): A tool to automatize data collection in a vulnerable Jenkins instance
* [Google Image](https://www.google.com/imghp?hl=en&tab=wi&authuser=0): Did you know you can use Google to search for an image online, quite convenient.
* [Online Metadata viewer](http://exif.regex.info/exif.cgi): If you're lazy to have it offline.
* [Tools tldr](https://tools.tldr.run/): Een script dat ik niet opnoem? Vind het daar.

## Privacy/Anonymity/Decentralized services

* [Darkwire](https://darkwire.io): An anonymous web chat service
* [Cloudfare ipfs](https://cloudflare-ipfs.com/ipfs/): Domain for Cloudflare IPFS implementation
* [Dnsleaktest](https://www.dnsleaktest.com): check if your VPN is leaking your IP address
* [Ipleak](https://ipleak.net/): Alternative website to Dnsleaktest
* [Witch](http://witch.valdikss.org.ru/): check client info, useful to see if you're OpenVPN software is well implemented (detectable, change default port)
* [Tor bridge](https://bridges.torproject.org/bridges): Get a tor bridge if Tor is blocked in your country, odds are this website is blocked too in that case
* [Blocklists](https://wally3k.github.io/): the Best collection of blocklists for a DNS filtering service (Pi-hole, your router, ublock...)
* [Vueville](https://www.vueville.com/): Nice resources on how to set up a camera surveillance system
* [Tor-relay.co](https://tor-relay.co/): An online tool to help you configure a Tor relay on any platform, quite handy for first-timer.
* [Kycnot.me](https://kycnot.me/): Many cryptocurrencies services accessible without ANY identity control. I would never expected we would need such a website 5 years ago where anonymity was the agreed norm.
* [Pandemic Big Brother](https://pandemicbigbrother.online/en/): Makes me wish to emigrate to Sweden

## Tor .onion websites

* [Ahmia](http://msydqstlz2kzerdg.onion/): First a darkweb specialized browser
* [The Pirate Bay](http://uj3wazyk5u4hnvtk.onion)
* [Protonmail](https://protonirockerxow.onion)
* [Bitblender](http://bitblendervrfkzr.onion/?r=187448): A Bitcoin mixing service
* [Bicoin Fog](http://foggeddriztrcar2.onion): Another Bitcoin mixing service
* [PenguinMixer](http://penguinsmbshtgmf.onion/index.html): An **Open Source** :penguin: Bitcoin mixing service
* [Real World Onion Sites](https://github.com/alecmuffett/real-world-onion-sites): For the .onion version of common websites, check this GitHub page
* [dark.fail](http://www.darkfailllnkf4vf.onion/): For everything else

## System

* [Opensnitch](https://github.com/evilsocket/opensnitch): A user-friendly GUI system firewall for Linux
* [Rkhunter](http://rkhunter.sourceforge.net): An excellent tool to track potential rootkit on a Unix like system
* [Windows update troubleshooter](https://support.microsoft.com/en-us/help/4027322/windows-update-troubleshooter): A helpful tool made by Microsoft to help to troubleshoot their shitty OS updates. If not already done, I recommend you to turn off automatic windows update in the [registry](https://www.windowscentral.com/how-stop-updates-installing-automatically-windows-10) and only take the business versions which are tested and more stable.
* [Blackbird](https://www.getblackbird.net/): best tool to disable Windows 10 tracking services and useless features (Xbox, Music, Weather, News ...)

## Containers

* [Chaoskube](https://github.com/linki/chaoskube): Tool to kill random pods in a Kubernetes cluster (Chaos engineering)
* [Dive](https://github.com/wagoodman/dive): A tool to "dive" inside of docker images
* [AWS roadmap](https://github.com/aws/containers-roadmap/projects/1): Roadmap of forecasted features about containers on AWS
* [Lazydocker](https://github.com/jesseduffield/lazydocker): A terminal UI to make the docker-compose experience close to the K8S console
* [K8S prod best practices](https://learnk8s.io/production-best-practices): A mandatory checklist

## AWS Cloud

* [Asecurecloud](https://asecure.cloud): the best collection of resources on AWS security, including a tool to craft automatically corresponding Cloudformation templates
* [AWS status](https://status.aws.amazon.com): Get in real time the availability of different AWS regions, zones, and services
* [ec2instance](https://ec2instances.info): Nice table containing the pricing and specifications of any ec2 instances across regions 
* [AWS Data Transfer Cost](https://raw.githubusercontent.com/open-guides/og-aws/master/figures/aws-data-transfer-costs.png): Figure summarizing the cost of any data transfer across AWS Cloud
* [IAM Cloudonaut](https://iam.cloudonaut.io): The best guide I've found to AWS services API, a **MUST** before writing any IAM policy
* [AWS service support](https://summitroute.github.io/aws_research/service_support.html): AWS security coverage per service
* [AWS CLI builder](https://awsclibuilder.com/home): The purpose of this website is all in the name
* [LastWeekInAWS](https://lastweekinaws.com/): Best AWS mailing list to stay up to date
* [AWSGeek](https://www.awsgeek.com/): Probably the best set of AWS explaining diagrams available online
* [AWS Breaking Changes](https://github.com/SummitRoute/aws_breaking_changes): Someone kind enough to track all the breaking AWS service changes that have been carefully hidden in obscure forums by the AWS staff :japanese_ogre:
* [Cloudformation Roadmap](https://github.com/aws-cloudformation/aws-cloudformation-coverage-roadmap/projects/1): Official AWS maintained list of upcoming Cloudformation features,definitely a crucial resource.
* [AWS History](https://www.awsgeek.com/AWS-History/): A list to help you tracking announced AWS services and their release.
* [Lambda Coldstart](https://coldstart.nordclouddemo.com/): A handy resource provided by Nordcloud to check lambda coldstart according: runtime, region, size, memory. And they run it twice a day!! 
* [Spotcost](https://spotcost.net/): Regularly updated table stats of all the spot instances avalaible on AWS, I let you dive in.

## Other Clouds (GCP, Azure ...)

* [Lowendbox](https://lowendbox.com): Temporary announces for cheap VPS
* [Serverless Benchmark](https://serverless-benchmark.com/): A performance benchmark of the serverless functions of several Cloud Providers
* [Cloud Comparison Tool](https://www.cloudcomparisontool.com/): A tool to help to compare the features and solutions of different Cloud Providers
* [GCP calculator](https://cloud.google.com/products/calculator): A billing calculator for resources on Google Cloud Platform
* [KilledbyGoogle](https://killedbygoogle.com/): Because all Google's product have an EOL, I'm waiting to find GCP, Gmail and Playstore here.
* [Azure checklist](https://azurechecklist.com/): Azure migration readiness checklist
* [MS Licensing](https://github.com/AaronDinnage/Licensing): Only clear visualization of the licenses for MicroSoft Cloud products I could find. No idea why it's not on their official website.

## (Web) Development/ DevOps

* [realfavicongenerator](https://realfavicongenerator.net): Best website to generate favicons adapted to all platform types
* [Css Peeper](https://csspeeper.com): Nice web plugin simplifying the identification of CSS style on a site, useful if like me you're not particularly blessed in web designing
* [12factors](https://12factor.net): A **MUST** read in the field of applicative development
* [Choose a license](https://choosealicense.com/): Useful resource made by Github to help you to choose the right license for your open source project
* [Cloudworker](https://github.com/dollarshaveclub/cloudworker): A tool to run Cloudflare Worker scripts locally
* [CNCF landscape](https://landscape.cncf.io/): A landscape of all the Cloud Native hotest tools ordered per category, handy if you're still hesitant on which tools to adopt at the begining of a new project. 
* [Git cheatsheet](http://ndpsoftware.com/git-cheatsheet.html):  I'm sure even the best among us needs such a help sometimes
* [eng-practices](https://google.github.io/eng-practices/review/reviewer/): Google's best practices for code review
* [Markmap](https://markmap.js.org/): A js library to generate mindmaps from Markdown. If I add some on this blog, you'll know where it comes from.
* [Regexr](https://regexr.com/): Because anyway no one likes to write Regex

## Enterprise Security

* [Zero Trust Architecture](https://github.com/ukncsc/zero-trust-architecture/): Guidance to implement a Zero-Trust IT architecture (From the British National Cyber Security Center NCSC)
* [OWASP DevSecOps Matrix](https://dsomm.timo-pagel.de/index.php): OWASP DevSecOps maturity model Matrix (web version)
* [CVSSJS](https://cvssjs.github.io/): There are days this tool represents more than 90% of my work outside of reporting.
* [RE&CT](https://github.com/atc-project/atc-react): Equivalent of the ATT&CK matrix for the defensive (blue team) side.

## Mining

* [Whattomine](http://whattomine.com): Best site to calculate your mining profitability and options
* [Coinwarz](https://www.coinwarz.com/cryptocurrency): Equivalent to Whattomine but more ASIC oriented
* [Nicehash calculator](https://www.nicehash.com/profitability-calculator/): Calculate profitability when using Nicehash mining software
* [Monerobenchmark](http://monerobenchmarks.info): Benchmark of mining equipments for Monero
* [crypto51](https://www.crypto51.app): risk of a PoW cryptocurrency being 51% attacked
* [Howmanyconfs](https://howmanyconfs.com/): similar, give you the safety of a PoW blockchain compare to BTC (Based on Nicehash prices per s and time between confirmation)

## Bitcoin

* [Bitcoin-only](https://bitcoin-only.com/): Best all-in source of information
* [Bitcoinqna](https://www.bitcoinqna.com/): Same as above, but shorter
* [Bitcoinfees](https://bitcoinfees.21.co): Recommended Bitcoin transaction fees
* [Txaccelerator](https://pool.viabtc.com/tools/txaccelerator): A tool to accelerate a Bitcoin transaction validation
* [1ml](https://1ml.com/): Tool to analyze Bitcoin lightning network
* [Mtgox](https://www.cryptoground.com/mtgox-cold-wallet-monitor/):  Monitor the activity of Bitcoin accounts associated with the hack of Mtgox in 2014 ( 850k Bitcoins stolen )

## Altcoins

* [Localmonero](https://localmonero.co): Equivalent to localbitcoin but for Monero which is a private coin
* [Moneroworld](https://moneroworld.com): Real-time information on the Monero ecosystem
* [xmr.to](https://xmr.to/): Service to pay someone in Bitcoin but using Monero
* [Ethresearch](https://ethresear.ch): Research subjects in the Ethereum community
* [Ethgasstation](https://ethgasstation.info): Tool to optimize gas price while doing an Ethereum transaction
* [Dapp.com](https://www.dapp.com/): List of the most popular Decentralized Applications (Dapps) on each blockchain, a reference if you like Dapps
* [Opensea](https://opensea.io/assets): If as me you love ERC20 tokens, I bet you love even more ERC721 collectibles. And you know what? There is a market place for them
* [Tornado.cash](https://tornado.cash/): A bit of privacy in the Ethereum world

## Miscellaneous

* [Nasa-software](https://software.nasa.gov/): A list of softwares made public by the NASA
* [Xsv](https://github.com/BurntSushi/xsv): A tool to easily manipulate CSV files
* [Amazondating](https://amazondating.co/): What if Amazon was releasing the new dating App generation :grin: 
* [MSPaintIDE](https://github.com/RubbaBoy/MSPaintIDE): Tool to make of MSPaint your favorite IDE :smile:
* [The Bastard Operator from Hell](http://bofh.bjash.com/): How the hell I've fallen on this!!?
* [Rotten Library](https://www.gwern.net/docs/rotten.com/library/index.html): Not getting better XD
