---
title: "When the Patch Doesn't Save You: The AD FS Key Leak Bug"
date: "2026-08-10T19:56:10.448Z"
excerpt: "Microsoft released a fix for CVE-2026-56155, but simply running Windows Update isn't enough. Here is why this AD FS flaw is a real headache for anyone managing identity infrastructure."
category: "Tech"
tags: ["Tech", "Innovation", "Digital"]
image: "https://hackernoon.imgix.net/images/rymeSO93fMg9m2SRdMsCXRtvbhG2-sq93bn2.png"
readTime: "4 min read"
sourceUrl: "https://hackernoon.com/cve-2026-56155-the-actively-exploited-ad-fs-flaw-that-hands-over-your-identity-keys?source=rss"
---

There is a specific kind of cold sweat that hits you when you realize a security patch lied to you by omission. You click "Install updates," watch the reboot bar crawl across the screen, verify the OS build number, and figure you can go back to drinking your instant coffee. Except, in this case, your identity server is still wide open.

The flaw in question is CVE-2026-56155, an actively exploited bug in Microsoft’s Active Directory Federation Services (AD FS). On paper, it gets a middling CVSS score of 7.8. In practice, it hands over the master cryptographic keys that let you impersonate anyone in an organization.

## What CVE-2026-56155 Actually Does

AD FS is what many enterprise networks use to handle single sign-on (SSO). It authenticates a user once and hands them tokens so they can access internal apps, cloud infrastructure, and email without re-entering passwords. 

The security of this entire setup depends on private token-signing and token-encryption keys. AD FS stores those keys inside an Active Directory container called the Distributed Key Manager (DKM).

![Lines of Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

The vulnerability boils down to broken access control (CWE-1220) on that DKM container. The default permissions are far too broad. If an attacker gets a foothold on a local domain—even through a low-privileged standard user account on an unpatched office workstation—they can query the DKM container and read the raw cryptographic material.

They don't need domain admin privileges. They don't need to break complex encryption. They just read the keys because Active Directory lets them.

## The "Golden SAML" Problem

When an attacker grabs those token-signing keys, everything falls apart. They can generate custom authentication tokens that look 100% legitimate to downstream services like AWS, Azure, or internal apps. 

Security folks call this a "Golden SAML" attack.

![Data Infrastructure](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

Because the forged token is signed with the valid key, the target application accepts it without question. It bypasses multi-factor authentication (MFA). It bypasses password prompts. The attacker can wander into your cloud admin console or pull private emails, and to your logging tools, it just looks like the regular system administrator logging in from home.

CISA didn't put this in their Known Exploited Vulnerabilities list for fun—attackers are actively harvesting these keys right now.

## The Catch with the Patch

Here is where it gets nasty for sysadmins and developers maintaining enterprise infrastructure. 

Microsoft rolled out a fix in the July updates, but it only hardens the security model going forward. **It does not automatically fix existing permissions on a DKM container that is already misconfigured.**

If you run Windows Server 2012, 2016, 2019, or 2022 and you just push the July patch through WSUS, you are still vulnerable. The code update is installed, but the exposed keys in Active Directory retain their broken permissions until someone manually fixes the access control lists (ACLs).

![Workplace Scene](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

Think about how many server racks across places like Onitsha, Port Harcourt, or Ikeja run on legacy Windows Server setups maintained by lean, overworked IT teams. Between juggling fuel generators, managing local ISP downtime, and trying to keep legacy software running, "manually auditing Active Directory container ACLs after a Windows Update" is almost never on the to-do list. The assumption is usually: *the system says updated, so we are good.*

In this case, that assumption leaves your keys sitting on a silver platter.

## What You Need to Do

If you manage an AD FS setup or advise teams that do, don't assume the update fixed everything:

1. **Audit the DKM Container**: Use ADSI Edit or PowerShell to inspect the permissions on `CN=ADFS,CN=Microsoft,CN=ProgramData,DC=...`. Strip read permissions from any low-privileged groups or standard user accounts.
2. **Rotate Signing Keys**: If there is any chance an attacker was inside your network over the past few months, assume those token-signing keys were stolen. Generate fresh ones and update your trusted app configurations.
3. **Monitor Token Activity**: Look for abnormal logins coming from unexpected IPs using valid SAML assertions without matching MFA trigger logs.

It's a stark reminder that security isn't just code fixes—it's access control defaults. If your keys are readable by everyone, the cleanest code in the world won't protect you.