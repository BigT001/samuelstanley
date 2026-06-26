---
title: "The Infinite Scroll is Killing Our Attention (And We Coded It)"
date: "2026-06-26T08:48:38.547Z"
excerpt: "We spend our days building slick user experiences designed to grab attention. But after tracking my own screen time during a cold week in Jos, I realized we might be too good at our jobs."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://h2g6j3q2.delivery.rocketcdn.me/wp-content/uploads/2026/06/IMG_9229.jpeg"
readTime: "4 min read"
sourceUrl: "https://www.techcityng.com/smartphone-addiction-signs-2026/"
---

My fingers were freezing during a rainy morning in Jos last week. Before I even fully opened my eyes to check if the power was back so I could charge my laptop, my thumb had already unlocked my phone, bypassed three urgent Slack notifications, and opened a social media app. 

There was no new message. No emergency. Just pure, muscle-memory reflex. 

As developers, we like to think we are in control of the technology we build. We talk about systems architecture, clean code, and database optimization. But lately, I’ve been thinking about the monster we’ve created on the frontend. A recent piece on TechCity about smartphone habits in 2026 got me thinking: what we call "problematic phone use" is actually just us doing our jobs too well. We built these loops.

![Working on the next layout](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### We Engineered the Twitch

The TechCity analysis points out that one of the first signs of a bad relationship with your phone is automatic behavior—unlocking the device and opening apps without even realizing why you did it. 

As a product builder, this isn't an accident. It's the goal. 

When we design a mobile app, we talk about "frictionless design." We want to reduce the cognitive load it takes for a user to do something. But in doing so, we’ve also removed the friction required to *stop* doing something. 

Take the "pull-to-refresh" gesture. From a technical standpoint, it's just a listener triggering an API call to fetch the latest JSON payload. But from a psychological standpoint, it’s a slot machine. You pull the lever, wait for the loading spinner to animate, and pray for a hit of dopamine in the form of a new post or a like. 

Even the way we implement lazy loading and infinite scroll. We tell ourselves we’re optimizing performance by not loading the entire database at once. But we’re also making sure the user never hits a natural stopping point. There is no "footer" on modern apps. The page never ends.

### The Onitsha Merchant Test

A few months ago, I was in a noisy market in Onitsha, watching a merchant use a inventory app I helped consult on. Between attending to customers, arguing with supply drivers, and dealing with the chaotic heat, he was constantly checking his phone. 

He wasn't checking his sales ledger. He was checking WhatsApp status updates and short-form videos. 

The TechCity article mentions "attention fragmentation"—how constantly switching between tasks reduces our ability to do deep work. In Nigeria, this hustle is already fragmented enough. We are constantly navigating bad network signals, fluctuating fuel prices, and sudden power cuts. When you add an app that is actively trying to hijack your brain every thirty seconds, focus becomes an luxury.

![Behind the screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

We build apps to keep daily active users (DAUs) high because that’s the metric investors care about when you’re pitching your startup. If a user opens the app, does their business in two minutes, and leaves, our analytics dashboard says we are failing. But maybe that user is actually winning. 

### Can We Code for Friction?

Maybe it’s time to start building apps that respect the user's time instead of trying to colonize it. 

What if we designed notification systems that batch updates instead of sending them in real-time? What if we built "speed bumps" into our interfaces that ask, *“You’ve been scrolling for twenty minutes, do you want to keep going?”* 

Right now, if you pitch an app with those features to a growth hacker, they’ll laugh you out of the Gbagada co-working space. They’ll tell you you’re killing your retention curve.

But if our users are ending up stressed, sleep-deprived, and unable to focus on their real-world hustles because of the digital loops we engineered, then our tech stack isn't actually solving problems. It's just creating new ones.

I'm going to start by looking at my own active projects. Maybe that push notification doesn't need to be sent at 10 PM. Maybe we don't need to auto-play the next video. Let's build things that serve people, not things that keep them staring at a glowing screen in the dark.