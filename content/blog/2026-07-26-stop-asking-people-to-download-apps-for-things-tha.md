---
title: "Stop asking people to download apps for things that should be a chat message"
date: "2026-07-26T20:14:00.139Z"
excerpt: "Nobody wants to install a 50MB mobile app just to buy a pair of sneakers from an Instagram vendor. Sentinel Escrow's new WhatsApp tool gets this right."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://techpoint.africa/wp-content/uploads/2026/07/ff-b1a98d29e3614b01574f435e13a46421-ff-sentibud-by-snt-1024x511.png"
readTime: "4 min read"
sourceUrl: "https://techpoint.africa/brandpress/sentibud-launches-whatsapp-integrated-escrow-service/"
---

If you’ve ever tried buying a camera lens from a seller on Instagram or sourcing hardware parts from a vendor down in Onitsha, you know the exact point where the conversation dies. 

It’s that awkward standoff. The vendor wants money before sending the waybill. You want to see the package in your hands before releasing a single Naira because everyone has a "what I ordered vs what I got" horror story. Pay on delivery hurts the vendor when buyers ghost the dispatch rider; paying upfront leaves the buyer exposed. 

Sentinel Escrow just launched SentiBud to try and fix this, and honestly, the product direction is what caught my eye more than the fintech aspect itself.

![Coding on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The App Store graveyard

As developers, our first instinct when solving a problem is usually to build a fresh, shiny React Native or Flutter app. We design custom onboarding screens, wire up auth flows, add push notifications, and push it to the stores. 

Then reality hits: nobody downloads it. 

I’ve seen this happen endlessly. The average phone out here is fighting for storage space between system updates, offline music, and WhatsApp media backups. Asking a buyer or a small-scale seller to drop everything, open the Play Store, download a 45MB app, verify an email, enter a BVN, and log back in just to finalize a ₦25,000 transaction is an absolute conversion killer. The deal dies right there in the DMs.

SentiBud strips all that out by moving the entire escrow workflow into WhatsApp. You set up transaction terms, fund the escrow account, notify the seller to dispatch, and release funds—all without leaving the chat thread.

### Conversational UI is harder than it looks

Building inside WhatsApp sounds simple on paper, but engineering a reliable transaction flow over a messaging API is a wild ride.

```
Buyer/Seller ---> WhatsApp API ---> Webhook Worker ---> State Machine ---> Escrow Engine
```

Instead of relying on rigid UI buttons and form fields, you’re dealing with asynchronous text input, users making typos, network lag during bank transfers, and edge cases where someone drops off mid-transaction. You basically have to build a strict state machine behind a loose, conversational interface.

![Financial transaction graphics](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

The smart move here isn't just protecting the cost of the item; it's protecting the dispatch fee too. How many times has a vendor shipped an item from Yaba to Ajah, only for the customer to change their mind or turn off their phone? The vendor loses ₦3,000 on delivery costs for nothing. Locking in the logistics cost upfront alongside the product price fixes a massive leak in local social commerce.

### Where the real test lies

Building the bot and hooking it up to a payment gateway is the easy 20% of the work. The real test for SentiBud is going to be dispute resolution.

What happens when a dispatch rider leaves a package with a security guard in a Gbagada estate, the buyer claims it's damaged, and the seller insists it left the shop in pristine condition? How does a WhatsApp bot gather proof, evaluate photos, and decide who gets paid without needing an army of manual ops staff working overtime?

If they can handle those messy, chaotic edge cases without slowing down payout times, this could easily become the default protocol for informal trade across the country. 

Meet your users where they already live. Right now, in Nigeria, they live inside WhatsApp.