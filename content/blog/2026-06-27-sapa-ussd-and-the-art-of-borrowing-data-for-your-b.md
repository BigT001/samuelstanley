---
title: "Sapa, USSD, and the Art of Borrowing Data for Your Babe"
date: "2026-06-27T11:25:53.442Z"
excerpt: "Glo just upgraded their *303# menu to let you borrow data for other people. Behind the scenes, it's a masterclass in building micro-credit systems for the real Nigeria."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://cdn.businessday.ng/2021/08/Globacom.jpg"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/glo-turns-airtime-lending-into-customer-retention-strategy-with-new-borrowing-features/"
---

Sapa is the ultimate product manager in Nigeria. If you are building anything for this market and you don't account for the days when your user’s bank account is looking back at them with single digits, your churn rate will tell you shege. 

That is why Glo’s latest update to their "Borrow Me Credit" service (*303#) caught my attention. They aren't just letting people borrow N50 airtime anymore. They’ve expanded the service to allow subscribers to borrow "Special Data" and, more interestingly, borrow airtime or data for other people. 

As a developer, I’m not looking at this from a corporate PR perspective. I’m thinking about the architecture, the edge cases, and the sheer engineering heavy lifting required to make this run smoothly across millions of old-school SIM cards.

![Coding on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Real-Time Credit Scoring Nightmare

Let’s talk about the backend. Glo says your eligibility isn't fixed; it depends on your usage profile and how active you are on the network. That means they are running a dynamic risk-profiling engine. 

For a fintech startup, doing credit scoring with a modern mobile app is relatively straightforward. You have device data, bank statement scraping, and fancy APIs. But Glo has to do this over USSD. 

Imagine sitting in a noisy bus park in Owerri, trying to borrow N1,000 data because your main subscription ran out mid-journey. You dial *303#. That USSD gateway has a strict timeout limit—usually about 15 to 20 seconds before the session drops. 

Within those few seconds, the billing engine has to query a database containing tens of millions of active profiles, check your average monthly recharge frequency, calculate your risk score, determine if you have an outstanding loan, and spit back a customized menu of borrowing options ranging from N25 to N4,000. 

If that query takes too long, the session times out, the user gets frustrated, and they switch to their second SIM. Keeping that database read-latency low enough to survive the Nigerian telecommunications grid is a massive win for their database administrators.

### The "Borrow for a Friend" Edge Cases

The feature that really intrigues me is the ability to borrow airtime or data for someone else. 

If you’ve ever built a peer-to-peer system, you know that adding a third party to a transaction opens up a whole new village of bugs. 

Let's look at the logical flow. User A wants to borrow data for User B. 

First, the system has to authenticate User A’s creditworthiness. Next, it has to validate User B’s number. Is User B also on Glo? Are they active? What if User B has blocked third-party transfers? 

Then comes the real headache: debt recovery. When User A finally recharges, the billing engine has to sweep the account to recover the loaned amount plus the service charge. But what happens if User B was the one who actually consumed the value, and User A decides to dump the SIM? 

Implementing these rules inside a legacy telecom billing system (likely running on massive, rigid enterprise software) requires some seriously creative integration work. I can almost picture the developers in their Lagos offices, drinking cold coffee and arguing about database locking mechanisms to prevent double-spending during peak hours.

![Managing data and transactions](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

### Designing for Low-Trust, High-Survival Environments

We often talk about building "frictionless" experiences, but in Nigeria, friction is sometimes a feature. Glo limiting the loan amounts based on usage is a smart way to manage bad debt without needing a BVN or a credit bureau check. They are using airtime history as a proxy for trust.

Whether you are pushing code from a quiet shared workspace in Akure or trying to scale a logistics platform in Onitsha, the lesson here is the same: meet the user where they are. 

Sometimes, the best customer retention strategy isn't a shiny new UI or a referral program. It is simply being there to catch them with a micro-loan when they are stuck in a tight spot at 11:00 PM on a Tuesday.