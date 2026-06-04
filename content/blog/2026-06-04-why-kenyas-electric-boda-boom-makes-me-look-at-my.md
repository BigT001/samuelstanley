---
title: "Why Kenya’s Electric Boda Boom Makes Me Look at My Generator with Anger"
date: "2026-06-04T16:55:59.574Z"
excerpt: "Kenya is doubling down on electric bikes while we are here wrestling with petrol prices. Let's talk about actual infrastructure, Amazon's play in SA, and the reality of the Nigerian builder's grind."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/06/Uber-Electric-Boda.jpeg"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/06/04/techcabal-daily-uber-charged-for-kenya/"
---

I spent the better part of yesterday afternoon debugging a stubborn memory leak in our backend, only for the Gbagada power grid to do its usual trick. Blackout. As my inverter gave that familiar, depressing beep to warn me it was running on fumes, I looked out the window and wondered how much fuel was left in the generator. 

It is exhausting. 

So you can imagine my expression when I opened up the news and saw that Uber is doubling its electric motorcycle fleet in Kenya. By the end of this year, they are scaling up big time because their electric bodas cut operating costs for riders by up to 35%. 

As a developer, I am obsessed with optimization. If you tell me you can refactor a database query to slash server response times by 35%, I will buy you a cold bottle of Star. That is exactly what Kenya is doing on a macro level with their transport system. Over 35,000 registered EVs, mostly two-wheelers, and their national grid is actually smiling because motorcycle charging brought in nearly $3 million in revenue for Kenya Power.

![A busy street in Nigeria showing the daily hustle and transport challenges](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

### The Infrastructure Layer Always Wins

We love to talk about building slick apps, but the physical layer of the stack always wins. In Kenya, the government and utility companies got their act together to support EV charging. 

If you try to run an electric bike startup in Nigeria right now, your biggest blocker isn't the software or the hardware—it's the power grid. You can't run a commercial EV swap station on a diesel generator; the unit economics would fall apart faster than a poorly written Javascript framework. We have to solve the basic utility layer before we can dream of the kind of clean energy transition Nairobi is pulling off. 

It makes me think about how we build software locally. We always have to build redundant systems because the default environment is hostile. If you’re building a fintech app, you don’t just integrate one payment gateway; you write fallback logic for three of them because one is bound to fail when a user in a chaotic bus park in Owerri is trying to pay for dinner.

### Amazon Prime in SA vs. The Smartphone Squeeze

Meanwhile, down south, Amazon Prime just launched in South Africa for about $3.6 a month. Same-day or next-day delivery, Prime Video, and cloud gaming. 

I look at that and then I look at our own reality. The same TechCabal newsletter pointed out that smartphones are going to cost Nigerians even more. Think about the friction that creates. 

![A developer working late at night on a laptop, optimizing code for low-end devices](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

When we sit down to design user interfaces, we have to optimize for the cheap, entry-level Android devices that our target market can actually afford. "Sapa" is a real design constraint. If your app requires 4GB of RAM and a high-end processor to render smoothly, you have already locked out half of the country. We have to write lightweight, offline-first code that doesn't eat up expensive data plans. 

### No Gree for Anybody

It's not all doom and gloom, though. You have to respect the hustle of the people still building here despite the macro-economic madness. 

Look at Cowrywise. In a market where keeping top engineering talent is like trying to hold water in a sieve, they promoted eleven people to Associate Vice President positions. That is how you fight the "Japa" wave. You don't just pay people; you give them real ownership and a clear path to growth so they don't pack their bags for Amsterdam or London the moment a recruiter slides into their LinkedIn DMs.

Building here is hard, but we don't really have a choice but to keep shipping. Whether you are writing code in a quiet co-working space in Akure or trying to scale a logistics business through the traffic in Gbagada, the mindset remains the same: "No gree for anybody."

Let me go back to my code. The generator needs a top-up, and this memory leak isn't going to fix itself.