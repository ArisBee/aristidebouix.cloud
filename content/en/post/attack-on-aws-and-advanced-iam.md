---
title: "Penetration testing on AWS"
description: "Cloud environments are often qualified as Insecure compare to traditional company Information Systems, however, through this article, I will show you that almost all known attacks can be stopped at early step with a few IAM best practices"
date: "2018-09-24"
categories: ["Cloud"]
tags: ["aws", "iam", "pentest"]
type: "posts"
audio: "attack-on-aws.mp3"
draft: false
abo:
  image:
    url: "post/thumbnails/cloud-hack.jpg"
    width: 800
    height: 600
---

In opposition with the general assumption, among companies which have a long compliance history in their field, top executives are often the most eager to migrate their On-premise infrastructure in favor of Public Cloud, expecting[^1] drastic operational cost savings. The opposition more often comes from the IT Operations and Security staffs who fear a loss of control on their data which goes along with the loss of control on the underlying infrastructure ( They miss Network and Security appliances, Hypervisors and sometimes even Racks and Wires :smirk: ).  
To defend the theory, according to which the Cloud is far less secure and does not fit their company business model; they often refer to past newspaper headlines about __*"Cloud Data Leak"*__ or __*"Cloud Sudden Disruption"*__. Although it's real (egg [AWS](http://www.digitaljournal.com/tech-and-science/technology/amazon-web-services-power-outage-took-hundreds-of-sites-offline/article/516595), [GCP](https://www.digitalcommerce360.com/2018/07/18/google-cloud-has-disruption-bringing-snapchat-spotify-down/) ...), the Disruption part won't be addressed in this post, I tend to believe that those incidents follow a downtrend, albeit they're clearly more mediatized now than at the beginning of Cloud computing ten years ago.

Concerning the compromision part, most are related to the disclosure of confidential data publicly exposed in web object containers[^2] or to crypto mining, where compromised credentials are used by a hacker to mine on someone else's bill[^4].    
From the above statements, we can already identify several levels of hackers who could threaten your Cloud environment:

1. **Level 1**: They are Script Kiddies who find some random AWS credentials on Github or Pastebin and will use them to set-up instances and mine as much as they can.

2. **Level 2**: They will do the same as level 1 but will try to hijack your account to slow your reaction.
3. **Level 3**: This type of attacker will be more stealth and will either try to mine without affecting too much your monthly bill or extract some company confidential data to sell them on the dark web.
4. **Level 4**:  This is the most advanced type of attackers who precisely targeted your organisation for their activities or influence and will set-up a high level of stealth and persistence. They can be governmental or criminal organisations looking for a specific type of data to extract possibly on an extended period.

To defend your organisation against those threats, it's good to know how an attacker would operate. If the methods and tools may differ from a traditional penetration test exercise, the steps remain globally the same:

1. Recon
2. Initial compromise
3. Trails covering
4. Exploration
5. Escalation
6. Persistence 
7. Exfiltration

I don't recommend you to try to ignore Cloud computing use in your company as, while you officially use it or not, many IT professionals are probably already using it to improve their agility and help them to work faster on their everyday tasks. Also, it's better having a clear security policy related to cloud computing rather than a wild Shadow IT culture which increases drastically your risks of being exposed.

# Attack

## Recon

This step doesn't really differ from for a traditional environment; the attacker will try to gather publicly available information, it can be AWS hardcoded credentials/SSH keys on a code repository such as Github or a text storage site such as Pastebin. This step can be automatized thanks to usual web crawlers such as [SearchDiggity](https://www.bishopfox.com/resources/tools/google-hacking-diggity/attack-tools/). Alternatively, an attacker could get a set of credentials on the download folder of an already compromised laptop/desktop. 
DNS lookup on public servers from the targeted company can still be worse having a look to assemble a list of sign-in URL where to try the collected credentials. In particular MX, TXT and SPF records. 
Ultimately use Shodan command line ( Or with [SearchDiggity](https://www.bishopfox.com/resources/tools/google-hacking-diggity/attack-tools/)) to find some exposed ssh/telnet ports to try the collected SSH keys or brute force weak passwords, some reverse domain lookup options are available for that purpose.  
A new source of information that didn't exist before are public object containers ( such as S3 ) or message queue endpoints ( such as SQS ), some people recently indexed this publicly available content so you can browse it with a search engine such as Google [here](https://cse.google.com/cse/publicurl?cx=002972716746423218710:veac6ui3rio#gsc.tab=0). 

**Mitigation**: As this early step is necessary to the hacker to take step in your environment, I'm considering here *Errare humanum est* and by the fault of one of your sysadmin employee or third party provider, no matter how strict is your security policy or data classification model, that critical information end-up on the Internet.

## Initial compromise

This step is a pretty basic one; it consists of associating found login credentials with the found list of AWS accounts to get console access. For access key and command line interface, the association is done automatically.
Alternatively, if you compromised an ec2 instance with a found ssh key or week password[^5], check if this instance has an associated AWS role allowing you some further actions by executing:

```bash
[ec2-user ~]$ curl http://169.254.169.254/latest/meta-data/iam/security-credentials
```

If none is found, I'm sorry guys, but you won't be able to do anything more than setting a CPU miner from this instance.

**Mitigation**: In this step again, while a lot could be done on the prevention side ( see my previous publication on [*Risk Analysis*]({{< relref "introduction-to-risk-analysis.md" >}})), I will let the attacker go further so we can focus on Detection and Response aspects. Moreover as indicated on this [StackOverflow post](https://stackoverflow.com/questions/34861574/aws-iam-account-lockout-on-failed-login-attempt), there is currently no way to prevent a user from trying multiple attempts to login (aside from setting an OTP two-factor authentication, by doing so, and even if the credentials are right, he won't be able to log in).

## Trails covering 

Once in, the first action that an attacker would attempt is to hide his presence. On AWS, what he could do is stop and delete the current Cloudtrail trail as well as existing logs in the logging S3 bucket if he does has permissions to do so.
A more advanced attacker could after that try to create a new trail with a new KMS encryption key to give to the AWS administrators the illusion that logging is still working correctly, once done he can schedule the KMS key deletion in 7 days, which is the minimum, in that way the log files won't be recoverable.

**Mitigation**: First of all, athought the attacker was able to log in, you could have used some IAM conditions to prevent the user from any action if they're not connecting from one of your company IP. You could object, what if the user uses role credentials from a compromised instance? In that particular case he better not try to extract them from the instance as role credentials used outside of the corresponding AWS resource is a very suspicious pattern. In all cases and even for smaller business accounts, API access to both Cloudtrail and KMS services should be strictly restricted and controlled and MFA for deletion set-up on the bucket containing your log files.  
Honestly why an ec2 instance would have the permission to stop or reset your AWS account logging or permissions on the S3 container dedicated to log files.

## Exploration

No matter if the attacker succeeded or not to disrupt your account monitoring, the second things he would attempt in order to improve its level of permission is to read as many information he can from your environment, such as provisioned CloudFormation stacks, your ec2 instances limits and of course existing users and roles with their different sets of permissions.  
I recommend you to be careful about list permission on Cloudformation stack as they may contain critical unencrypted credentials such as databases master user and password. I'm highlighting here that Cloudformation [supports](https://aws.amazon.com/blogs/mt/integrating-aws-cloudformation-with-aws-systems-manager-parameter-store/) since a few month System Parameter Strings for more security on those aspects. 

**Mitigation**: You can detect those actions in Cloudtrail logs, they correspond to multiple read access by the same user/role within a short period.

## Escalation 

This step is the most interesting one, after the attacker was able to collect a lot of data about your account configuration (possibly including its own level of permission), he or she may attempt to get full administrator permissions various technics are detailed on this [blog post from Rhino Security labs](https://rhinosecuritylabs.com/aws/aws-privilege-escalation-methods-mitigation/).
After a detailed analysis of this article, we see that most procedures imply the attacker must compromise IAM user or role with IAM permissions, the second service to strictly monitor is STS that can be used in addition to an IAM access to get credentials. I will consider you have been a careful on the IAM service permissions and you restricted the most evident source of compromise such as iam:CreateRole and iam:CreateUser.
Here a table resuming the chronology of an escalation attempt per level of API call[^6]:

<br></br>
<table>
	  <tr>
		<th>Escalation process summary</th>
		<th>\(1^{st}\) compromised API call</th> 
		<th>\(2^{nd}\) compromised API call</th>
		<th>\(3^{rd}\) compromised API call</th>
	  </tr>
	  <tr>
		<td>Change attacker current policy version</td>
		<td>iam:CreatePolicyVersion</td> 
		<td>-</td>
		<td>-</td>
	  </tr>
	<tr>
		<td>Set the attacker role or user policy to a previous version</td>
		<td>iam:SetDefaultPolicyVersion</td> 
		<td>-</td>
		<td>-</td>
	</tr>
		<tr>
		<td>The attacker creates an API access key for another existing user</td>
		<td>iam:CreateAccessKey</td> 
		<td>-</td>
		<td>-</td>
	 </tr>
	<tr>
		<td>The attacker creates a login access(and set password) for an API only user</td>
		<td>iam:CreateLoginProfile</td> 
		<td>-</td>
		<td>-</td>
	 </tr>
	<tr>
		<td>A slight variant where the attacker update an existing login profile(and reset password/mfa)</td>
		<td>iam:UpdateLoginProfile</td> 
		<td>-</td>
		<td>-</td>
	 </tr>
		<tr>
		<td>The attacker adds his or her compromise user to a new group to access their level of permission</td>
		<td>iam:AddUserToGroup</td> 
		<td>-</td>
		<td>-</td>
	</tr>
	<tr>
		<td>The attacker can assign a new policy to his or her IAM user/group/role</td>
		<td>iam:AttachUserPolicy, iam:AttachGroupPolicy, iam:AttachRolePolicy</td> 
		<td>-, - , sts:AssumeRole</td>
		<td>-</td>
	 </tr>
	<tr>
		<td>Variant, the attacker updates an inline policy to his or her IAM user/group/role</td>
		<td>iam:PutUserPolicy, iam:PutGroupPolicy, iam:PutRolePolicy</td> 
		<td>-, -, sts:AssumeRole</td>
		<td>-</td>
	</tr>
	<tr>
		<td>The attacker updates an existing role to be able to assume it</td>
		<td>iam:UpdateAssumeRolePolicy</td> 
		<td>sts:AssumeRole</td>
		<td>-</td>
	 </tr>
	<tr>
		<td>If the attacker cannot assume a role he or she can use an ec2 instance as an intermediary</td>
		<td>iam:PassRole</td> 
		<td>ec2:RunInstances</td>
		<td>-</td>
	</tr>
	<tr>
		<td>Variant: If the attacker cannot assume a role he or she can use a lambda function as an intermediary</td>
		<td>iam:PassRole</td> 
		<td>lambda:CreateFunction</td>
		<td>lambda:InvokeFunction</td>
	</tr>
	<tr>
		<td>Variant: If the attacker cannot assume a role he or she can use a Cloudformation Stack as an intermediary</td>
		<td>iam:PassRole</td> 
		<td>cloudformation:CreateStack</td>
		<td>-</td>
	</tr>
	<tr>
		<td>Variant: If the attacker cannot assume a role he or she can use a Glue endpoint as an intermediary</td>
		<td>iam:PassRole</td> 
		<td>glue:CreateDevEndpoint</td>
		<td>-</td>
	</tr>
	<tr>
		<td>Variant: If the attacker cannot assume a role he or she can use a DataPipeline as an intermediary</td>
		<td>iam:PassRole</td> 
		<td>datapipeline:CreatePipeline</td>
		<td>datapipeline:PutPipelineDefinition</td>
	</tr>
</table>
<br></br>

There are a few remaining possible cases which don't necessitate IAM by using the permissions of an already existing service (role), whose can be controlled to increase attackers privileges.
<br></br>
<table>
	  <tr>
		<th>Escalation process summary</th>
		<th>\(1^{st}\) compromised API call</th> 
		<th>\(2^{nd}\) compromised API call</th>
		<th>\(3^{rd}\) compromised API call</th>
	 </tr>
	<tr>
		<td>The attacker update the code of an existing lambda to raise his or her permissions</td>
		<td>lambda:UpdateFunctionCode</td> 
		<td>-</td>
		<td>-</td>
	</tr>
	<tr>
		<td>The attacker update a Glue endpoint to change its ssh key</td>
		<td>glue:UpdateDevEndpoint</td> 
		<td>-</td>
		<td>-</td>
	</tr>
</table>
<br></br>

**Mitigation**: As you can see, this step always involves the access to the AWS IAM service either directly from the compromised credentials or by using the permission of an existing resource. Two best practices to stop the compromise chain are to strictly control users, groups, and roles which access to the IAM service as well as enforcing the least privilege principle and abnormal patterns. For instance, you can use a condition on the user login IP or time to restrict the attack surface.  
Another best practice is to restrict IAM permission to a dedicated IAM account where only IAM actions can be processed, and from where users would access other account using sts:AssumeRole, I will detail this solution in more details in a second part.

## Persistence

If the attacker successfully passed the previous step he or she now has full Admin permissions on your IAM account and could kick you out. However, if he wants to take time to target more precisely or mine regularly, he or she has better to stay stealth. But what if his or her credentials are identified as compromised and disabled, it could be by either restricting further the security group of a compromised instance or the attacker IAM resources get deleted?  
Because of these uncertainties, the attacker has interest to create a new backdoor role or user and/or permissive rule in the Security Group, according to how the previous steps went through. Once done, you should create a lambda identifying a delete event corresponding to those resources and sending you all the new information on a dedicated endpoint such as requestb.in[^7].  
You can refer to the scheme below to visualize the process:

![Persistence automation](/post/attack-aws/lamb_trigg.png)

**Mitigation**: This is an example which isn't always easy to identify in an enterprise context where potentially hundred of lambda may be written and potentially kept unused once their main purpose has been achieved ( indeed keeping them is free ). However, we see that keeping too many unused lambda functions in an account could highly help an attacker, including in the previous step to find a lambda function with permissive privileges. Therefore I recommend you to list regularly your lambda functions and monitor when they're idle for an extended period. A multi AWS account strategy can help you in the mitigation process as there will be fewer functions in a same account and region so that you can distribute the inventorying work among the company.
 
## Exfiltration

Finally, the last step of our compromise chain is when the attacker will try to export as many information as possible from your account. It can, for instance, be crucial production data which he will make a snapshot, export it, encrypt the existing data and ask for a ransom.
First, let's identify all the data container services that could be subject to a ransom as shown below:

![Ransomable AWS services](/post/attack-aws/data.PNG)

For most of those services, you can make a snapshot of the live production data, encrypt the original data with a new KMS you schedule the deletion in 7 days, export the snapshot in an s3 bucket in the account and then copy all the content of that bucket in a bucket you own or directly download it on a local machine.  
Of course, the attacker made sure he or she has the permission to do all of those actions during the **[Escalation]({{< ref "#escalation">}})** step.

**Mitigation**: Frankly speaking, if you were not able to prevent the attacker going that far you are [doomed](https://threatpost.com/hacker-puts-hosting-service-code-spaces-out-of-business/106761/). Possibly if you had a multi-AWS account strategy ( Which wasn't the case of **Code Spaces** ) and you thought regularly replicating your production data in another account you may be able to recover.

 
# Defense in Depth

In this step, I will describe how you could design your AWS environment in a secure and managed way that would have made the previous steps highly unlikely.

As this article is getting already longer than what I expected, I've decided to dedicate a second richly illustrated post on how to proceed to the setup of a secure and controlled environment. Stay tuned :satisfied: !!


[^1]: Often wrongly
[^2]: Mostly AWS S3 ( [Accenture](https://www.zdnet.com/article/accenture-left-a-huge-trove-of-client-passwords-on-exposed-servers/ ), [NSA](https://www.bleepingcomputer.com/news/security/top-secret-us-army-and-nsa-files-left-exposed-online-on-amazon-s3-server/), a [phone spying company](https://motherboard.vice.com/en_us/article/9kmj4v/spyware-company-spyfone-terabytes-data-exposed-online-leak), ... )
[^3]: From [Tesla](https://www.wired.com/story/cryptojacking-tesla-amazon-cloud/) to this random user on [reddit](https://www.reddit.com/r/aws/comments/8min7a/old_aws_account_compromised_how_to_deal_with/)
[^4]: If you're interested in how to set-up the process, see my previous article *[Mining on AWS]({{< relref "mining-on-aws.md" >}})*
[^5]: This last option is less likely as AWS always set-up instances with an ssh key at launch
[^6]: If you need more detail on the different AWS services level of permission, the best-summarized source I've found is on [cloudonaut](https://iam.cloudonaut.io)
[^7]: While I'm writing this post, the public hosted version has been discontinued, and you will have to set up your own instance using sources [here](https://github.com/Runscope/requestbin#readme)
