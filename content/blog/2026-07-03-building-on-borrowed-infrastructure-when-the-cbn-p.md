---
title: "Building on Borrowed Infrastructure: When the CBN Pulls the Rug"
date: "2026-07-03T20:18:28.149Z"
excerpt: "The CBN just axed 46 microfinance licenses, and a few of our favorite fintechs are caught in the crossfire. Here is what happens when your backend depends on regulatory shifting sand."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://thecondia.com/cdn-cgi/image/format=auto,quality=auto/wp-content/uploads/2026/06/Cardoso-CBN-governor.webp"
readTime: "4 min read"
sourceUrl: "https://thecondia.com/cbn-revokes-licences-nownow-sycamore-ourpass/"
---

My phone buzzed around 7:00 AM yesterday. It wasn't my uptime monitor, but it felt like one. A friend of mine—a backend guy building a neat lending play over in a quiet workspace in Akure—sent a single screenshot. The CBN had swung the hammer again. 46 microfinance bank licenses, gone. Just like that.

And of course, five of them are startup-owned. We are talking about names we know, like Sycamore, OurPass, and NowNow. 

If you've ever tried to build a fintech app in Nigeria, you know the absolute horror of waking up to regulatory updates. One day you're refactoring your codebase to handle high-volume transaction peaks, and the next day, the actual legal pipe carrying your users' money is cut in half.

### The Stack is Only as Strong as the License

When you're building a fintech startup here, you usually have two choices. You either partner with an established bank (which is expensive and painful because their legacy APIs feel like they were written in 1998) or you buy/acquire a microfinance bank (MFB) license to gain direct control of your routing, virtual accounts, and customer deposits. 

![Lines of Code on a Monitor](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

Many founders worked hard to buy these licenses because it gave them autonomy. But running an MFB isn't just about deploying code to AWS and keeping your API latency under 200ms. There are regulatory obligations—capital adequacy ratios, physical branches, constant reporting to the central bank. 

The CBN's reasons for this sweep were simple: insufficient assets to meet liabilities, shutting down operations without approval, and outright inactivity. Essentially, these fintechs might have bought the licenses but failed to run them by the central bank's rulebook. Or perhaps the "Sapa" catching the general economy caught up to their balance sheets.

### What This Means for the Devs on the Ground

Think about the developer team at these companies. You’ve spent months building out a ledger system, integrating KYC pipelines, and perfecting your double-entry accounting database. Now, you have to pivot. And fast.

![Data and Charts on a Laptop screen](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

When a license is revoked, it's not just a legal headache; it's a massive technical fire drill. You have to:
- Route user funds to fallback custodian accounts immediately.
- Update the app's banking rails so users don't get transaction failures when trying to withdraw.
- Handle the massive influx of panicked customer support tickets. 

Imagine sitting in a chaotic workspace in Gbagada, generator humming outside, trying to write migration scripts to move thousands of user accounts to a new infrastructure partner before the general public catches wind and triggers a digital bank run. It's exhausting.

### Building for Resilience

Nigeria's tech space is incredibly resilient. We have this "no gree for anybody" spirit that keeps us building even when the ground is shaking. But this is a stark reminder: you cannot rely on a single point of failure, even if that failure point is a government-issued license.

![Chaos and Hustle in Nigeria](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

If you are building products that touch money in Nigeria, you need to design your architecture for absolute redundancy. If MFB 'A' goes down, your system should automatically fall back to MFB 'B' or a commercial partner within seconds, without needing a full app store redeployment. Hardcoding bank destinations or relying on a single banking rail in 2026 is just begging for a bad week.

The hustle doesn't stop. The devs at Sycamore, OurPass, and NowNow are probably working overtime right now, rewriting their flows, negotiating fallback setups, and trying to salvage their hard work. I respect the grind. But let this be a lesson to the rest of us: write your code, but keep your compliance team close, and your backup APIs closer.