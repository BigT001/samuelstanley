---
title: "The 'No Gree' Feature: Why We Must Track When Users Ignore Our Code"
date: "2026-07-18T07:25:58.708Z"
excerpt: "We spend weeks building 'smart' recommendation engines only for users to ignore them. But if you aren't logging the override, you're flying blind."
category: "Tech"
tags: ["Tech", "Innovation", "Digital"]
image: "https://hackernoon.imgix.net/images/WjJBhy784Afze5ooA22Tqi6wRIT2-5u03cxf.png"
readTime: "4 min read"
sourceUrl: "https://hackernoon.com/the-override-problem-what-happens-after-your-system-makes-a-recommendation?source=rss"
---

I was staring at a database schema for an inventory tool I helped build for a merchant in Onitsha, and it hit me how stupidly blind my code actually is. 

We had built this beautiful, shiny predictive engine. It was supposed to look at sales data, calculate run rates, and tell the business owner exactly when to restock spare parts. The algorithm was clean. The logic was solid. 

But when I checked the actual database activity, half the time the owner ignored the "Restock Now" alerts entirely. Or worse, they would order triple what the system recommended because they had a "feeling" about a market surge. 

And my system? It just sat there, completely oblivious. It issued its recommendations into a black hole, never knowing if the human was right or if its own model was trash.

![Debugging in the zone](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Void Between the Recommendation and the Reality

This is what Satish Saka calls "The Override Problem." It’s that massive, silent gap in decision-support systems. We design software to tell users what to do—whether it's budget scaling on Meta ads, credit risk profiling for loans, or inventory control—but we forget to build the loop that asks: *Did they listen? And if they didn't, what happened?*

In Nigeria, this is amplified by a hundred. We have a deeply ingrained "No gree for anybody" mindset. Our users are highly intuitive, street-smart, and often survival-driven. If you build a fintech app that tells a micro-merchant in Owerri to reject a customer's credit because of a poor system score, but that merchant has known the customer's family for ten years, they *will* override your system. They will hand over the goods.

If your platform doesn't log that override, you lose two things:

First, you can't tell if your system is actually miscalibrated. Maybe your credit score threshold is too rigid for the local informal economy. If 70% of your users override a "High Risk" warning and those transactions still settle successfully, your algorithm is wrong, not the users.

Second, you can't show the user their own bias. If a logistics coordinator at a cold-room hub in Jos consistently overrides your automated route recommendation because they think they know a faster shortcut, but they keep getting stuck in traffic, you need the data to show them: *“Hey, your overrides are costing you three extra hours per trip.”* 

Without tracking the override, you can't do either.

### How I'm Changing My Approach to Database Design

After sitting with this realization, I realized we need to stop designing database schemas that only look at the "happy path" of system execution. 

Whenever we build any feature that outputs a "recommendation" or an "automated decision," we have to treat the human response as a core data entity. 

![Data analysis and tracking outcomes](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

I’ve started thinking about this in three layers:

1. **The Intent Log**: Every time the system generates a recommendation, write it to a table with a unique ID, the confidence score, the suggested action, and the underlying data snapshots.
2. **The Decision Hook**: When the user acts, capture whether they accepted, modified, or completely rejected the recommendation. If they rejected it, force a quick, low-friction reason select-box (e.g., "Price too high", "Personal trust", "Route block").
3. **The Outcome Reconciliation**: This is the hardest part. You need a background job or worker that checks back in after a set period (days or weeks) to see the actual outcome of that decision. Did the loan default? Did the ad campaign ROI drop? Did the stock spoil?

### Building for the Real World, Not the Sandbox

It is easy to sit in a quiet workspace in Gbagada, code up a clean machine learning model on a clean dataset, and feel like a genius. But the moment your code hits the streets, reality hits it back. 

People override software because life is messy, offline networks are complex, and sometimes a human really does know something a machine doesn't. 

If we want to build products that actually survive the Nigerian market, we have to respect the user's agency. We shouldn't block them from overriding our systems, but we absolutely must start tracking what happens when they do. Otherwise, we are just building very expensive, very deaf calculators.