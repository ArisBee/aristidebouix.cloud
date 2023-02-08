---
title: "Migrating a static Hugo blog to AWS Amplify"
date: "2021-11-02"
description: "In this post I describe the historical technical considerations that applied to hmy website architecture built on AWS since 2016 to today"
categories: ["cloud"]
tags: ["migration", "refactoring", "aws", "hosting"]
type: "posts"
audio: "amplify.mp3"
abo:
  image:
    url: "post/thumbnails/amplify.jpeg"
    width: 800
    height: 600
---

<p class="notice">This is a cross-post from <a href="https://dev.to/catawiki/migrating-a-static-hugo-blog-to-aws-amplify-2nnb" target="_blank">Catawiki's blog</a></p>

Fond of Cloud, Open Source and new technologies, Aristide leads the implementation of security controls on Catawiki’s Auction platform. In this publication he describes the historical technical considerations that applied to his personal website architecture built on AWS since its creation in 2016 to today.

## Blog's Origins

Back in 2016, I used to work as a Django developer, and as such, after starting working on AWS, I decided to host a personal website as a Django blog on AWS Elastic beanstalk.  
The blog was extremely minimalistic and configured to use two small AWS VMs, one for the application and another one for a Postgres database hosted in a private subnet. It also involved an S3 bucket to load some static content such as images.

![Server based AWS architecture](/post/amplify/old_archi.png#center "Diagram 1: An Elastic Beanstalk 2-Tiers Architecture")

While this approach was convenient to start getting familiar with AWS and leveraging several of their based infrastructure services (VPC, CloudWatch, S3, RDS, Route53 ...), it had many drawbacks, such as:

1. Django framework is heavy to maintain and update for a side-project
2. Past the AWS free tiers, keeping two running VMs as small as they were wasn’t cheap [^1]
3. It simply couldn’t scale for more than 10 simultaneous users without autoscaling


## Going static

A bit later in 2017, I started hearing about these magic websites that could be built almost instantly using a static site generator and found that S3 could be configured to host them in one click. Therefore, I’ve benchmarked the two most popular solutions at that time, the Ruby engine Jekyll and the Go version called Hugo. As you can deduct it from this post’s title, I’ve gone for the second one as it was lighter and faster to build.

With a static website, I wasn’t required any longer to keep a dedicated database to host my blog posts, users and their comments. Instead, I’ve chosen to rely on external SaaS services such as Disqus for comments and Algolia for searching. Both solutions allow generous free-tiers usage for non-commercial use.

As serving content outside AWS is expensive, I’ve also added a Cloudfront distribution in front of the S3 bucket and was able to add a Lambda@Edge function in my website’s HTTP request responses[^2]. Lambda@Edge allowed me to add additional security to my website, such as preventing serving content from a non-explicitly allowed domain with a Content-Security-Policy (CSP) HTTP header. I also actively monitor the messages returned by these security headers through the excellent monitoring platform Report-URI from [Scott Helm](https://twitter.com/Scott_Helme?ref_src=twsrc%5Egoogle%7Ctwcamp%5Eserp%7Ctwgr%5Eauthor). The website architecture, therefore, was simplified as shown below:

![S3 Static website](/post/amplify/new_archi.png#center "Diagram 2: Static website hosted on S3")

This structure is much cheaper and more scalable and can serve thousands of users for less than €5 per month.

A remaining caveat was that it was difficult to restrict access to the S3 website from the CloudFront[^3] service only. As described [here](https://abridge2devnull.com/posts/2018/01/restricting-access-to-a-cloudfront-s3-website-origin/), the usual AWS best practice of setting an Origin Access Identity (OAI) is incompatible with S3 website endpoints. The only workaround is to set a hardcoded “password” in an HTTP header supported as a condition in the S3 bucket policy. In addition, you need a few additional resources to get an automated CI/CD deployment from a Git repository (AWS CodePipeline) or some monitoring and alerting (Cloudwatch Alarms).

## Moving to Amplify 

[AWS Amplify](https://aws.amazon.com/amplify/) was initially a response from AWS to the popular simple web app hosting solution Firebase from Google[^4]. It designates a toolset integrating many AWS services (CI/CD, Authentication, CDN, hosting, monitoring ...) in a single place.

Let’s see how it works. First you create a new hosting and choose the appropriate versioning service where the Hugo website skeleton is stored, in my case GitHub:

![Amplify console](/post/amplify/ampl1.png#center)

Then Amplify will automatically detect what framework it should use to build the project and propose an appropriate build configuration. Furthermore, in the advanced setting, you can configure Amplify build to use a custom docker image stored in ECR (Elastic Container Registry) and environment variables.

![Amplify console build settings](/post/amplify/ampl2.png#center)

And voila! The website is now live on an amplifyapp.com provided URL.

Another powerful feature of Amplify is that you can easily host different versions of your project based on different Git branches; this enables you to run a testing version of a new feature before rolling it out to your main website. However, you may not want to expose this staging branch to the outside world. The good news is that AWS Amplify permits to effortlessly set a Basic Authentication in front of any website’s version. The less good news is that for an AWS managed service, I would also have expected the possibility to log in a user based on their AWS IAM identity.

![Amplify console access control](/post/amplify/ampl3.png#center)

As I already own a Route53 hosted zone, let’s change the default amplifyapp.com provided URL to my usual custom domain[^5]. This will create a new CloudFront distribution with a free wildcard SSL certificate for your root domain and subdomains.

![Amplify console domain configuration](/post/amplify/ampl4.png#center)

If you follow this step, you may find that the console only redirects the root domain to the www subdomain during creation. For further redirection options, there is an additional 'Rewrites and redirects' menu that you can configure as follow.

![Amplify console sub-domains configuration](/post/amplify/ampl5.png#center)

The rationale in this configuration is that by default AWS Amplify Redirect unknown URLs to the main page, so if you wish to show your own ‘404 not found page’ , it is better to advertise it as a ‘404 (Rewrite)’ instead of a ‘404 (Redirect)’. 

Also, for SEO, it is better to replace the default ‘302 (Redirect - Temporary)’ HTTP return code to ‘301 (Redirect - Permanent)’. A 302 return code may confuse Search Engines that will continue to reference the wrong URL, as the redirection is supposed to be temporary, ending up slowing the initial loading time of visitors coming from the wrong URL.
Personally, I highly recommend choosing either your root or www subdomain and redirecting all other site references to it. Indeed, Search Engines tend to get confused when they’re getting the same page at different URLs. Do the same for the HTTP version of your site to HTTPS as you enjoy a free AWS managed SSL certificate, that will also decrease your domain spread.

The last screenshot is for the custom header editor that I’ve particularly enjoyed, there you can define your site HTTP headers in a yaml format[^6]. It is much more convenient than maintaining a lambda@Edge function. My only catch on this menu concerns the editor that I find quite basic. So I copy paste the code and edit it in a separate editor.

![Amplify console HTTP headers configuration](/post/amplify/ampl6.jpg#center)

There are a few additional power user functionalities that I don’t use for my relatively simple personal blog, so I won’t detail them here. These advanced functionalities include an Admin UI to configure team access to a serverless backend, direct CloudWatch monitoring and Alarm integration, and Pull Request system to merge changes between different branches and the master.

## Cost Analysis

This study wouldn’t be exhaustive without a full pricing comparison between the AWS Amplify and a custom Cloudfront+S3+Lambda integration. I will simplify it a little, since I’ve configured CloudFront, my S3 costs were very low, and Lambda@Edge costs have remained within the Lambda Free Tiers. Below is a breakdown of the different potential costs:
<br></br>

<table>
	<col style="width:20%">
	<col style="width:50%">
	<col style="width:30%">
	  <tr>
		<th></th>
		<th>CloudFront+S3+CodePipeline</th> 
		<th>Amplify</th>
	  </tr>
	  <tr>
		<td>Build</td>
		<td>$1.00 per active pipeline per month
$0.005 per build minute (Frankfurt using general1.small)</td> 
		<td>$0.01 per build minute</td>
	  </tr>
	<tr>
		<td>Storage</td>
		<td>$0.0043 per 10,000 GET and all other requests (Frankfurt)
$0.0245 per GB - first 50 TB / month of storage used (Frankfurt)</td> 
		<td>$0.023 per GB stored per month</td>
	</tr>
	<tr>
		<td>Egress</td>
		<td>$0.020 per GB - All data transfer out to Origin (Europe)
$0.085 per GB - first 10 TB / month data transfer out
$0.0120 per 10,000 HTTPS Requests</td> 
		<td>$0.15 per GB served</td>
	</tr>
</table>
<br></br>

One of the strengths of AWS Amplify is that costs are fixed for any region you operate in. This can prove more beneficial in certain geographic areas such as Asia Pacific, Australia or South America, where outbound traffic varies between $0.11 to $0.12.[^7]

Here is a more literal comparison based on my website costs for July 2021:
<br></br>

<table>
	<col style="width:10%">
	<col style="width:25%">
	<col style="width:25%">
    <col style="width:15%">
    <col style="width:15%">
	  <tr>
		<th></th>
		<th>Consumption</th> 
		<th>CloudFront+S3 costs</th>
		<th>Amplify theoretical costs</th>
        <th>Theoretical savings</th>
	  </tr>
	  <tr>
		<td>Build</td>
		<td>1 active pipeline
3 build minutes</td> 
		<td>$1 + $0.015</td>
		<td>$0.03</td>
        <td>$0.97</td>
	  </tr>
	<tr>
		<td>Storage</td>
		<td>10,000 GET and other requests
0.15 GB of storage</td> 
		<td>$0.0043 + $0</td>
		<td>$0</td>
        <td>$0.0043</td>
	</tr>
	<tr>
		<td>Egress</td>
		<td>300k HTTPS requests Europe
2.5 GB served
130k HTTPS requests US
1.3 GB served</td> 
		<td>$0.4+$0.2+ $0.15 + $0.15 = $0.9</td>
		<td>$0.6</td>
        <td>$0.3</td>
	</tr>
	<tr>
		<td></td>
		<td>Total</td> 
		<td>$1.91</td>
		<td>$0.63</td>
        <td>$1.28</td>
	</tr>
</table>
<br></br>

By using AWS Amplify, I got the same features for a third of the price while saving me from maintaining the underlying service components. This result is biased by the cost of keeping one running pipeline and relatively low traffic during summer.

## Conclusion

AWS Amplify is a managed service shipped with CloudFront, S3, CloudWatch, CodePipeline, Cognito, API Gateway and even a serverless backend. Therefore, it perfectly fits smaller size projects based on static websites or frontend oriented frameworks such as React, Vue or Next.js. 

While using AWS Amplify is convenient, if you operate a high Annual Rate Return service with more than 500k users, I would consider it more profitable to spend the additional Engineering effort to finely configure the corresponding underlying services[^8]. My conclusion to this blogpost is that, no matter how great a managed service such as Amplify, the Return On Investment decreases as consumption goes up. Therefore, the main target audience of AWS Amplify is individual developers to medium-sized applicative projects.

---

> Cover photo by [Scott Major](https://unsplash.com/@smajor15) on [Unsplash](https://unsplash.com/).

[^1]: I even considered at the beginning to reserve 2 instances for 3 years to decrease the cost and discovered that the smallest instance sizes (t2.micro and t2.nano) were not eligible.
[^2]: For the curious reader, I’ve detailed in [a previous post]({{< relref "secure-your-site-with-lambda-edge.md" >}}) how I achieved this result.
[^3]: AWS’ Content Delivery Network, used to locally cache static data and thus cut down egress costs.
[^4]: From which the pricing model has been largely inspired.
[^5]: _Beware_: I got an error at this step because the main root domain (aristidebouix.cloud) was still attached to the old CloudFront distribution. If you also migrate your website from a Cloudfront+S3 setup to Amplify you should first remember to remove the domain redirection in your old CloudFront distribution.
[^6]:See the [service documentation](https://docs.aws.amazon.com/amplify/latest/userguide/custom-headers.html) for reference.
[^7]: _Note_: the cost to serve HTTP requests is actually lower on CloudFront than for HTTPS requests probably due to a slightly lower impact on server CPUs. If as me you block or redirect HTTP requests then all your traffic will be billed as HTTPS requests.
[^8]: To the exception perhaps if your main market is located in expensive AWS regions such as South America, Australia or Asia Pacific.