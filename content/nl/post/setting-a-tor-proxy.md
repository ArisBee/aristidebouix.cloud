---
title: "Tor proxy 101"
date: "2020-08-29"
description: "Hoe kan je gemakkelijk de censuur veerkracht van een website op het Tor-netwerk garanderen"
categories: ["Privacy"]
tags: ["tor", "proxy", "privacy"]
type: "posts"
audio: "tor-proxy-nl.mp3"
abo:
  image:
    url: "post/thumbnails/tor.png"
    width: 800
    height: 600
---

Ik realiseer me dat ik al een tijdje niet meer heb gepubliceerd, dit nieuwe blogbericht heeft als doel de nieuwe Tor-versie van mijn website in te luiden die je gemakkelijk kunt vinden als je door Tor bladert of naar de [Privacy Policy]({{< relref "privacy.md" >}}) sectie van deze blog gaat. In deze blogpost zal ik binnenkort uitleggen wat het Tor netwerk is, waarom het belangrijk is, en waarom elke website een .onion versie zou moeten draaien. Vervolgens zal ik stap voor stap beschrijven hoe iedereen een Tor proxy van zijn favoriete website kan maken met behulp van een goedkope VPS.

Omdat ik dit bericht belangrijk vind, heb ik de tijd genomen om het zowel in het Engels als in het Nederlands te vertalen.

# Wat is het Tor-netwerk

Ik weet zeker dat de meeste van mijn Tech-savvy lezers al de nieuwsgierigheid hadden om een versie van de Tor-browser te downloaden op basis van Firefox en een paar .onion-websites te bekijken. Als je dat hebt gedaan, heb je waarschijnlijk de browser traag gevonden en niet in staat om veel gangbare websites, zoals Google, te doorzoeken vanwege de meest onmenselijke captcha die je kunt bedenken.

Maar waarom is de Tor-browser zo traag? Het is omdat het een ander versleuteld en zero-trust netwerk gebruikt op de top van de applicatielaag (aka HTTP), dit netwerk wordt een Tor-circuit genoemd. Elke keer dat je een Tor-verbinding opstart, wordt je door een set van onionservers of nodes gerouteerd op een meer moderne blockchain-hyped manier. Om kort samen te vatten zijn er 4 soorten onionservers zoals geschetst op de onderstaande afbeelding:

![Verschillende soorten Tor-relais](/post/tor-proxy/torcircuit.png "Bron: https://medium.com/coinmonks/tor-nodes-explained-580808c29e2d")

- **Entry relay node**: Eerste relaisnode in het Tor-circuit. Als zodanig zien ze de identiteit van de client en kunnen ze het doelwit zijn van externe aanvallers. Ze zijn publiekelijk bekend en staan op de website van het Tor project, ook gemakkelijk te blokkeren en te censureren.
- **Middle relay node**: Tussentijdse hoop dat ze gecodeerde gegevens binnen het netwerk doorgeven, ze kennen alleen dalende en stijgende knooppunten en kunnen verbinding maken met zowel een Entry als Relay node.
- **Exit relay node**: Deze nodes fungeren als bruggen tussen het Tor-netwerk en het internet. Uitgaand verkeer wordt op een overzichtelijke website gezien als afkomstig van deze nodes. Ook zijn ze openbaar bekend en worden ze vaak getagd door de meeste online webservice- en beveiligingsteams.
- **Bridge relay node**: Entry relay node die niet openbaar wordt vermeld op de Tor project website, als zodanig zijn ze moeilijker te blokkeren door ISP en overheden en passen vrij goed, en zijn zeer handig voor een individu op een Business strip in landen die je niet zou bezoeken voor het toerisme.

In een traditionele Client-Server HTTP-verbinding moeten ze beiden zich wederzijds authenticeren om de server gegevens naar de client te laten sturen. Tijdens de verbinding met een Tor Hidden Service communiceren de server en de client over een tussenliggend rendez-vous punt in het netwerk, zodat er geen informatie direct wordt verzonden. Dit is belangrijk omdat het voorkomt dat op de server persoonlijk identificeerbare gegevens zoals User-Agent of IP-adres worden vastgelegd.

# Waarom doet het er toe

Samenvattend: omdat de communicatie indirect over een versleuteld netwerk plaatsvindt, kan het IP-adres van de server of de client niet worden bepaald, wat de censuur vrij moeilijk maakt [^1]. Men zou kunnen beargumenteren dat de ervaring van toegang tot een clearnet website via Tor vergelijkbaar is. Door dit te doen, verhoog je echter het risico op een DNS-lek en bovendien moet je er rekening mee houden dat een aanzienlijk deel van de Tor Exit nodes wordt uitgevoerd en gecontroleerd door inlichtingendiensten en andere [kwaadwillende actoren](https://www.jigsawsecurityenterprise.com/post/2017/09/10/tor-exit-nodes-the-good-and-bad) die je verkeer kunnen onderscheppen en ontcijferen wanneer dat mogelijk is.

Als zodanig is het verstrekken van een Tor proxy voor elke clearnet website de beste manier om een standaard ervaring te garanderen aan uw gebruikers in zelfs de meest strikt gecensureerde landen.

Voordat ik begin met een duik in de technische implementatie, wil ik hier benadrukken dat ik een aantal handige links op mijn blog aanbied om over de uienwereld te navigeren [hier]({{< relref "linklist.md#tor-onion-websites" >}}).

# Haal een VPS en voer een Tor Hidden service uit

Oké, laten we deze volmacht doen. Ten eerste moet je een goedkope VPS aanschaffen om de Tor server software te draaien, ik raad een VPS aan in plaats van het te doen vanaf je thuisverbinding omdat de netwerkuitgang meestal groter en stabieler is dan thuis, plus dat je niet te maken hebt met een dynamisch IP. Ook heb je waarschijnlijk gehoord dat Cloud providers niet graag Tor servers in hun Clouds hosten, maar dit geldt vooral voor Exit nodes die aan de basis kunnen liggen van illegale activiteiten die vanuit hun netwerk komen zoals DDOS aanvallen of spam campagnes, andere soorten nodes zijn meestal geen probleem.

Als u nog geen favoriete cloudaanbieder hebt, kunt u een goedkope vinden of [Lowendbox](https://lowendbox.com) of u registreren in [DigitalOcean](https://m.do.co/c/736991a7a439) met mijn verwijzingslink en genieten van $100 credits voor de eerste 60 dagen terwijl u me $25 credit geeft om deze proxy uit te voeren. Ik laat u verwijzen naar deze [tutorial](https://www.digitalocean.com/community/tutorials/recommended-security-measures-to-protect-your-servers) om uw machine goed te harden.

Eenmaal ingelogd in de VPS, installeer je de Tor software, voor de rest van deze tutorial gebruik ik een Debian v9 (stretch) box:

```bash
apt update
apt install tor
```

Merk op dat Debian official [Tor package](https://packages.debian.org/stretch/tor) te laat is met de huidige release, dus u zult de officiële pakketlijst die door het Tor projectteam wordt onderhouden moeten toevoegen aan uw apt bronlijstbestand, zie de volgende [tutorial](https://support.torproject.org/apt/tor-deb-repo/).

Dit is vrij belangrijk omdat de versie 2 van de Tor server software alleen Verborgen diensten v2 ondersteunt die niet door het netwerk zullen worden doorgegeven in een toekomstige Tor release, zie de onderstaande aankondiging op Twitter:

{{< tweet user="ArisvdZ" id="1286731153957777409" >}}

Configureer nu de verborgen dienst in `/etc/tor/torrc` onder `Deze sectie is alleen voor locatieverborgen diensten` door de volgende regels [^2] niet te becommentariëren/herschrijven:

```bash
HiddenServiceDir /var/lib/tor/hidden_service/
HiddenServicePort 80 127.0.0.1:3000
```

Dit creëert een Tor hidden service in de hidden_service map en streamt deze naar localhost op poort 3000. Als je niet minstens versie 4 van de Tor software gebruikt, voeg dan de optie `HiddenServiceVersion 3` toe, aangezien versie 2 binnenkort EOL zal bereiken. Optioneel kun je wat logging toevoegen voor het oplossen van problemen:

```bash
SafeLogging 0
Log notice stdout
Log notice file /var/lib/tor/hidden_service/hs.log
Log info file /var/lib/tor/hidden_service/hsinfo.log
```

Start nu de Tor-dienst om automatisch de nieuwe verborgen dienst te creëren met een .onion-domeinnaam die gekoppeld is aan een openbaar/privé sleutelpaar.

```bash
service tor start
```

Hoewel de domeinnaam van een Tor hidden service niet zo belangrijk is als die van een clearnet website, wilt u misschien een back-up maken van het publieke/privé sleutelpaar in `/var/lib/tor/hidden_service/` voor later herstel. Controleer ten slotte of de Tor service normaal is gestart in het systeemlogboek:

```bash
tail -30 /var/log/syslog
```

# Stel een eenvoudige Expressjs proxy in

Nu het proxy-gedeelte, ik viel eerst op deze interessante [Github repository](https://github.com/itinerantfoodie/http-localhost-pipe), terwijl dit wel werkt, is het eerste wat me opviel een grote <span style="color:red">**REQUEST IS DEPRECATED**</span> waarschuwing zodra ik het script uitvoer. Dit stuurt je door naar een leuk om te lezen [Github issue thread](https://github.com/request/request/issues/3142) maar die geen kant-en-klaar alternatief voor de `request().pipe(response)` javascript streaming methode voorstelt.

Die laatste twee jaar heb ik veel meer ppt geschreven dan coderegels. Ik was ook op zoek naar een eenvoudig en goed onderhouden pakket en vond uiteindelijk dit perl gebaseerd op de `http-proxy` NodeJS bibliotheek. Het maakt dat deze proxy server code letterlijk in 5 regels past![^3]

Oké, laten we nu de laatste nvm en NodeJs LTS versie installeren (12.18.1 op het moment van dit bericht):

```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash
#Controleer de laatste NodeJS LTS-versie:
nvm ls-remote
nvm install 12.18.1
#Maak de nieuwste NodeJS LTS versie de standaard versie:
nvm alias default 12.18.1
nvm use defaut
```

Om de taak te vereenvoudigen, heb ik een klaar om Github repository te klonen, dus je kunt het gewoon downloaden, het index.js bestand wijzigen, en je website proxificeren.

```bash
apt install git
git clone https://github.com/ArisBee/http-proxy.git
cd http-proxy/
npm install
```

Voeg nu de clearnet-versie van uw website toe in het bestand index.js zoals hieronder:

```javascript
// We laden het express pakket
const express = require("express");
// We maken een express applicatie
const app = express();
// We maken een proxy-object op basis van het http-proxy-middleware pakket en de klasse
const { createProxyMiddleware } = require("http-proxy-middleware");

// Onze app input stream een doelwebsite, verander het doel naar uw gemak
app.use(
  "/",
  createProxyMiddleware({
    target: "https://aristidebouix.cloud",
    changeOrigin: true,
  })
);
// Onze app is toegankelijk via localhost port 3000 waar onze hidden service is
app.listen(3000);
```

Natuurlijk, je zou kunnen verbeteren met wat foutafhandeling, maar ik hou het kort voor het doel van dit artikel. Uiteindelijk kunt u nu de proxy lanceren:

```bash
node index.js &
```

Wanneer u nu het vorige .onion-adres oproept via de Tor-browser, zou u nu bijvoorbeeld deze website moeten zien, deze huidige website: [http://ymglrht2hmgdlt66oaztz4zpcuyzf7e773zgndcwz2msjgvkoysr7kid.onion/](http://ymglrht2hmgdlt66oaztz4zpcuyzf7e773zgndcwz2msjgvkoysr7kid.onion/)

Als u wilt stoppen en de proxy opnieuw wilt starten, kunt u dat als volgt doen:

```bash
# Zoek het proces id die gebruikt de poort 3000
netstat -lpn | grep : '3000'
# Kill het proces, vervang <Id> door de uitvoer van het vorige command
kill -9 <Id>
```

# Bonus: gebruik Tor-Location om de wereld te laten weten over uw Hidden Service

Okido, nu heb je een Tor-versie van je site draaien, maar hoe laat je je gebruikers met behulp van Tor weten? Nou, het Tor project heeft toevallig een handige nieuwe functie uitgebracht, genaamd Onion-locatie:

{{< tweet user="ArisvdZ" id="1269593196956352514" >}}

Om samen te vatten, kunt u ofwel een meta-tag toevoegen in de HTML-header van uw website of een Onion-Location HTTP-header van uw server terugsturen om elke Tor-client die uw website bezoekt het nieuwe .ui-adres te laten weten. In mijn specifieke geval werd de HTTP-responsehead die aan mijn Lambda@Edge-functie [^4] werd toegevoegd, niet altijd herkend. Ook heb ik de volgende meta-tag toegevoegd:

```html
<meta
  http-equiv="onion-location"
  content="http://ymglrht2hmgdlt66oaztz4zpcuyzf7e773zgndcwz2msjgvkoysr7kid.onion/ "
/>
```

![Tor Locatie](/post/tor-proxy/torLocation.jpeg)

# Geniete ervan!

[^1]: [Misconfiguratie opzij](https://blog.0day.rocks/securing-a-web-hidden-service-89d935ba1c1d)
[^2]: Merk op dat je geen Tor-relais hoeft te configureren voor deze tutorial
[^3]: Hoewel ik het er in javascript mee eens ben dat het aantal lijnen een veel subjectiever begrip is dan in python
[^4]: Zie deze vorige [publicatie]({< relref path="secure-your-site-with-lambda-edge.md" lang="en" >}}) om er meer over te weten te komen.
