---
title: "The Code Behind the Shame: How We Built a Digital Loan Trap"
date: "2026-08-16T14:26:36.745Z"
excerpt: "We need to talk about what happens when you write an Android app that requests `READ_CONTACTS` for a ₦30,000 microloan. It's not just bad ethics—it's weaponized software architecture."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://h2g6j3q2.delivery.rocketcdn.me/wp-content/uploads/2026/08/CHINEDU_1.1.1-1.jpg"
readTime: "5 min read"
sourceUrl: "https://www.techcityng.com/the-hidden-price-of-free-big-tech-data-double-standard/"
---

A few years ago, someone reached out to me on LinkedIn offering decent money to help patch together the backend for a quick-turnaround Android lending app. The brief was simple enough on the surface, but five minutes into reviewing the spec document, my stomach dropped. 

Right under the KYC requirements was a clear instruction: *Sync user's entire address book to MongoDB before disbursement. If default hits day 3, queue automated SMS to top 20 frequent contacts.*

I turned it down immediately. But plenty of engineers didn't.

Every time I hear another story like Chinedu’s—getting hounded and having his mother called a fraudster over a ₦36,000 balance—I don't just think about greedy loan sharks. I think about the codebase that made it possible.

![Lines of Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### The Geolocation Double Standard

There's an open secret in product design: companies treat African users like second-class citizens in the codebase. 

TechCity recently ran a teardown showing how big tech platforms serve clean, plain-language privacy toggles to IP addresses in New York, while serving buried, opted-in-by-default tracking switches to users in Lagos. 

As developers, we know this isn't accidental. Nobody accidentally writes an `if (user.ipCountry === 'NG')` block that hides ad tracking controls behind three extra nested `div`s. It is deliberate UI malice. 

When European regulators slap fines on platforms, engineers spend sprint cycles refactoring consent flows and sanitizing telemetry endpoints for EU traffic. But for our market? The default stance is still "extract as much telemetry as the device allows before the OS blocks it." 

We've normalized stripping out user autonomy because we assume nobody with regulatory teeth is inspecting the network tab.

### The Anatomy of predatory permissions

Let’s look at what these micro-lending APKs actually do on a budget Android device. 

When you install a predatory loan app, the onboarding flow is engineered to overwhelm. A user sitting in a crowded bus park in Owerri or rushing through an emergency in an Akure hospital doesn't have time to audit run-time permissions. They just smash "Allow" to get past the gate.

```
<uses-permission android:name="android.permission.READ_CONTACTS" />
<uses-permission android:name="android.permission.READ_SMS" />
<uses-permission android:name="android.permission.ACCESS_FINE_LOCATION" />
<uses-permission android:name="android.permission.READ_CALL_LOG" />
```

Under the guise of "fraud prevention" and "credit scoring," the app dumps the entire contact list, parses bank alert SMS messages to calculate cash flow, and tracks cell tower location. 

![Data and Finance](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

If the borrower misses a payment by 48 hours, the system doesn't trigger a risk assessment review. It triggers a background worker. A simple Python script or Node worker queries the dumped contact payload, grabs numbers labeled "Mum", "Pastor", or "Boss", and fires off formatted shaming templates via bulk SMS gateways. 

That is not financial inclusion. That is extortion automated through an API.

### Sapa is Not an Excuse for Dark Patterns

I get it: surviving as a developer or small studio in Nigeria is tough. *Sapa* is real, electricity bills at your Gbagada workstation keep climbing, and when a client shows up with a fat budget to build a fintech app, it's tempting to look the other way on product requirements.

We tell ourselves, *"I'm just the dev, I don't run the recovery team."* 

Except code isn't neutral. If you write the endpoint that exposes a mother's phone number because her son missed a payment deadline, you are part of the pipeline that humiliated her.

The FCCPC recovering ₦10 billion and the NDPC chasing hundreds of predatory platforms is a start, but regulation always lags behind deployment. Google clamping down on Play Store permissions helped, but sideloaded APKs and shady SDKs still circulate in every corner of the country.

As people who build software, we have to draw our own lines. If an app requires you to turn a user’s social circle into collateral for pocket money, delete the repo and walk away. Building ethical tech isn't something we can wait for foreign regulators or local task forces to enforce on us—it starts right at the keyboard.