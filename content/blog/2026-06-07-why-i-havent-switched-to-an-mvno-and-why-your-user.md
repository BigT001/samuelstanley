---
title: "Why I Haven't Switched to an MVNO (And Why Your Users Won't Either)"
date: "2026-06-07T20:18:02.420Z"
excerpt: "Nigeria licensed 46 virtual telcos to crash data prices, but nobody is signing up. Here is why the onboarding UX and integration bottlenecks are killing the dream before it even boots."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/06/Internet-Users-1.jpg"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/06/05/why-nigerias-mvno-dream-is-struggling-to-connect/"
---

My terminal is currently throwing a timeout error because my primary MTN MiFi decided to take a sudden nap. I'm sitting here in a Gbagada workspace, sweating slightly through a power cut, swapping SIM cards like a retro gamer changing cartridges. 

You would think that with 46 newly licensed Mobile Virtual Network Operators (MVNOs) in Nigeria, guys like me would have a reliable, high-speed backup that actually works. But we don't. And despite the rising cost of data making everyone's wallet bleed, nobody I know is switching. 

The reality of building products in Nigeria is that the best tech stack in the world will still fail if the onboarding friction is too high. And right now, the MVNO dream is hitting a massive wall of user experience.

### The Great Onboarding Wall

Let’s talk about Ewoma, the PwC audit officer mentioned in the TechCabal piece. She is burning through ₦5,000 every few days just to keep 30 Chrome tabs, cloud spreadsheets, and video calls alive. She’s the prime target for a cheaper, nimbler virtual telco. 

But she won't switch. Why? Because the friction of getting a new SIM, dealing with NIN linkage, passing identity verification, and fearing that the network might just go cold when she’s in the middle of a client demo is too high. 

![Developing software with constant connection drops](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

As developers, we know this problem intimately. If you add even one extra step to your signup flow, your conversion rate drops off a cliff. 

In Nigeria, telco onboarding isn't just a digital form. It’s an physical event. You have to find an umbrella stand, sit on a plastic chair, stare into a low-res webcam, and hope the agent’s fingerprint scanner isn't acting up. For a busy professional or a hustler in Onitsha, that is a half-day project. 

Unless these new MVNOs can figure out a way to let me download an eSIM via a clean web app, pay instantly with my Moniepoint or PiggyVest account, and handle KYC inside 60 seconds, they might as well not exist.

### The API Lag and State Management

Then there’s the bizarre case of Vitel Wireless. They launched in late 2025. By March 2026, the NCC’s official subscriber database showed them having practically zero active users—just 17 people who ported over. Meanwhile, Vitel’s COO is claiming they have the fifth-largest subscriber base in the country. 

As a software founder, this mismatch screams one thing to me: legacy data synchronization issues. 

![The data doesn't lie, but the APIs might be lagging](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

We are dealing with a regulatory reporting pipeline that relies on manual, quarterly CSV uploads or archaic database queries. If your state management is that slow, how do you expect to build a dynamic, modern telco? 

If the NCC is querying data that is six months out of date, or if the MVNOs themselves are struggling to sync their user databases with the host networks (like MTN or Airtel), the entire infrastructure is built on shaky ground. It’s hard to build trust when you can’t even get the basic metrics straight.

### We Don't Need More Telcos, We Need Frictionless Integration

I don’t want another plastic SIM card cluttering my desk. What I want is an API that allows me to buy bulk data for my staging servers, or a reliable virtual network that prioritizes routing for my remote team in Akure and Owerri.

If these 46 MVNOs want to survive the brutal Nigerian market—where "Sapa" is real and inflation is eating everyone's disposable income—they need to stop acting like traditional telcos. They cannot compete with MTN’s physical distribution network. MTN has millions of agents; these startups have pitch decks.

The play here has to be pure, frictionless software. 

If I can’t activate your service on my phone while sitting in a traffic jam in Ketu, you have already lost me. We need to "no gree for anybody" when it comes to terrible UX. 

Until these new operators start thinking like software companies rather than legacy infrastructure businesses, they will remain ghost networks—fully licensed, completely funded, and totally empty.