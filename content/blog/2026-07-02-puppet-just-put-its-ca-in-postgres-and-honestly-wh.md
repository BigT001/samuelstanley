---
title: "Puppet Just Put its CA in Postgres, and Honestly, What Took So Long?"
date: "2026-07-02T16:06:14.071Z"
excerpt: "Puppet Enterprise 2025.11 is out. Between database-backed CA storage, Postgres 17, and GPT-5 under the hood, here is my raw take on what actually matters."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fsxah9xot2orn9exhgcq9.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/puppet/puppet-enterprise-introduces-database-backed-ca-storage-in-202511-release-epl"
---

If you’ve ever had to recover a corrupted file system after a sudden power outage in the middle of a hot deployment—which, let’s be honest, is just a regular Tuesday when your local generator setup decides to cough and die—you know that flat files are fragile. Databases, on the other hand, are built for survival. 

With Puppet Enterprise 2025.11 dropping, the team finally answered a prayer some of us have been whispering for years: they’ve introduced database-backed Certificate Authority (CA) storage. 

Here is my practical, no-fluff look at what this update means for those of us writing code, managing servers, and trying to keep our infrastructure from falling apart.

---

### Filesystems are Out, Postgres is In

For the longest time, Puppet kept its CA data sitting directly on the file system. It worked, but it always felt like a bottleneck. Managing thousands of small cert files on disk is a nightmare for performance, especially when you are trying to handle backup routines or scale out. 

Now, they’ve added optional support to store all that CA data directly in a PostgreSQL database.

![A desk with lines of code on a screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

This is a massive win for reliability. By shifting this to Postgres, we get proper API-driven capabilities and vastly improved backup and recovery handling. If a server crashes while you’re trying to sync node configurations, you are much less likely to end up with a half-written, corrupted certificate file. It’s cleaner, safer, and much easier to manage from a DevOps perspective.

---

### The Auto-Upgrade to Postgres 17

Along with the CA changes, Puppet is pushing its managed installations from PostgreSQL 14 straight to version 17 during the upgrade process. 

Usually, major database upgrades make my stomach turn. If you’ve ever sat in a hot shared workspace in Gbagada with your laptop fan screaming while you try to manually migrate database schemas, you know how easily things can go south. 

Puppet promises this upgrade is automatic. If you are cautious like me, you can still manually upgrade your database before triggering the PE 2025.11 installer. Either way, getting access to the performance improvements and lower memory overhead of Postgres 17 is a huge plus for anyone running heavy agent workloads on tight hardware budgets.

---

### Infra Assistant Gets an AI Brain Transplant

Puppet has also swapped out the underlying models of its Infra Assistant for the GPT-5 series. 

![A close up of a laptop keyboard with code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

I am generally pretty cynical about AI integrations in developer tools. Half the time, they are just glorified search bars that hallucinate half your codebase. However, having a more consistent, context-aware assistant for querying configuration issues under the hood actually has some practical utility. If it can reliably debug why a specific manifest failed to compile without making me scroll through pages of raw stack traces, I'll take it.

---

### Saying Goodbye to Legacy OS Versions

The engineering team is also doing some necessary housecleaning. They’ve added support for macOS 26 (both ARM and Intel architectures), but the real kicker is that they have officially dropped support for Ubuntu 18.04 and Ubuntu 20.04.

I know for a fact there are legacy servers sitting in server rooms from Lagos to Akure still running Ubuntu 18.04 because "if it isn't broken, don't touch it." But with nearly 60 CVEs addressed in this Puppet release alone, security is not something you can compromise on anymore. It's time to upgrade those old boxes. 

---

### My Verdict

This isn't a flashy release with marketing buzzwords, and that’s exactly why I like it. It focuses on the stuff that actually keeps developers awake at night: performance, easier backups, better patching control (shoutout to the new `puppet_run_concurrency` setting), and keeping dependencies updated.

If you are running Puppet Enterprise, backup your current setups, get your migration plans ready, and prepare for that Postgres 17 jump. Your filesystem will thank you.