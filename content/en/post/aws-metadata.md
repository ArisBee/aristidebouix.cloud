---
title: "AWS Cloud metadata service abuse"
description: "Characterization and abuse of Cloud IaaS Metdataservices"
date: "2020-03-31"
categories: ["Cloud"]
tags: ["aws", "ec2", "metadata"]
type: "posts"
audio: "metadata.mp3"
draft: false
abo:
  image:
    url: "post/thumbnails/hacklab.png"
    width: 800
    height: 600
---

A few weeks ago, I presented an internal meetup to the pentesters of my company on how they could take advantage of weak or poorly configured IaaS metadata services. The end of the presentation was backed by an interactive CTF-like workshop that I have setup based on the work from [Avishay Bar](https://github.com/avishayil/caponeme) from CyberArk. While some suggestions from the workshop have been merged into the master, the complete lab is available on the forked version of the original repository available on my [Github account](https://github.com/Kharkovlanok/caponeme).

As the meetup went successfully, I've decided to make it available to a larger number through this blogpost.

## Where did the idea come from?

A few publications I read back last September over how confidential information of more than 100 Million clients from CapitalOne got compromised. At first, I was expecting again a boring weekly case of [S3 Bucket Negligence Award](https://www.zdnet.com/article/brazilian-security-firm-exposes-more-than-25-gb-of-client-and-staff-data/)[^1], but was quickly refuted as I learned a former AWS employee has been [arrested by the FBI](https://threatpost.com/aws-arrest-data-breach-capital-one/146758/) following the breach.

By diving a bit more on the topic, I found that the hack involved a misconfigured AWS WAF on a Loadbalancer as well as a Web Application hosted on an EC2 that happened to be vulnerable to the [Server Side Request Forgery](https://portswigger.net/web-security/ssrf) vulnerability. To summarize, this vulnerability allows you to request any data from the Application Backend on behalf of the Frontend.  
That's where it's interesting to see the hacker got the idea to request the AWS Instance Metadata Service or IMDS as it allowed her to extract credentials for the AWS API. From there, she was able to attach to the instance role the **S3FullAccess** policy and compromise all of the S3 buckets in the account. This scenario is represented on the below [Cloudcraft](https://cloudcraft.co/) diagram[^2].

![CapitalOne Hack](/post/metadata/capitalone.png)

## My personal touch: AWS privilege escalation

As a Cloud Security Architect raised in the creed of the least privileged principle, I don't want to believe the **S3FullAccess** policy was already attached to the EC2 instance. And I thought this could be a great occasion to rehearse how privilege escalation works.

Let's have a brief overview of what I've previously written on my blogpost [Pentesting on AWS]({{< ref "attack-on-aws-and-advanced-iam" >}}). Most of the time, an external insider wants to elevate its level of privileges in order to exfiltrate data. The easiest targets for that purpose are unencrypted Database and Storage services, I explicitly write unencrypted as encryption in the Cloud is the second strongest guarantee after the access controls to avoid a data breach. Indeed, you should never forget that, while Cloud providers provide strong guarantees in terms of security, the data you generate or import to the Cloud remains an API call away from being exposed to the public web. In that sense, encryption[^3] provides a second layer of control in the case you would mess-up your IAM configuration. 

I used the new AWS icons below to help you to visualize which AWS services are nice to target from an attacker point of view, let's call them Crown Jewels.

![Crown Jewels](/post/metadata/jewels.PNG)

Let's now analyze how AWS IAM works. AWS IAM is a wholly different beast from what you're used to in a Datacenter setup. The service isn't **Role Based Access Control** (RBAC) like Active Directory, but **Attribute Based Access Control**, which allows more fine-grained access control at the Cloud management API level. Moreover, it has a JSON flat file structure, I give you below an AWS IAM anatomy template of everything you may find in an IAM JSON policy. 

![Anatomy template](/post/metadata/anatomy.PNG)

It's now time for a simple exploitation scenario: "You are Alice, have some write IAM permissions for user administration and you wish to have a second impersonated account with full privilege access.". In such a situation, Alice needs 3 API calls to reach her goal:

1. **iam:CreateUser** Alice creates a second account for a User called Bob that won't attract much attention.
2. **iam:CreateAccessKey** While the user account Bob exists, Alice needs to create a password or access key in order to impersonate him.  
3. **iam:PutUserPolicy** Lastly, Alice attaches a highly privileged policy[^4] to her second user account. By doing so, Alice will have higher privileges by using the Bob account. 

![Scenario](/post/metadata/scenario.PNG)

## A Quick summary of the lab

Again the lab is available on [GitHub](https://github.com/Kharkovlanok/caponeme), it will deploy the following resources:

![SSRF hacking lab](/post/metadata/hacklab.png)

The goal is to extract the flag in the S3 bucket. To do so, you'll have to attach to the instance a new dedicated customer-managed policy called **SSRFS3Policy**, which is provisioned by the template. I've designed the template willingly in a restrictive manner, so there is no way to mess-up with IAM. Therefore, you can safely let your pentest colleagues try to catch the flag without worrying they can do much more on the AWS account itself.

This lab can be summed up into five steps:

* **Step 1**: You access the vulnerable webserver with the URL address output by the template.
* **Step 2**: You extract the AWS credentials from the webserver.
* **Step 3**: Check the current privileges attached to the [webserver](https://docs.aws.amazon.com/cli/latest/reference/iam/index.html)
* **Step 4**: You elevate your privilege by attaching another policy.
* **Step 5**: You pick up the flag in the S3 bucket.

Again you can give the link to this [previous post]({{< ref "attack-on-aws-and-advanced-iam" >}}) to your colleagues if they struggle on how to start.

## What to remember from the Defensive side

While it may sound odd after this lab, IMDS was originally a security feature made to prevent developers from using hardcoded AWS credentials or data in the environment variables, or even worst in the application code. AWS is the oldest public Cloud service provider and, as such was the first provider to release an instance Metadata service, later on, other providers such as [Microsoft Azure](https://docs.microsoft.com/en-us/azure/virtual-machines/windows/instance-metadata-service#using-headers) and [GCP](https://cloud.google.com/compute/docs/storing-retrieving-metadata#querying) tried to improve the service security by adding a static HTTP header.  
The addition of a static header in the request to the metadata service would be enough to prevent this whole lab from happening. However, in case the attacker would gain a bit more control, as in the case of a hidden shell or a form vulnerable to javascript upload, nothing prevents him or her from adding this static header and export the credentials on his or her local machine.

For this reason, AWS released during the last [re:Invent event](https://aws.amazon.com/blogs/security/defense-in-depth-open-firewalls-reverse-proxies-ssrf-vulnerabilities-ec2-instance-metadata-service/) a new version of the metadata service called IMDS version 2 that is protected by Session Authentication. Session Authentication means that the header is a dynamic token that needs to be first requested through a PUT request, the lifetime of this token can be set as low as one second, making the previous attack scenario far more difficult. To this date, this is the most secure control on the instance metadata service among cloud providers, the below table give a short recap of the security features of this new service version. 

![Instance Metadata Service Version 2](/post/metadata/imdsv2.PNG)

Nonetheless, at the moment AWS metadata service accept both IMDSv1 and IMDSv2 request, so you have to enforce it yourself. This can be done either by modifying the instance metadata options, this shouldn't be difficult to implement on all of your instances if you already apply the concept of immutable infrastructure.

```bash
aws ec2 modify-instance-metadata-options --instance-id <INSTANCE-ID> --http-endpoint enabled --http-token required
```

Or you can attach the following policy to all of your EC2 instance roles. This won't prevent the attacker from exporting the credentials outside of the webserver, but he will be systematically denied. 

```json
{ 
    "Version": "2012-10-17", 
        "Statement": [ 
          { 
            "Sid": "RequireImdsV2", 
            "Effect": "Deny", 
            "Action": "*", 
            "Resource": "*", 
            "Condition": { 
                    "StringNotEquals": { 
                              "ec2:MetadataHttpTokens": "required" 
                          } 	
                    }
              }
        ] 
} 
```

This last protection mechanism may be enforced on every AWS account with the help of AWS Organizations Service Control Policies ([SCP](https://docs.aws.amazon.com/organizations/latest/userguide/orgs_manage_policies_scp.html)). Perhaps I'll detail it in a future post.

[^1]: I've picked up the latest case I've found.
[^2]: The M4 instance type is a complete guess as it is a common type in production environments.
[^3]: With your own managed keys.
[^4]: For instance, the AWS managed AdministratorAccess policy that is natively present in every AWS account.
