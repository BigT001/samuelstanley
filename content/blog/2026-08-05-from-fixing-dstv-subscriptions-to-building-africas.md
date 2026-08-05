---
title: "From Fixing DStv Subscriptions to Building Africa's Payment Backbone"
date: "2026-08-05T11:58:08.697Z"
excerpt: "Moment just scored another $22M to scale Africa's payment rails. Here is why starting with a mega-merchant like MultiChoice changes the game for payment infrastructure."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://thecondia.com/cdn-cgi/image/format=auto,quality=auto/wp-content/uploads/2026/08/Joel-Yarbrough-CEO-Moment.jpg"
readTime: "4 min read"
sourceUrl: "https://thecondia.com/multichoice-moment-series-a/"
---

If you have ever had to debug a payment gateway integration at 2 AM while staring at silent webhooks and a flickering inverter, you know the pain. Building payment rails in Africa is less about shiny APIs and more about survival logic—how gracefully does your stack fail when the local cell tower goes down in Akure or when a bank's switch explodes during peak hours?

## Starting With an Anchor Tenant Changes Everything

Moment’s recent $22 million Series A (bringing their total war chest to $55 million) caught my eye today. For those who haven't been keeping track, Moment was birthed out of a joint venture involving MultiChoice, Rapyd, and General Catalyst back in 2023. Now with Canal+ jumping into the cap table alongside AlphaCode, they're gearing up for serious cross-border scaling.

![Coding and payment infrastructure](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

As a builder, the most interesting part of Moment isn't the round size—it's their playbook.

Most fintech startups start from zero. They build a checkout widget, run around pitching small merchants, and constantly fight churn. Moment did the exact opposite: they started with an anchor tenant that already processes millions of recurring transactions across the continent every single month.

If you can handle DStv payment collection at scale without collapsing—processing 600,000 transactions daily across wildly unstable networks—you’ve basically stress-tested your system against worst-case scenarios. Going from an internal engine for MultiChoice to a standalone API for third-party enterprises is just smart engineering leverage.

## Resiliency Beats Pretty Code

Joel Yarbrough, Moment's CEO, brought up a point that hit close to home: building specifically for Africa's power and connectivity realities. 

Anyone who has run a co-working space shift in Gbagada or tried to push code on a chilly morning in Jos knows the drill. Electricity cuts off mid-deploy, network latency spikes to 4,000ms, and suddenly your transaction state gets stuck in limbo.

![Lines of Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

In Western markets, you can rely on near-perfect uptime and standardized direct debits. In Nigeria or South Africa, your payment backend needs to be a paranoid beast:
- **Idempotency keys everywhere** to prevent double-charging when networks drop mid-request.
- **Aggressive fallback routing** when a primary bank gateway inevitably dies.
- **Local method support** because cards alone won't get you past the finish line when users are trying to pay via USSD, instant transfers, or local wallets.

When a payment engine can process 600,000 transactions daily across various African regions despite these structural potholes, that's not just finance—that's battle-hardened systems architecture.

## What This Means for the Rest of Us

Seeing Canal+ co-sign this round along with AlphaCode says a lot about where enterprise payments are heading. Enterprise commerce in Africa is still hindered by fragmentation. A trader in Onitsha sending goods across borders shouldn't have to worry about three different currency conversions and four disconnected settlement systems just to get paid.

![Data and Finance](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

We don't need another generic checkout button. We need deep, reliable infrastructure that handles recurring billing, complex payouts, and high-concurrency loads without dropping the ball. 

For those of us building apps and products for the local market, competition at the infrastructure layer is a huge win. When payment processors fight on reliability and transaction costs, developers get better SDKs, faster settlement times, and fewer headache-inducing support tickets.

Now, back to fixing my own webhook retries...