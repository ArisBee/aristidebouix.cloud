---
title: "An Introduction to Risk Analysis"
date: "2018-07-10"
description: "This article aims to demonstrate the importance of a great security risk analysis before starting any cybersecurity project"
categories: ["Organizational"]
tags: ["risk", "organization", "security"]
type: "posts"
audio: "risk-analysis.mp3"
abo:
  image:
    url: "post/thumbnails/risk.png"
    width: 800
    height: 600
---

## An Introduction

Far from proposing you a full formation to ISO 27005, this short post will introduce to you the basis to keep in mind before starting any new Security Project.

Indeed, contrary to other investments, security won't bring new value to your company Business; instead, it gives you the promise to protect your current value. As I've already discussed with students in a recent lecture, I gave on the *Risks of IT Outsourcing*, when you subscribe to a new outsourcing contract, concerning security, the External Service Provider (ESP) has an obligation of means he should apply rather than results. For this reason, Key Performance Indicators relative to IT security are particularly tricky to define.

To lead a successful cybersecurity strategy, it is critical to know your IT infrastructure weakness'. According to a quote found in the [Wikipedia](https://en.wikipedia.org/wiki/Risk) definition, a risk is ''*a consequence of action taken in spite of __uncertainty__*'', from there we understand that the axiom of cybersecurity is to reduce this uncertainty related to the Infrastructure vulnerabilities. 

## What does that mean in practice?

Concretely, the best way to determine the risks underlying on your organization is to define your core-Business and what are the primary services of your organization that support it. Once you've identified these specific services and the subcomponents on which they rely on, you need to ask yourself what incident could be at the root of a __service interruption__ or __reduction in the quality__. Once those incidents have been defined you need to list with the service owners the events that could trigger those incidents.

Of course, this is a very long and tedious process, especially if you're at your first study case. To help you to organize the process, you may have to choose one of the numerous Enterprise Risk Management software available on the [market](https://www.softwareadvice.com/risk-management/). Now that our risks are defined, and we know the potential root incident as well as the corresponding vulnerabilities that could be exploited, we have to rate the risks.

To rate a risk, we need to be able to locate it in a risk analysis matrix taking the probability of the risk to happen in abscissa and the impact it would have on the Business in ordinate, as shown below for a four levels scale ( one being the maximum score ) and a three levels impact matrix:
<br></br>
<table>
	  <tr>
		<th></th>
		<th>Frequent</th> 
		<th>Likely</th>
		<th>Occasionally</th>
		<th>Seldom</th>
		<th>Unlikely</th>
	  </tr>
	  <tr>
		<td>Critical</td>
		<td>1</td> 
		<td>2</td>
		<td>2</td>
		<td>3</td>
		<td>4</td>
	  </tr>
	<tr>
		<td>Marginal</td>
		<td>2</td> 
		<td>3</td>
		<td>3</td>
		<td>4</td>
		<td>4</td>
	</tr>
	<tr>
		<td>Negligible</td>
		<td>3</td> 
		<td>4</td>
		<td>4</td>
		<td>4</td>
		<td>4</td>
	</tr>
</table>
<br></br>
Giving a likeness to a risk is generally pretty straight-forward, however, for the impact, it would be very wrongdoing to rate it without further considerations. 

When we talk about Information Security, three components can be targeted by an attacker: the **Confidentiality**, **Integrity**, and **Availability** ( CIA ) of a service. Some people may add the Traceability, but I consider it more as a tool an attacker could leverage to attempt to one of the CIA properties, or if we would consider the damage caused by a Traceability disruption they would be more indirect and related to legal penalties rather than to an incident as we defined it earlier [^1].

We now need to draw a second relational matrix linking the impact a risk would trigger on each of the CIA security components in case it happens.
<br></br>
<table>
	  <tr>
		<th></th>
		<th>High</th> 
		<th>Moderate</th>
		<th>Low</th>
	  </tr>
	  <tr>
		<td>Confidentiality</td>
		<td></td> 
		<td></td>
		<td></td>
	  </tr>
	<tr>
		<td>Integrity</td>
		<td></td> 
		<td></td>
		<td></td>
	</tr>
	<tr>
		<td>Availability</td>
		<td></td> 
		<td></td>
		<td></td>
	</tr>
</table>
<br></br>

## Taking decision

Finally, we now know the basement of our organization Business and the risks that could impact it, backed with cost estimations. This analysis can be used as the base of a new security project aiming to **reduce** the probability and/or impact of one or several particular risks to acceptable levels.  
Alternatively, it could be decided that it would be too costly or risky (uncertainty) to reduce the risk and the organization will **accept** it.  
If the risk is accepted, it may be mitigated by using a **transfer**, for example to an insurance company. You should take note that in that case, the insurance won't cover any eventual legal misbehavior.  
Ultimately, if the risk is related to a new project or IT outsourcing contract [^2], it may be decided to **prevent** the risk, by canceling the project, if the analysis has shown a substantial restriction.

[^1]: This is my personal opinion.
[^2]: As it was the theme of the lecture that made me write this article.
