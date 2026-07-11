---
title: "OPay Wants to Put AI in the Pipes: Can We Just Fix Failed Transfers First?"
date: "2026-07-11T20:07:34.498Z"
excerpt: "OPay is pitching AI as the next big thing for African fintech. But as someone who actually writes code, I'm looking past the conference slides to see what this means for real builders and users."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://cdn.businessday.ng/wp-content/uploads/2026/07/IMG-20260710-WA0032.jpg"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/opay-pushes-ai-as-africas-next-financial-inclusion-growth-engine/"
---

My cousin in Akure called me yesterday because a POS merchant held onto her money after a "debit-without-alert" incident. We’ve all been there—standing by a counter, looking like a thief, waiting for a reversal that might take three business days. 

So when I see headlines from the Digital PayExpo in Lagos about OPay pushing AI as the "next growth engine" for financial inclusion, my developer brain immediately goes to the practical plumbing. 

Slide decks talk about "unifying 1.4 billion people." I care about why my API calls are hanging or why the local database replication keeps lagging when transaction volumes spike on a Friday night.

If OPay wants to use AI, they should start by fixing the immediate, day-to-day friction.

### Filtering the Buzzwords

During the keynote, OPay’s COO and CTO, Dotun Adekunle, made a case for shifting from basic digital wallets to "intelligent financial services." He talked about fraud detection, credit scoring, and reducing payment delays. 

Honestly, I can get behind this if we strip away the marketing fluff. 

Fraud in Nigeria is hyper-localized, fast, and incredibly creative. The "Sapa" struggle makes people find exploits in systems faster than any automated QA suite can. If you are a developer building a fintech product here, you know that basic rule-based fraud detection is dead. It blocks innocent users because they received a 50k transfer from a friend, while letting actual bad actors slip through with compromised session tokens.

![An engineering workstation showing data tracking](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

Using machine learning to analyze transaction velocity, device fingerprints, and behavioral biometrics in real-time makes sense. But the execution is where the headache is. 

How do you run these models on low-end Android phones with 2GB of RAM over a shaky MTN or Airtel network in a busy market square? That’s the engineering constraint nobody talks about at Lagos conferences.

### The Real Dev Challenge: Credit Scoring on Dirty Data

The second point OPay raised was using AI to expand credit access for small businesses. Think about a trader in Onitsha Main Market. They don’t have a formal bank statement, clean credit history, or an audited balance sheet. 

To score them, you have to look at "dirty" alternative data. 

We are talking about parsing transactional SMS logs, analyzing airtime top-up frequency, and looking at how often they open their payment apps. 

As a builder, I know that parsing SMS logs on Android is a nightmare of edge cases. Every bank has a different format, and users have custom notification settings. Building a lightweight, on-device machine learning model that can parse this data locally—without draining the user's battery or uploading gigabytes of raw personal data to a centralized server—is a massive technical hurdle. 

If OPay or any other fintech wants to win this space, they need to release robust SDKs that local developers can actually use. Don't just keep the AI in your closed garden. Give us the APIs to run risk assessment on the fly.

![A developer analyzing system performance on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### We Need Infrastructure, Not Just Intelligent Systems

You cannot build an "AI-driven unified digital economy" on top of legacy bank APIs that go down every time there is a heavy downpour in Lagos. 

If the base layer—the actual rails that move money from Bank A to Fintech B—is unstable, no amount of machine learning will magically deliver a transaction in seconds. An intelligent system will only tell you faster that the destination bank's switch is dead. 

We need to see stronger data governance and better interoperability. If we are feeding user behavior data into large language models or risk prediction engines, how are we protecting that data under the Nigeria Data Protection Act (NDPA)? 

As developers, we have a responsibility to build ethical guardrails. We can't just throw user data into a black-box model and hope for the best. 

Let's keep the focus on execution. I want to see OPay and others deploy models that actually reduce failed transactions, automate disputed chargebacks in minutes instead of weeks, and help the average user avoid scams. 

Until then, I'll be at my workstation, debugging my own databases, and hoping my cousin gets her POS reversal before Monday.