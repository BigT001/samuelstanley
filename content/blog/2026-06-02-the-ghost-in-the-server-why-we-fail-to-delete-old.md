---
title: "The Ghost in the Server: Why We Fail to Delete Old Databases"
date: "2026-06-02T14:00:38.057Z"
excerpt: "The Pick n Pay breach is a painful reminder of what happens when we rewrite our apps but leave the old databases rotting on forgotten servers."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/06/2000x1335.webp"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/06/01/pick-n-pay-cyberbreach/"
---

Nothing gives me a cold sweat quite like remembering a random staging server I spun up three years ago during a late-night coding sprint. You know that feeling? You are surviving on cold coffee, trying to hit a tight launch deadline, and you spin up a quick MongoDB instance on a cheap VPS to test some features. You deploy, the client is happy, the product eventually evolves, you build a completely new app... and you completely forget about that old database.

That is exactly what just bit South African retail giant Pick n Pay. 

Their old on-demand delivery app, Bottles (which later became Asap!), was retired back in 2022. But last week, hackers got into the data. We are not talking about some super-sophisticated, state-sponsored cyber heist here. This is a classic case of "we turned off the frontend, but forgot the backend database still existed."

![A laptop open with lines of code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

The customer records—names, delivery addresses, phone numbers, and partial card details—were just sitting there on an old, unpatched server. It had no modern protection mechanisms. It was basically a digital sitting duck.

As developers, we love the thrill of building. We want to write clean NestJS code, set up beautiful CI/CD pipelines, and play with the latest frameworks. But nobody wants to do the boring work of decommissioning. Nobody wants to write the migration script that securely wipes old user data or archives it offline. 

### The "No Gree" Mentality vs. Lazy Security

Here in Nigeria, we have this massive "no gree for anybody" hustle. We build fast, and we pivot even faster. If a startup idea isn't working, we trash the frontend, buy a new domain, and launch the next thing. But what happens to the database of the old venture?

Think about the dozens of delivery and fintech MVPs that popped up in Gbagada, Akure, or Owerri over the last five years. Many of them have quietly folded or shifted focus to stay afloat. But I can bet a good chunk of my savings that hundreds of those old databases are still live on AWS, Heroku, or Render. They are holding real names, real phone numbers, and real home addresses of everyday people who just wanted to buy groceries or send money during the cash crunch.

![Lines of code on a screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

We often think cybersecurity is about buying expensive enterprise firewalls or hiring fancy external consultants. It isn't. Sometimes, it is just about basic hygiene. If you don't need the data anymore, delete it. If the platform is retired, kill the infrastructure. 

### Clean Up Your Digital Workspace

It is easy to blame the developers who worked on Bottles back in 2021, but this is a governance issue. When we change architectures, we need a strict decommissioning checklist. 

Whenever I am wrapping up a legacy system transition now, I try to follow three simple rules:

1. Export historical data to encrypted, offline cold storage if it is legally required for auditing. 
2. Actually run the delete command on the production database. Don't just pause the virtual machine. Delete the entire volume.
3. Revoke all API keys, database credentials, and IAM roles associated with the old service.

Let’s stop leaving our digital trash lying around. The next time you are winding down for the weekend, take an hour to audit your cloud console. Find those old, dusty databases and delete them. Your future self—and your customers—will thank you for it.