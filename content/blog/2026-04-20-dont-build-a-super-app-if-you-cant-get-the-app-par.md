---
title: "Don’t Build a ‘Super App’ if You Can’t Get the ‘App’ Part Right"
date: "2026-04-20T07:49:45.329Z"
excerpt: "Safaricom’s My OneApp rollout is a masterclass in how to alienate your most loyal users by ignoring how they actually live. Technical arrogance is a silent killer."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/04/myone-app-launch-tap.webp"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/04/20/next-wave-safaricoms-biggest-threat-is-not-airtel-but-its-own-product-choices/"
---

I spent the better part of yesterday morning wrestling with a nasty API integration that refused to play nice with our auth flow. But honestly, my frustration was nothing compared to what M-PESA users are dealing with right now. Safaricom just proved that even the biggest players can trip over their own feet if they forget who is actually using their software.

The My OneApp rollout is a disaster. It’s what happens when "security-first" thinking completely ignores "human-first" reality.

### The SIM-Binding Nightmare

As a dev, I get the logic behind SIM binding. You want to tie the app to the physical hardware to stop fraud. It sounds great on a whiteboard in a posh Nairobi office. But in the real world—especially here in Africa—it’s a UX nightmare. 

Most of us "no gree for anybody" when it comes to data costs. We swap SIMs. We use one for calls and another for cheap data. By forcing users to be on Safaricom mobile data just to log in, the engineering team essentially locked out everyone who wasn't currently using a Safaricom data sub. 

Imagine sitting in a quiet workstation in Gbagada or a cold morning in Jos, trying to send money to your mom, and the app tells you that you’re a stranger because your data is currently running on an MTN sub. It’s a classic case of over-engineering a solution that breaks the primary utility of the product.

![A desk with a laptop and lines of code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Ignoring the Hustle

The diaspora situation is even wilder. We have Kenyans all over the world—just like our own brothers and sisters in the UK or US—who rely on these apps to manage life back home. Forcing a forced update that logs them out and then demands they connect via a Safaricom roaming partner just to get back in? That’s not just a bug; that’s a failure of empathy. 

When you tell a customer they are a "financial non-person" because they crossed a border, you aren't just losing a user; you're killing your brand promise. Sapa is real, and people can’t be spending thousands on international roaming just to open a fintech app.

![Street scene in Nigeria showing the daily hustle](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

### Why This Matters for Us

We talk a lot about "Super Apps" in the ecosystem, but Safaricom’s slip-up shows that the bigger you get, the easier it is to lose touch. Airtel Money is already eating into their market share, jumping from 2.9% to 11%. That’s a massive signal. 

When we build products for the Nigerian market, we have to account for the "dual-SIM juggle." We have to account for the fact that power might go out, data might be spotty, and users will always find the path of least resistance. If your "secure" app requires me to restart my phone and swap physical cards three times just to check my balance, I’m moving my money elsewhere.

### Execution Over Everything

Safaricom had a 97% market share at one point. Now they’re bleeding because they chose a forced migration instead of a slow, opt-in rollout. They forgot that M-PESA isn't just an app; it's a utility, like water or electricity. You don't just "update" the pipes and leave half the city thirsty because they didn't have the "right" faucet.

If there’s one thing I’ve learned from building products in this climate, it’s that you can’t code your way out of a bad user experience. You have to understand how the person on the street in Akure or Owerri is actually holding their phone. 

We need to stop building for the users we wish we had and start building for the ones we actually have. Otherwise, we’re just writing pretty code for an empty room.