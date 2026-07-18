---
title: "Your EdTech App is Leaking Kid Data, and 'No Gree' Won't Fix It"
date: "2026-07-18T20:05:44.295Z"
excerpt: "Most educational apps built locally are a privacy nightmare waiting to happen. Here is why we need to stop treating children's data like standard user rows."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://h2g6j3q2.delivery.rocketcdn.me/wp-content/uploads/2026/07/IMG_9474.jpeg"
readTime: "4 min read"
sourceUrl: "https://www.techcityng.com/how-to-protect-childrens-data-online-2026/"
---

Last night, I was auditing a database schema for a school management portal built by a junior dev friend of mine in Akure. He was so proud of how fast he whipped it up. But as I scrolled through his PostgreSQL tables, my heart sank. 

Raw student names. Dates of birth. Home addresses. Parents' active phone numbers. Even their report cards—stored as raw, unencrypted PDFs in an AWS S3 bucket with public read access. 

When I pointed it out, his response was typical: "Ah, Stanley, who wants to hack a primary school database?" 

That right there is the problem.

![A developer reviewing database structures on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

We are currently living in a massive boom of local EdTech, online gaming, and digital school trackers. From Lagos to the cold hills of Jos, kids are being handed tablets and laptops to learn, play, and connect. But as builders, we are treating children's data with the same careless "ship fast and break things" attitude we use for standard social apps. 

The Sapa Rush and Lazy Permissions

Let’s talk about why this happens. It's usually the "Sapa" rush. Founders are desperate to get an MVP out to pitch to investors or school boards. To save time, developers copy-paste boilerplate code, use default Firebase configurations without writing strict security rules, and request every device permission under the sun.

Does a simple spelling bee app really need access to a child’s precise GPS location? Why does an offline math game require background microphone access? 

When we build like this, we create massive backdoors. If an adult's account gets hacked, they can change their password or freeze their card. If a child’s digital footprint—including biometric data, school route, and voice recordings—is stolen, that identity can be cloned before they even finish secondary school.

![The vibrant but chaotic energy of Nigerian streets where kids are growing up digital](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

The Danger of "Sharenting" in Nigeria

It’s not just the developers; parents are also leaving the gates wide open. We love celebrating our wins. If a child graduates from nursery school, the photos immediately go up on WhatsApp Status, Facebook, and Instagram. 

But look closer at those photos. The school badge is clearly visible on the uniform. The location tag says "Gbagada." The caption mentions the child’s full name and age. 

To a bad actor, that isn’t just a cute photo. It is a complete profile. They know where the child goes to school, what time they close, what their parents' names are, and how to track them. It’s a social engineering goldmine, and we are handing it over for free.

How We Fix the Leak

If we want to build a safe ecosystem for the next generation, we have to change how we write our code. "No gree for anybody" shouldn't just be a slogan; it should be our attitude toward lazy security.

First, trim your manifest files. If your app doesn’t absolutely need the camera, microphone, or location API to run its core loop, strip those permissions out. 

Second, encrypt PII (Personally Identifiable Information) at rest. No child's name or parent's phone number should sit as plain text in your database. 

Finally, if you are a parent, audit your home devices today. Go into the settings of that cheap Android tablet you bought at the market in Onitsha or the smart toy you ordered online. Turn off location sharing. Set up two-factor authentication on every family account. 

We cannot afford to keep treating cybersecurity as an afterthought. Let’s build products that actually protect the kids who use them. No shortcuts.