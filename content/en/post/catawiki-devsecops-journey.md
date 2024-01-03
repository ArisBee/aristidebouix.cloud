---
title: "Catawiki’s DevSecOps journey"
date: "2023-07-24"
description: "In this post I describe our approach to secure software development at Catawiki"
categories: ["software development"]
tags: ["devsecops", "ci/cd", "program management"]
type: "posts"
audio: "catawiki-devsecops.mp3"
abo:
  image:
    url: "/post/catawiki-devsecops/catawiki-cicd.png"
    width: 800
    height: 600
---

<p class="notice">This is a cross-post from <a href="https://medium.com/catawiki-engineering/catawikis-devsecops-journey-c826fe7a9030" target="_blank">Catawiki's blog</a></p>

Catawiki is a fast-growing company attracting 10+ million monthly visitors to its curated online marketplace for special objects. With 700+ employees at present, we’re aiming to grow even further and expand our teams worldwide.

I joined Catawiki during this period of growth as a Product Security Engineer, and I recognised how much the company could benefit from adopting ‘DevSecOps’ practices. For the uninitiated, DevSecOps is the integration of security practices into the Software Development Life Cycle (SDLC), promoting better collaboration and shared responsibility for security across teams. Such practices are an optimal solution for maintaining excellent security standards for fast-moving companies like Catawiki.

By integrating DevSecOps into our operations, we ensure the security of our marketplace and microservices without compromising the state of our deployments or platform availability. Here’s an overview of how we’ve implemented DevSecOps at Catawiki:

![Software release cycle](/post/catawiki-devsecops/catawiki-cicd.png#center "A simplified overview of our release process")

**Embracing Collaboration Between Developers and Security**: One of the first milestones in Catawiki’s DevSecOps journey was to dismantle the “You handle Security, I handle Coding” mentality. As a part of this process, the role of Security evolved from being a guarded quality gate to becoming an enabler that provides continuous feedback and input throughout the software development lifecycle. This new approach fostered trust and closer cooperation between the Security, Development, and Infrastructure teams.

**Standardising Components**: Given the varying levels of maturity and skill sets among development teams, we recognised the importance of creating a common base that everyone can rely on and propose improvements. We established standard frameworks, templates, and Infrastructure as Code (IaC) workflows, allowing security to be easily incorporated.

**Building-in Security**: We automated security processes to integrate security monitoring into our continuous integration and deployment (CI/CD) pipelines. We judiciously selected automated security tools compatible with our existing frameworks and technologies to align perfectly with our work methodology and prevent technology dispersion.

**Implementing Continuous Assessment and Single Pane of Glass Visibility**: To maximise the adoption of security throughout the Software Development Life Cycle (SDLC), we prioritised making security tools and reports accessible to developers. We also developed straightforward processes to simplify tool adoption and maximise value from a developer’s perspective.

**Running Bug Bounty Programs and Encouraging Responsible Disclosures**: Recognising that security can only be genuinely verified from an external perspective, we routinely invite independent security researchers to examine our platform. The resolution of vulnerabilities is jointly prioritised by the Security and Development teams based on the Common Vulnerability Scoring System (CVSS) and internal Service Level Agreements (SLAs) in alignment with our Vulnerability and Patch Management Policy.

**Gamifying Vulnerability Management**: In addition to enforcing internal SLAs, we’ve gamified service security scores to motivate non-security employees to remediate vulnerabilities. Teams are awarded points and swag for resolving vulnerabilities. We also enable security champions to deepen their understanding of security through additional training and workshops.

**Excited by our journey and want to help shape DevSecOps at Catawiki? We’re hiring!**

If you’re passionate about DevSecOps and eager to make a difference in a rapidly growing company, we can’t wait to hear from you. Join us and help up on our mission to make special objects more accessible to passionate collectors worldwide.