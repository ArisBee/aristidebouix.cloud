---
title: "Ship your Applicative log files anywhere"
date: "2018-04-10"
description: "All is in the title"
categories: ["SysAdmin"]
tags: ["unix", "monitoring", "syslog"]
type: "posts"
audio: "applicative-logs.mp3"
abo:
  image:
    url: "post/thumbnails/centos.jpg"
    width: 800
    height: 600
---

As I recently had to manage an integration project for the Security Operation Center service of a big company, I had to configure applicative logs forwarding to the nearest SIEM syslog collector for each service included in the scope.

I've found that the rsyslog agent is usually preinstalled in any Unix distribution with default operating system log folders configured out of the box so that the system log forwarding is most of the time almost as simple as `service rsyslog start` [^1].  
In other cases, if you want to forward certain log files only, for example, your application user login history in order to detect any brute force attempt, it may be better to configure them directly through the *rsyslog* *imfile* module. 

To do so, you first need to enable it in *rsyslog.conf*, there are two ways to load the module, a legacy one:

```
vi /etc/rsyslog.conf

# add the following in the MODULE section
$ModLoad imfile
```

And for recent versions of rsyslog, with 10 seconds polling:

```
vi /etc/rsyslog.conf

# add the following in the MODULE section
module(load="imfile" PollingInterval="10")
```

In order to forward log files, you should associate them to a [facility level](https://unix.stackexchange.com/questions/90842/what-is-the-local6-and-all-other-local-facilities-in-syslog) which will be sent to the syslog collector, for instance, I will take local4. In that way, the following line indicates to the rsyslog client that logs from local4 should be forwarded to server *172.18.0.1* on port syslog 514, alternatively, you could use the machine domain name and port 6514 for syslog over TLS.

```
local4.* @172.18.0.1:514
``` 

There is two ways to input an *imfile*, either you define them in the *rsyslog.conf* file or you create separate files in */etc/rsyslog.d/*.  
Let's define them inside of *rsyslog.conf* between *imfile* module load and the syslog collector address line:

New format:

```
# File 1
input(type="imfile"
      File="/path/to/file1.log"
      Tag="tag1"
      Severity="warning"
      Facility="local4")

# File 2
input(type="imfile"
      File="/path/to/file2.log"
      Tag="tag2"
      Severity="warning"
      Facility="local4")

```

Legacy format:

```
# File 1
$InputFileName /path/to/file1.log
$InputFileTag tag1
$InputFileStateFile stat-tag1
$InputFileSeverity warning
$InputFileFacility local4
$InputRunFileMonitor

# File 2
$InputFileName /path/to/file2.log
$InputFileTag tag2
$InputFileStateFile stat-tag2
$InputFileSeverity warning
$InputFileFacility local4
$InputRunFileMonitor

# check for new lines every 10 seconds
$InputFilePollingInterval 10
```

The *$InputFileStateFile* is used to keep track of which parts of the file is already processed and is natively handled in the new format.  
If you want to keep the *rsyslog.log* file clean, create the following dedicated config file */etc/rsyslog.d/file1.conf*:

New format:

```
# File 1
input(type="imfile"
      File="/path/to/file1.log"
      Tag="tag1"
      Severity="warning"
      Facility="local4")
```

Legacy format:

```
# File 1
$InputFileName /path/to/file1.log
$InputFileTag tag1
$InputFileStateFile stat-tag1
$InputFileSeverity warning
$InputFileFacility local4
$InputRunFileMonitor
$InputFilePersistStateInterval 1000
```

Everything is now set up to peacefully start/restart the rsyslog service:

```
service rsyslog restart
```

You can find more information on imfile parameters in the [official documentation](http://rsyslog-doc.readthedocs.io/en/latest/configuration/modules/imfile.html).  

[^1]: If you, of course, already have open any intermediary firewall and configured the destination IP address in the *rsyslog.conf* file.

