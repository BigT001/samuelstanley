---
title: "Building Both Sides of the API Just Got Illegal"
date: "2026-06-22T21:33:20.228Z"
excerpt: "The Central Bank just dropped a bomb on Nigerian fintechs. If you own the checkout page, you can't own the consumer wallet anymore—and it's going to break a lot of codebase architecture."
category: "Venture"
tags: ["Venture Capital", "Startups", "Investment"]
image: "https://weetracker.com/wp-content/uploads/2026/06/Digital-Payments-Provider.jpg"
readTime: "4 min read"
sourceUrl: "https://weetracker.com/2026/06/19/nigeria-cbn-fintech-market-share-restrictions/"
---

My WhatsApp groups are currently a dumpster fire of stressed product managers and technical founders. 

You spend three years optimizing your database, spinning up microservices, and securing microfinance bank licenses just so you can build a closed-loop system where payments actually work. Then, the Central Bank of Nigeria (CBN) drops a circular that basically says: "Nice infrastructure you've got there. Now, slice it in half."

If you haven't seen the news, the CBN is putting a hard ceiling on fintech ambitions. If a licensed entity controls more than 25% of the consumer-issuing market (think digital wallets, retail accounts, cards), they are capped at 15% market share in merchant-acquiring (POS terminals, payment gateways, checkout APIs). And it goes both ways. 

The hammer drops on December 31, 2026.

![A developer trying to figure out how to decouple a monolithic payment system](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Tech Stack Behind the Closed Loop

To understand why this hurts so bad, you have to look at the "how" of Nigerian fintech. 

Standard interbank transfers in Nigeria are notorious. You stand at a kiosk in Gbagada trying to buy lunch, you make a transfer, the money leaves your account, but the merchant doesn't get it. You're stuck waiting for an alert while your food gets cold. 

To fix this, companies like Moniepoint, OPay, and PalmPay built both sides of the network. When an OPay consumer pays an OPay merchant, the transaction doesn't need to go through the clunky, legacy interbank rails. It's just a ledger update on a single database. It’s instant. The uptime is practically 100%. 

Paystack and Flutterwave saw this writing on the wall too. It’s why Paystack bought Ladder MFB and launched Zap. It’s why Flutterwave went after an MFB license. They wanted to convert payment users into deposit-holding banking customers so they could control the transaction from the buyer’s thumb to the merchant’s bank ledger.

Now, that playbook is dead. 

### What This Means for the DB Architecture

As a developer, this is an absolute nightmare. 

We aren't just talking about strategic decks; we are talking about actual code. If you are a dominant player, you now have to intentionally throttle your own growth or decouple your systems. 

How do you even enforce a 15% market share cap programmatically? Do you reject API calls when your monthly transaction volume hits a certain threshold? Do you tell a merchant in Onitsha Main Market that they can't use your terminal today because your merchant-acquiring metrics are running too hot? 

![Looking at the data and trying to figure out where to draw the line](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)

If you are forced to divest or restructure into completely independent entities that cannot share data, you lose the engineering shortcuts that made your UX so smooth. You have to go back to building APIs that talk to external, slower partners. Every extra hop in a network request adds latency. And in Nigeria, latency kills conversion rates.

### The Hustle Shifts to the Edges

This is going to trigger a wild scramble. If the big players have to back off to stay under the 25% and 15% limits, it opens up a massive playground for smaller, niche players. 

The dev team in Akure building a hyper-local cooperative payment app, or the guys in Jos building tailored POS software for cold-room businesses, suddenly have room to breathe. The giants literally cannot afford to gobble up all the market share anymore without getting slapped by the regulator.

But for the end user—the everyday person trying to pay for a ride at a chaotic bus park in Owerri—this might mean we go back to fragmented, less reliable payment experiences for a while. 

We’ve spent the last five years trying to make payments "just work." Now, we have to spend the next eighteen months figuring out how to build systems that work while being legally mandated to stay small on one side of the fence. 

Time to open VS Code and start planning the decoupling. "No gree for anybody" is a great mindset, but the regulator always has the root access.