---
title: "When Old Money Buys New Payout Rails"
date: "2026-07-28T16:06:06.137Z"
excerpt: "Zedcrest just bought Leatherback outright. Here's what happens when local asset managers stop relying on external APIs and start buying the payment pipes themselves."
category: "Venture"
tags: ["Venture Capital", "Startups", "Investment"]
image: "https://weetracker.com/wp-content/uploads/2026/07/ZedLeather.jpg"
readTime: "4 min read"
sourceUrl: "https://weetracker.com/2026/07/27/zedcrest-group-acquires-leatherback/"
---

If you’ve ever tried building a multi-currency payout engine in West Africa, you already know the special kind of pain I’m talking about. You write code that expects clean webhook payloads from a bank partner, only for a currency control shift or liquidity drought to break your entire staging environment at 2:00 AM. 

So when news broke that Zedcrest Group acquired Leatherback, my first thought wasn't about venture multiples or corporate balance sheets. I immediately wondered what this means for the APIs and infrastructure sitting underneath.

![Code editor with backend API configurations](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### The Backstory (And Why It Matters)

Leatherback popped up around 2021 with Ibrahim Toyeeb Ibitade at the helm, promising to fix the mess that is moving cash across borders for African businesses. Zedcrest actually participated in their $10M pre-seed round back then. Now, five years later, Zedcrest has decided to buy the whole setup for an undisclosed fee. 

Leatherback gets to keep its brand and management team under CEO Ochebhoya Ekpete, but now it operates as a full subsidiary. 

This isn't just a random exit. Zedcrest bought RMB Nigeria Stockbrokers not too long ago, and buying a cross-border payments provider gives them direct access to global multi-currency accounts, regulatory coverage in places like the UK, and direct banking rails.

### Why Developers Should Pay Attention

Building cross-border fintech tools from scratch is exhausting. You spend 80% of your product engineering time wrestling with Nostro/Vostro compliance, acquiring local money transmitter licenses, and fighting FX slippage. Only 20% actually goes into making a clean UI for your users.

![Financial data charts showing FX and market trends](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

When a full-fledged financial group buys a modern fintech provider, two things usually happen:

1. **Liquidity improves:** The biggest bottleneck for cross-border tools isn't the React frontend; it's deep treasury backing. Zedcrest brings capital to back multi-currency reserves.
2. **The trade-off on agility:** Institutional owners like compliance. A *lot* of it. If you're integration-testing against their endpoints, expect stricter KYC checks, tighter rate limits, and zero tolerance for edge-case workarounds.

I remember chatting with a developer at a quiet workstation setup in Gbagada last month who was trying to route freelancer payouts from Europe down to remote workers in Akure and Jos. The main issue was never the speed of execution; it was the sudden blockages on foreign currency settlement accounts. Having heavy institutional capital behind payout rails helps eliminate those sudden "Sapa" moments where cash gets trapped mid-flight due to liquidity issues.

![Bustling street scene showing local commerce](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

### Where We Go From Here

The "No gree for anybody" energy in the local fintech space is shifting. We're moving away from pure software startups burning cash on digital ads toward legacy financial players buying up working software architectures to plug into their existing treasuries.

For those of us building products on top of these platforms, my only real request to the new team at Leatherback is simple: keep the API docs clean, maintain smooth sandbox environments, and don't break our production webhooks while updating compliance modules.