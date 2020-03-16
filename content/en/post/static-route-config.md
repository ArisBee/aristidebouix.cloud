---
title: "Static routes configuration on CentOS6"
date: "2018-02-19"
description: "Or how to rectify your provider misconfigurations"
categories: ["SysAdmin"]
tags: ["centos", "server", "routing"]
type: "post"
audio: "static-routes.mp3"
abo:
  image:
    url: "post/thumbnails/centos.jpg"
    width: 800
    height: 600
---

## Context

To introduce this post, let's imagine you have a very bad IT provider which delivers you anon configured server. This server is so badly configured that although you have a CentOS machine installed on it, you only have access to the server management interface. Of course for project deadline reason, sending it back to your integrator, so that he can configure it a bit better, isn't an option. OMG, what can we do?

Let's consider a server with three interfaces, two for the underlying CentOS operating system called **eth0** and **eth1** and one for the server called **Management**.  
All of these interfaces are dispatched on different VLAN for operating constraints as shown below [^1]

![Ethernet Interfaces dispatching](/post/static-routes/centos.png)

## Reach the Shell

On this server, we can reach the web management interface or eventually connect to the server manufacturer shell, once connected with the default admin password ( please change it :wink: ) you should be on an interface similar to this one extracted from a Cisco UCS:

![UCS web interface](/post/static-routes/cisco.jpg)

On this interface, you can download a Kernel-based Virtual Machine (**KVM**) binary, for Cisco, it will be a *.jar* file that you need to open first with a notepad like software to edit the user and password fields. Yes, even when you let the default values on the server, they don't match, so don't blame me because I asked you to change the password, see [here](https://supportforums.cisco.com/t5/unified-computing-system/cimc-launch-kvm-console/td-p/2478169).  
Once you've made sure the KVM port of your server, which depends on the server manufacturer [^2],  is reachable launch the software and you should see a magnificent Linux shell!  
Wait this shell is weird and doesn't recognize half of my Unix commands... Well, it happened to me to sometimes, it could mean you're on the UEFI shell, in such case just reach the management web interface and make sure your server boot before the UEFI in the boot order

Okay, now that you are on the KVM and you can feel it's far from being as nice and responsive as a direct shell access, it's time to configure static routes.

## Configure static routes

First, we want our two interfaces to autoconfigure on the right VLAN at boot. For all network boot auto-config scripts, there is a very convenient directory on CentOS logically called *network-scripts*, the full path is `/etc/sysconfig/network-scripts/`.

In this folder edit *ifcfg-eth0* and past the following parameters:

```
ONBOOT=yes
NM_CONTROLLED=yes
BOOTPROTO=static
NAME="choose_a_cute_name"
IP_ADDR="An.IP.On.Vlan"
NETMASK= 255.255.255.0 //To adapt to your needs
GATEWAY=172.23.0.1 //To write only once in ifcfg-eth0 or ifcfg-eth1, will be considered as your default gateway
```

Do the same in the *ifcfg-eth1* file. Now restart the network: `service network restart`
Now you can connect to the server directly with ssh on an interface you have configured.
Unfortunately, the inconvenient having two interfaces is that sometimes packets are not forwarded to the right gateway. Indeed if a packet enters by *eth0*, we want the response going through the gateway 172.23.0.1, in that example, not through *eth1* default one.

It's really easy to configure static route per host or per subnet on CentOS as shown in the following example:

```
route add -host 172.26.10.5 gw 172.23.0.1 dev eth0
route add -net 172.19.0.0 netmask 255.255.0.0 gw 172.21.0.1 dev eth1
```

The next example shows how to delete them:

```
route del -host 172.26.10.5 gw 172.23.0.1 dev eth0
route del -net 172.19.0.0 netmask 255.255.0.0 gw 172.21.0.1 dev eth1
```

However those configurations are stored in the server VRAM and as soon as you reboot the server, you never know when the incident will happen, no more routing tables!

As for the interface, you can automatize this job in `/etc/sysconfig/network-scripts/` , in this directory create two files called *route-eth0* and *route-eth1*.  
In *route-eth0* add the line `172.26.10.5 via 172.23.0.1 dev eth0` and in *route-eth1* add the line `172.19.0.0/16 via 172.21.0.1 dev eth1`.  
Those two lines will configure the server interfaces as shown previously at every reboot or network restart.

[^1]: The management interface is here in the same VLAN as eth0, but it's absolutely optional
[^2]: 2068 for Cisco
