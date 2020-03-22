---
title: "Taking advantage of quotas on Windows Server 2016"
date: "2018-01-16"
description: "A very nice Windows automation feature, not that well documented"
categories: ["SysAdmin"]
tags: ["windows", "server", "automation"]
type: "post"
audio: "quotas.mp3"
abo:
  image:
    url: "post/thumbnails/windowsserver.png"
    width: 800
    height: 600
---

In this short article, I will show you how to use directory quota on Windows Server in order to launch a Powershell script when a limit threshold is reached.
Although those settings have been done on a Windows Server 2016, it would probably work the same way on a 2012 or 2008 R2 machine.

First, you need to install the *File Server Resource Manager* Role in the Windows Manager Console as shown in the screenshot below.

![FSRM location](/post/quota/azure.png)

Once installed, right click on your server properties in the console and open the FSRM Role, on the left you should see a field called Quota Management, it contains two subfields:

1. Quota Templates contain templates with predefined limit and their type. A Soft limit means that we can continue to drop content once the limit is reached, while a Hard limit would block any additional content.

2. In the Quota subfield, we can associate a template with a folder, for instance here I put quotas on the Azure logs folders which are temporary folders used by the Azlog agent to reforward my Cloud environment logs to a third party analytics tool, which will perhaps be the object of another blog post.

![Quota folders](/post/quota/file_manager.png)

By right clicking on a folder, we can now edit the properties of a quota, four actions are available:

* We can send an e-mail before the quota reaches its limit.
* Generate an event log entry.
* Execute a custom script, for instance, to empty the folders before our server gets saturated.
* Generate a report

![Quota settings](/post/quota/quota_prop.png)

Let's now write a Powershell script *deleteold.ps1* to delete all files older than one month in the folder, which have probably already been forwarded to our analytic tool by that time.

```bash
# Delete all Files in C:\temp older than 30 day(s)
param
(
	[Parameter(mandatory)]
	[ValidateNotNullOrEmpty()]
	[string]
	$Path,
	
	[int]
	$MaxAge = 30
)
if($Path -nomatch "^[a-z]:\\$")
{
	Get-ChildItem $Path | Where-Object { $_.LastWriteTime -lt (Get-Date).AddDays( - $MaxAge) } | Remove-Item -Force
}
```


Our script *deleteold.ps1* takes two parameters, one mandatory which is the path to our folder, and another optional one which is the minimum age of the files we want to delete in days, 30 days by default.

The last step is to call this script as soon as the quota reaches 95% of its limit, which can be done in the quota settings as shown in the screenshot below.

![Call script](/post/quota/com.png)
