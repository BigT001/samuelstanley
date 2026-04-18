---
title: "Your CAC Data Might Be Floating Around (And It’s Not Just Sapa We’re Fighting)"
date: "2026-04-18T14:43:55.933Z"
excerpt: "If you've ever spent weeks fighting the CAC portal to register a business, this one is going to sting. The NDPC is probing a breach, and it’s a mess."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://technologytimes.ng/wp-admin/admin-ajax.php?action=rank_math_overlay_thumb&id=190723&type=gif&hash=37e936803f01d4db25b561f2cbf78f18"
readTime: "4 min read"
sourceUrl: "https://technologytimes.ng/ndpc-probes-cybersecurity-berach-at-cac/"
---

I remember the first time I tried to register a company in Nigeria. It felt like a rite of passage—wrestling with a portal that seemed to go down every time the wind blew too hard in Abuja. But once you finally get that RC number, you feel like you’re finally "legal." You’ve handed over your NIN, your home address, your signature, and your director details. You trust the system.

Well, that trust just took a massive hit. The Nigeria Data Protection Commission (NDPC) is currently probing a cybersecurity breach at the Corporate Affairs Commission (CAC). As someone who writes code and manages databases for a living, this news makes my skin crawl. 

![A close-up of code on a screen representing the technical side of data security](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### It’s Never Just a "Glitch"
When a government agency mentions a "breach," my dev brain immediately starts wondering about the stack. Was it a poorly configured S3 bucket? An unpatched SQL injection vulnerability that’s been sitting there since 2019? Or maybe just some "Oga at the top" clicking a phishing link in a suspicious email? 

In our ecosystem, we talk a lot about "building for the next billion," but we rarely talk about protecting the data of the few millions who are already here. For a founder running a small hub in Akure or a developer working remotely from a quiet corner in Jos, the CAC is the source of truth. If that truth is compromised, we aren’t just talking about leaked emails. We’re talking about identity theft on a scale that can ruin businesses before they even ship their first MVP.

### The "No Gree" Mentality vs. Data Privacy
We like to say "No gree for anybody," but when it comes to data privacy, we’ve been "gree-ing" for too long. We’ve become desensitized to our data being handled carelessly. 

![Data and finance visualization representing the scale of the breach](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

I’ve seen how some of these local systems are built. Sometimes it feels like the security is held together by hope and a few lines of legacy PHP. When you’re building a product in a Gbagada workstation, you’re worried about uptime and your AWS bill. You expect the national infrastructure to at least keep the front door locked. 

The NDPC probing this is a good sign—it means there’s finally some level of accountability—but a probe doesn't un-leak data. Once that JSON file full of director details is on a dark web forum, it’s gone. You can’t "patch" a leaked home address.

### What This Means for Us
If you’re a builder in this space, this is a loud wake-up call. We can't rely on "government grade" security to protect our interests. We need to be more intentional about how we handle the data we collect from our own users. 

I’m tired of seeing cybersecurity treated as an afterthought or a "luxury feature" that we'll implement after the Series A. Whether you’re hustling in the chaotic energy of an Owerri bus park or shipping code from a posh office in Lekki, your users' data is a liability, not just an asset.

![Nigerian scene reflecting the real-world impact on local businesses](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

We need to start asking harder questions. If the CAC—the very foundation of corporate existence in Nigeria—can be breached, what are you doing to make sure your own database isn't a sieve? 

The NDPC needs to do more than just "probe." We need a post-mortem. Tell us what went wrong. Was it an API endpoint with zero authentication? Was it an internal job? As devs, we learn from failures. If the CAC fails in silence, we’re all bound to repeat the same mistakes in our own builds. 

Stay paranoid, keep your salts long, and for heaven's sake, stop hardcoding your API keys.