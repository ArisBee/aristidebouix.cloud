---
title: "Integrate ServiceNow with your AWS Cloud!"
description: "Open sourcing of an automated Cloudformation deployment to enable interactions between ServiceNow and AWS"
date: "2019-02-27"
categories: ["Cloud"]
tags: ["aws", "snow", "serverless"]
type: "post"
audio: "snow.mp3"
draft: false
abo:
  image:
    url: "post/thumbnails/snow.png"
    width: 800
    height: 600
---

Now that I'm on vacation, I wanted to introduce you to a project I've spent a couple of weeks on a few months ago on ServiceNow.

I have already dived a first time in the ServiceNow API while I was working at the Governance of a SOC service. There I tried to integrate ServiceNow to our processes using Google script to enhance the service workflow throughput[^1]. Sadly I wasn't able to go that much farther as the IT accountability department refused to give me required credentials. 

This time I go a step farther with the full set-up of an API on AWS reacting to events in ServiceNow. As I detailed all the steps on my [Github account](https://github.com/Kharkovlanok/snow-aws-integration), instead of writing back the instructions here, I'm going to explain to you all of the insights between such an integration project. By that way, I mean what the reasons and use cases me and my team were aiming at.

Let's start by explaining, for those who ain't familiar with it, what is ServiceNow and more generally a CMDB.

# What is a CMDB?

ServiceNow is the trendiest of what we commonly call in the IT world a Configuration Management Database, in ServiceNow's case it is provided as a SaaS service. Therefore as the name let us foreseen it's a database listing (or supposed to list :smirk: ) all of the components[^2] of an organization information system.

Typically it would be your virtual machines and servers, the applications built on them with Operating systems, software and middleware versions as well as your user accounts with their role or any kind of IT support ticket ... 

# What benefits bring a closer integration of your CMDB with AWS?

As you got it, the CMDB is a critical part of your Information System, and one of the most significant challenges is to keep it up to date so your organization staff can merely rely on it to get the information required to do their job.

In the past, this Database used to be updated manually by service owners, however nowadays, at the Golden Age of Cloud Computing, we probably can do better than such a manual, error-prone process. Indeed, in those new Public Cloud environments such as AWS, which are now fully part of our digital companies Information System, it's all about API and Automation. 

Now I bet you got how the idea came out, ServiceNow is a SaaS service with an API, AWS empowers us to create customized API easily as well as to trigger cloud function following a specific event, so let's make them interact. 

# What are the underlying risks?

Now you may wonder, where is the trick? If interconnecting AWS and ServiceNow is so powerful why didn't both of these company didn't release more tutorials and modules to facilitate it? 

I would say, it's mostly about priority and use cases, what already exists at the moment are:

* A ServiceNow [Discovery capability](https://docs.servicenow.com/bundle/istanbul-it-operations-management/page/product/discovery/concept/c_DiscoverAWSCloud.html) for most AWS IaaS services 
* A ServiceNow [Discovery capability](https://docs.servicenow.com/bundle/store-it-operations-management/page/product/itom/concept/aws-lambda-discovery.html) for some AWS SaaS services
* An AWS service catalog [connector](https://docs.servicenow.com/bundle/istanbul-it-operations-management/page/product/cloud-provisioning/concept/c_AWSCloudAdminTasks.html)

These are already welcome features, but we can go farther in possibilities and supported resources by crafting an API with the REST Message element of ServiceNow. As I guess most of my readers are more knowledgeable of the AWS world than ServiceNow, you can compare that to using a Custom resource in Cloudformation to extend the list of supported services and API through lambda[^3]

As usually in Cloud Computing the biggest threat to this integration are the endpoint security, see the improvement section [below](#improvement-suggestion), as well as fine-grained IAM permissions for the lambda functions. Concerning this second aspect, I particularly enjoy this [solution](https://github.com/functionalone/aws-least-privilege) relying on AWS X-Ray.

# Use Case example

Here an advanced case going beyond the native modules I wrote above about.  
The diagram below shows an example of AWS IAM permissions provisioning directly from ServiceNow with a manual approbation step. Obviously, my Github repository only covers the stages I, II, III, X, and XIII on the left, I count on your creativity to automatize the rest efficiently or bring your own use cases  :smile: .

![Example of ServiceNow and AWS integration](/post/snow/SNOW Integration.png)

Below a detailed explanation of each step:

1. A permission is added to an existing IAM user. It can be the permission to assume an IAM role in a specific account of an IAM Organization

2. The call is authenticated using HTTP Basic Auth, or even better OAuth 

3. The Authorizer function returns the result 

4. If the call passed the Authorizer function lookup, it is forwarded to lambda, if the credentials were invalid API Gateway returns a 503 forbidden access message to the ServiceNow instance
5. The first lambda function retrieves the contact of the resource owner 
6. For example, the resource owner could be the person responsible for the AWS account where the role is granted
7. A validation email with a link to a second lambda API function is forwarded to the resource owner
8. While the request is on hold for validation, the first lambda stores the message with a tag in an SQS queue
9. The resource owner validates or denies the request and can fill a reason field
10. API Gateway forward the response from the resource owner to a second lambda function
11. This lambda function retrieves the original request in SQS 
12. According to the resource owner answer, the permissions are added or not to the user in the IAM dedicated AWS account
13. The result of the action is returned with the feedback of the resource owner to ServiceNow which can update the record.

# Improvement suggestion

I'm unsatisfied enough with the current API Gateway authorizer function which relies on an HTTP Basic Authentication. Indeed this way of authenticating has many [flows](https://security.stackexchange.com/questions/988/is-basic-auth-secure-if-done-over-https/990#990) that makes it mostly legacy nowadays. I firstly wanted to implement OAuth 2.0 but didn't take time to make it works. Furthermore now that Cognito service exists I don't see the interest of maintaining an Authorizer function at all and actually spent several days trying to register the ServiceNow instance to a Cognito UserPool to allow it to reach the API.

Please don't hesitate to DM me or propose a commit if you've already done it or have some ideas.  

# TO COME: A video set-up walkthrough

I've realized following up the README tutorial from the Github repository might still be a bit tedious for those who've never committed to ServiceNow administration before, also I've decided to spend a bit of time on a video tutorial.

Stay tuned :satisfied: !!  

[^1]: for those interested, I published the experiment as a [Gist](https://gist.github.com/Kharkovlanok/683b8bbf0bc4680b078f815b1b81c05c)
[^2]: according to the ITIL definition
[^3]: which happens regrettably far too often

