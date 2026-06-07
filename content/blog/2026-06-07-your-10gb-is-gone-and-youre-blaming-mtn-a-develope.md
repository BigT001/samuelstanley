---
title: "Your 10GB is Gone and You're Blaming MTN (A Developer's Take)"
date: "2026-06-07T08:43:26.545Z"
excerpt: "MTN is building a 'black box' data portal to prove they aren't swallowing your gigabytes. As a developer, I'm looking at the technical hurdles and why our data actually vanishes."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://cdn.businessday.ng/wp-content/uploads/2026/03/IMG-20260319-WA0011.jpg"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/mtn-battles-subscriber-anger-with-data-transparency-portal-n1trn-expansion-blueprint/"
---

My cousin called me yesterday, absolutely raging. "Stanley, I swear MTN has taken my 5GB. I only opened Instagram for ten minutes!" He was ready to fight somebody at their physical office. 

Honestly, we've all been there. You buy a data bundle, do a quick scroll on TikTok, and next thing you know, you're getting that dreaded "You have 10% of your data balance left" SMS. It feels like daylight robbery. 

This week, MTN held a "Data on Trial" stakeholder gig in Lagos to address this exact anger. Alongside pledging a massive N1 trillion for network expansion, they announced plans to launch a "data transparency portal" inside their app before the end of June. They are calling it a "black box" for mobile data, aimed at showing subscribers exactly how their gigabytes are being spent. 

Let’s look at this from a product and engineering perspective, because building something like this is a massive technical and UX challenge.

### How do you actually build a "black box" for data?

As a developer, the first thing I ask when I hear about a "data transparency portal" is: *How is this data being tracked, and where is the computation happening?*

If MTN is doing this client-side (inside the MyMTN app), they have to deal with OS-level restrictions. On Android, you can request permissions to read network stats per app, but it is messy and inconsistent across different device manufacturers. On iOS, Apple’s sandboxing makes tracking other apps' data usage nearly impossible for a third-party app without enterprise-level MDM profiles, which regular users won't install.

![Coding on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

This means MTN has to do the heavy lifting at the network level. 

Every packet of data you send or receive passes through their core network gateways. But here is the catch: almost all modern internet traffic is encrypted via HTTPS or TLS. MTN cannot see *what* you are doing inside an app. They can't read your WhatsApp messages or see which specific video you are watching on TikTok. 

What they *can* do is inspect the destination IP addresses and domain names (via DNS requests). They can see that your device pulled 500MB from a Meta-owned IP range or a Google video delivery server. 

Mapping those massive, encrypted traffic streams into a user-friendly pie chart that says "Instagram: 1.2GB" in real-time requires serious engineering. It means processing petabytes of network logs, matching them to individual subscriber sessions, and serving that data back via an API without lagging their system.

### The silent killers: Auto-scaling and background sync

During the forum, MTN’s CEO Karl Toriola shared a story about an executive who complained about fast depletion, only to discover a 150GB WhatsApp backup running in the background every single night. 

This is the hard truth most consumers don’t want to hear: modern software is hungry, and 5G makes it ravenous. 

When you are on a fast 4G or 5G connection, video streaming apps like YouTube, Netflix, and Instagram don't just load your video faster; they load it at a much higher quality. The app's player detects a high-bandwidth connection and automatically scales the video resolution from a modest 480p to 1080p or even 4K. 

You think you are watching the same 10-minute comedy skit, but because of the auto-scale, you have just consumed five times more data. When "Sapa" is breathing down your neck, you don't need 4K resolution on a 6.1-inch phone screen. You need 360p and peace of mind.

![Data charts on screen](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

I remember working from a small hub in Akure a few months ago. The fiber line went down, so I connected my laptop to my mobile router. Within two hours, my monthly data was wiped. I was ready to curse out the network provider until I checked my Mac's activity monitor. A background Creative Cloud update had quietly downloaded 8GB of files without warning me. 

### The UX hurdle: Will people actually use it?

If MTN wants this portal to actually stop the complaints, the user experience must be frictionless. 

If I have to open the MyMTN app, wait 15 seconds for a splash screen to load, close three annoying pop-up ads for caller tunes, and then navigate through four nested menus just to see why my data went flat, I won't bother. I will just go back to shouting on X (formerly Twitter).

It needs to be a lightweight, immediate experience. Even better, it should be proactive. Imagine getting a push notification saying: *"Hey, your phone downloaded a 1.2GB system update in the background over your mobile data today. Tap here to turn off background updates."* That is actual utility.

We have a "no gree for anybody" mindset in Nigeria when it comes to our money, and rightly so. The trust gap between telcos and consumers is incredibly wide. 

I am skeptical about whether a simple dashboard will completely solve this trust crisis, but as a builder, I love seeing a massive corporation try to solve a PR problem with actual engineering and product design instead of just releasing boring press statements. 

Let’s see how they execute the launch by the end of the month. I'll definitely be checking the app to see if the tech matches the hype.