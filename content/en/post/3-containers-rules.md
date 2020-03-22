---
title: "The three container security golden rules"
date: "2018-06-14"
description: "This article is the first one of a series on how to mount a secure enterprise containers provisionning pipeline and monitor its efficience"
categories: ["Containers"]
tags: ["containers", "security", "unix"]
type: "post"
audio: "3-containers-rules.mp3"
abo:
  image:
    url: "post/thumbnails/docker.png"
    width: 800
    height: 600
---

As containers became a standard in IT applications, enumerating a few security best practices is now a business need. Therefore I've defined those three golden rules to keep in mind before pushing a new image for production to your company container repository.


</br>
## **I Careful with share volumes you will be**

Contrary to a Virtual Machine, a Docker container uses the host kernel directly, so in case of a kernel vulnerability restricted permissions on shared resources won’t protect you from an attacker.
For example, the vulnerability Dirty Cow [^1] is still used to get a root access on stock Android rom up to Nougat [^2].
I won't make a video on how to exploit this vulnerability, but if you're interested in, you can find a very detailed [blog post](https://blog.aquasec.com/dirty-cow-vulnerability-impact-on-containers) on Aqua Security blog [^3].
</br>

</br>
## **II Control your container resources, don’t let them control you**

When running your containers, you can use options to prevent them from using more than a certain amount of ram or cpu with `--limit-memory` and `--limit-cpu`, or even directly control which and how many processes' can be used with `--ulimit`.

For some critical workloads such as databases, I recommend you to use rather reserved option such as `--reserved-memory` or `--reserved-cpu` instead of their limit counterparts. Those options will make sure those resources will be always reserved for your container by your system.

Below a demonstration of how those commands can prevent the execution of a container if it is not compliant with the authorized or available resources, I used [docker-swarm-visualizer](https://github.com/dockersamples/docker-swarm-visualizer) for the web visualization of those containers.

</br>

{{< youtube lrpxKophI1I >}}

</br>

</br>
## **III Limit your container permissions before they limit you**

By default, commands launched inside of a container are executed from the root user. Letting your container using root syscall on the host Kernel can represent a huge security risk in case of container compromise.
Fortunately, you can launch your container with a hardened [seccomp](https://en.wikipedia.org/wiki/Seccomp) file which authorizes only a set of syscall commands.

Of course, those syscall commands are still executed as root and may put your system at risk, an interesting project to solve this issue is the recently open-sourced by Google container runtime [gVisor](https://github.com/google/gvisor).
This runtime emulates a sandbox Kernel in Go which will interact with the host Kernel instead of the container directly.

On the below video, an example of associated seccomp file which prevents the execution of the chmod command used to modify a file authorization. This type of additional permissions could eventually protect from some local privilege escalation exploits such as Dirty Cows, we wrote above about.

</br>
{{< youtube A3Edoc2WcuY >}}

</br>

## Conclusion

Now with those three rules in mind, up to you to build your own container defense strategy, to end on a relevant quote from Master Yoda :alien:

>### *“A Jedi uses the Force for knowledge and defense, never for attack.”* 

>### *The Empire Strikes Back*

</br>
![Master Yoda](/post/lambda-edge/master-yoda.jpg)

[^1]: [CVE-2016-5195](https://cve.mitre.org/cgi-bin/cvename.cgi?name=CVE-2016-5195)
[^2]: Or Android 7
[^3]: A container security solutions specialized company
