---
title: "MTN wants banks to pay for SIM-swap APIs. Guess who actually pays?"
date: "2026-07-01T20:49:56.150Z"
excerpt: "Telcos and banks are fighting over who should cover the cost of securing our phone numbers. As usual, the developers building the integrations and the users trying to survive 'Sapa' are caught in the middle."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://techpoint.africa/wp-content/uploads/2021/05/Infinix-Hot-S-sim-card-slot-1-of-1.jpg"
readTime: "4 min read"
sourceUrl: "https://techpoint.africa/insight/sim-swap-fraud-mtn-wants-payments/"
---

My phone rang at 2:00 AM last month. It was a close friend crying because his business account had been cleared out. 

The culprit? A classic, ruthless SIM-swap. 

Someone, somewhere, walked into a physical telco outlet, cloned his line, bypassed his bank’s SMS-based two-factor authentication (2FA), and wiped his balance clean. He didn't click any phishing link. He was just sleeping.

Now, MTN says they have a technical fix to stop this, but they want the banks to pay for it. As someone who spends his days looking at APIs, user flows, and system architectures from a hot desk in Gbagada, this whole back-and-forth makes my head spin.

![A developer trying to make sense of broken authentication flows](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Broken Trust of the SMS OTP

Let's be honest with ourselves: we built the entire Nigerian digital economy on top of a single point of failure—the phone number. 

When we build fintech apps or identity verification systems, we treat the SIM card like a hardware security module. We write code that assumes if a user has the SIM, they must be the owner. But a SIM card is just a plastic chip owned by a telco, managed by low-wage agents in roadside kiosks who can be bribed or tricked. 

SMS OTP is a terrible way to secure money, but we keep using it because it is simple and works for the guy using a feature phone in Akure or a trader in Owerri who doesn't have data for an authenticator app. 

### MTN’s Pitch vs. Developer Reality

MTN’s proposal sounds simple on paper. They want to expose an API layer that banks can query before processing high-value transactions. 

The logic is straightforward. Before a bank approves a transfer of five million Naira, their system hits an MTN endpoint. The API checks if the user's SIM card has been swapped in the last 24 to 48 hours. If the API returns a positive flag, the bank pauses the transaction. 

It is a great technical solution. But the friction is about the money. MTN wants the banks to pay to access this security check. 

And this is where the "no gree for anybody" mindset of Nigerian corporate giants kicks in.

![Looking at the data and wondering who will bear the cost](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

If MTN charges the banks, the banks are not going to absorb that cost out of the goodness of their hearts. They will pass it down. They will charge the payment gateways, who will charge the fintech startups, who will eventually charge the end-user. 

In a country where everyone is already battling "Sapa" and complaining about ridiculous bank transfer fees, adding another security levy on every transaction is a tough sell.

### The Engineering Nightmare Nobody is Talking About

As a developer, my immediate worry isn't just the pricing sheet. It's the system reliability.

Imagine we integrate this telco-powered security check into our checkout flows. What happens when the telco API has a downtime? 

Knowing how network stability fluctuates in Nigeria, what happens when a query to verify a SIM status throws a 504 gateway timeout? Do we fail the transaction and lose business for our merchant? Or do we bypass the check and risk a massive fraud incident? 

If we have to wait 15 seconds for a telco response every time a user wants to pay, our conversion rates will tank. Users will abandon their carts, and we'll be left holding the bag.

![Writing clean integration code is one thing, dealing with dirty APIs is another](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Security is Not an Add-On Subscription

Here is my hot take: security should not be a premium subscription model. 

If a telco has weak internal processes that allow bad actors to bypass KYC and swap a customer's SIM without proper validation, that is a vulnerability on their end. Asking banks—and by extension, developers and consumers—to pay to verify if the telco did its job feels a bit backward. 

It is like a locksmith charging you a monthly fee just to confirm if they actually put a deadbolt on your door. 

If we want to build a truly robust digital economy in Nigeria, we need to stop treating security as a monetizable feature flag. Telcos and banks need to sit down and build a shared, open security standard because a safer ecosystem benefits everyone. 

Until then, I’ll be here in my workspace, trying to figure out how to build multi-factor authentication flows that don't make my users want to throw their phones out the window.