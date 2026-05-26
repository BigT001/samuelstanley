---
title: "The Stablecoin Paradox: Rich on Paper, Stranded at the Checkout"
date: "2026-05-26T17:28:13.098Z"
excerpt: "We hold USDT to beat inflation, but try buying lunch with it in Lagos. Rach Finance is taking another shot at solving the crypto off-ramp headache, and I have some thoughts on the tech and the timing."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/05/Tap-to-view-Story-Template_20260526_173856_0000.png"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/05/26/rach-finance-crypto-payments-startup/"
---

There is a specific, cold sweat that hits you when you have money but cannot spend it. 

Imagine sitting in a cafe, maybe somewhere in Gbagada, with a hot plate of food in front of you. You have a few thousand USDT sitting pretty in your Trust Wallet, but your Naira account is dry because of some random bank downtime. You want to pay the vendor. 

What follows is a frantic, multi-step Olympic sport: you open a P2P app, look for a buyer who won't scam you, initiate a trade, wait for the bank alert while the vendor stares at you suspiciously, and finally pay. It is exhausting. It makes no sense.

This is the exact wall Keji Pius hit in Lusaka back in 2023, and it is the origin story of Rach Finance. They are trying to build the infrastructure that makes spending stablecoins as easy as swiping a debit card. As a developer, I’m looking at this and thinking: *finally, someone is addressing the plumbing.* But I’m also holding my breath because we’ve seen this movie before.

![A developer working on payment rails](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### Why the "USDT to Naira" dance is broken

For most of us building products or freelancing in Nigeria, stablecoins are not some speculative Web3 casino game. They are survival. With the Naira doing gymnastics against the dollar, holding stablecoins is how we protect our sweat. 

But the user experience of actually *using* that value is terrible. 

The technical challenge has never been the blockchain side of things; writing a smart contract to transfer USDT is trivial. The nightmare is the bridge to the real world. How do you convert that on-chain transaction into local fiat instantly, behind the scenes, without triggering compliance alarms or losing 10% of the value to gas fees and bad exchange rates?

If I pay a merchant in USDT, they usually don't want to hold crypto. They have suppliers to pay in local currency. They want Naira, Cedis, or Kwacha immediately. Rach Finance is trying to act as that invisible middle layer—the liquidity provider that swallows the complexity so the merchant just sees fiat and the user just clicks "pay."

### The ghost of startups past

I cannot talk about this without mentioning Lazerpay. When they shut down in 2023, it was a heavy blow to the ecosystem. They tried to build the Stripe for crypto in Africa, but they ran into a brick wall of low merchant adoption and a brutal funding winter. 

So, what makes the current landscape different?

![Data and transaction flows](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

First, the market has matured. We are no longer begging merchants to "accept crypto" because it is cool. Businesses are actively holding stablecoins now just to pay their international suppliers or hedge against inflation. The McKinsey and Artemis report pointing out that B2B stablecoin payments account for $226 billion annually is not just a dry stat—it is a reality I see with founders in my circle who use stablecoins for everyday liquidity management.

Second, Rach Finance seems to have a sober view of the market. Keji's comment that "it's not for everybody" is a green flag. 

You cannot build a product for the entire population when the average person on the street just wants cash. You build for the tech-savvy businesses, the remote workers, the cross-border traders in places like Onitsha who are already comfortable with digital dollars but are tired of the P2P headache. 

### What I'll be watching

If I were sitting down with Martins, their CTO, over a cold bottle of drink, these are the three things I'd be asking about:

* **Slippage and Gas Fees:** On Ethereum, gas fees make microtransactions impossible. Even on Tron or L2s like Base, who absorbs the fee when a user wants to buy a 5,000 Naira lunch? If the user pays it, they won't use the app. If Rach absorbs it, how do they survive?
* **The Settlement Speed:** Real-time payment in Nigeria (NIP) has spoiled us. We expect instant credit alerts. If a merchant has to wait minutes for block confirmations before handing over goods, the UX is dead on arrival.
* **The Compliance Tightrope:** Regulators in Africa are notoriously unpredictable when it comes to crypto. Navigating local licenses while maintaining a permissionless Web3 vibe is a balancing act that has broken bigger companies.

I want Rach Finance to win. We need more builders tackling the hard, unsexy infrastructure problems instead of launching another generic fintech app with a purple dashboard. 

If they can make the transition from wallet to merchant seamless, they won't just solve a personal frustration for stranded travelers—they might actually unlock the real utility of digital currency in Africa. Let's see how they execute.