---
title: "Stop Over-Engineering Your Side Projects: Lessons from a Weekend MVP"
date: "2026-06-21T12:09:34.463Z"
excerpt: "My generator is humming in the background while I look at another bloated codebase. Here is why inDrive's latest internal tool win is a wake-up call for devs who build too much too soon."
category: "Tech"
tags: ["Tech", "Innovation", "Digital"]
image: "https://hackernoon.imgix.net/images/hackernoon_newsletter_375_ia8exbzjf5oihwbtnjgcvlr4.png"
readTime: "4 min read"
sourceUrl: "https://hackernoon.com/6-20-2026-techbeat?source=rss"
---

My generator is currently humming outside my window here in Gbagada, and I am staring at a Figma file that makes me want to pull my hair out. 

If you have ever had to build a product that needs to look exactly the same on a web browser, an Android screen, and an iPhone, you know the quiet misery of design handoffs. You spend half your day copying hex codes and font sizes, manually typing them into different CSS, XML, or Swift files. It is tedious, repetitive, and frankly, a waste of brainpower. 

So when I caught wind of how the engineering team at inDrive tackled this exact mess, it hit a nerve. They did not spin up a six-month committee or draft a massive architecture document. One engineer literally sat down over a weekend and built a hacky MVP to export design tokens across different platforms. Now, that weekend project is their official, company-wide tool.

There is a massive lesson here for those of us trying to build software in Nigeria, where we often feel the pressure to over-engineer everything just to prove we know what we are doing.

## The Tyranny of "Enterprise" Thinking

We have this bad habit in our local tech ecosystem. Maybe it is the "no gree for anybody" mindset, or maybe we are just trying to impress global recruiters. We get a simple app idea—say, a tool to help traders in Onitsha track their daily inventory—and immediately start talking about Kubernetes clusters, microservices, and multi-region database replication. 

We write clean architecture that takes three weeks to set up before we even paint a single button on the screen. By the time we are ready to deploy, Sapa has hit, fuel prices have doubled, and we have run out of steam.

![The raw beauty of just writing code without the noise](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

The inDrive team showed how things actually get done. They had a problem: designers changed a shade of yellow in Figma, and devs had to manually update it across three different platforms. Instead of building a complex system, the developer wrote a simple parser. It took the design values, turned them into JSON, and spat out the platform-specific files. 

It was probably ugly on day one. It probably had hardcoded paths and zero test coverage. But it worked. 

## Code for the Environment You Live In

When you are writing code in a cozy office in San Francisco with constant power and unlimited fiber internet, you can afford to run heavy pipelines for everything. But if you are debugging on a cold morning in Jos, or relying on a sketchy MTN hotspot in Akure, speed and simplicity are your best friends. 

Your tools should reflect that. A weekend script that automates a painful task is worth ten half-baked, over-designed microservices that you never finish. 

![Testing UI layouts across devices on a messy desk](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

If you can write a node script that parses your Figma design variables into simple export files, you do not need an external SaaS subscription. You do not need to configure an elaborate API. You just need something that runs locally, saves you two hours of manual copying, and lets you close your laptop before NEPA takes the light.

## Keep the MVP Ugly, Keep it Functional

The next time you sit down to build a tool or a side project, try to challenge yourself. What is the absolute bare minimum version of this that actually solves the pain point? 

If you are building a delivery tracker, do you need real-time map plotting on day one, or do you just need an automated SMS that triggers when a status changes in your database? If you are building a fintech prototype, do you need three different payment gateways integrated, or just one manual transfer verification flow that you handle yourself?

The magic of the inDrive design token tool was not that it was perfect; it was that it was present. It existed. It solved a real, annoying problem on a Monday morning because someone chose to build a scrappy tool on Saturday instead of dreaming about a perfect system they would never have time to finish.

Let us stop building monuments to our own engineering egos. Build the scrappy script. Write the ugly code. If it works, you can always make it pretty later. Now, if you will excuse me, I have some design variables to automate before my generator runs out of petrol.