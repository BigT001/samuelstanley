---
title: "Data Over Collateral: Why Nombank's NGN 250B Leap Actually Matters to Builders"
date: "2026-07-03T15:53:55.508Z"
excerpt: "Most small businesses in Nigeria can't get loans because banks are looking for land titles instead of ledger balances. Nombank is rewriting that code, and the numbers are getting wild."
category: "Venture"
tags: ["Venture Capital", "Startups", "Investment"]
image: "https://weetracker.com/wp-content/uploads/2026/07/nombank-md-seun-osukeye_weetracker.png"
readTime: "4 min read"
sourceUrl: "https://weetracker.com/2026/07/01/nombank-seun-osunkeye-sme-credit-interview/"
---

If you have ever tried to get a business loan from a traditional Nigerian bank, you already know the script. They want your firstborn’s DNA, a Certificate of Occupancy for a property in a neighborhood you can't even afford to drive through, and three years of audited accounts signed by an expensive firm. 

It is a broken loop. For a small business owner—whether running a busy pharmacy in Akure or wholesaling spare parts in Onitsha—getting capital to restock is a nightmare. The system is built for a reality that does not exist on our streets.

This is why I found the latest chat with Seun Osunkeye, the Managing Director of Nombank, so fascinating. He went from writing an undergraduate thesis on how microfinance banks support SMEs to actually running one under the Nomba umbrella. That is some serious full-circle energy.

![Data and finance are finally starting to align for local merchants](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

### The Paperwork Trap vs. The POS Ledger

Traditional banks love paper because they do not know how to read digital footprints. To them, if it is not on a stamp-duty document, it did not happen. 

But look at the reality of a merchant using a terminal. They might process hundreds of thousands of Naira daily. Every swipe, every transfer, and every payment is a hard data point. When Nomba acquired a microfinance bank license and morphed it into Nombank, they did something obvious but incredibly difficult to execute: they turned transaction data into creditworthiness.

As a developer, I look at this as an engineering problem. You have a massive pipeline of raw transaction data. Instead of letting that data sit idle in a Postgres database, you pipe it into a risk-engine that can say, "Hey, this shop in Gbagada has a consistent inflow of NGN 500k every single week. They can easily pay back a NGN 1M loan over three months." 

You do not need a land title for that. The ledger is the collateral.

### That NGN 250 Billion Scale

The scale here is what blew my mind. According to Seun, their daily transaction volume surged from NGN 7 Billion in May 2025 to roughly NGN 250 Billion in May 2026. 

That is not just a hockey-stick curve; that is a complete infrastructure stress test. 

![Writing clean code to support high-throughput transaction engines](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

To go from N7B to N250B daily means your systems are handling serious concurrent loads. If your APIs are laggy or your database queries are poorly optimized, a jump like that will crash your stack before you can even say "Sapa." 

Beyond the tech, it shows a massive shift in trust. Merchants are not just using these terminals to collect money and instantly sweep it out to traditional accounts anymore. They are leaving their money on the platform. In our market, getting a business owner to trust an digital ledger enough to leave their working capital there is the real win. 

### Why I'm Watching This Closely

We have plenty of consumer lending apps in Nigeria. Most of them are just digital payday lenders charging ridiculous interest rates to help people survive the last week of the month. That is not wealth creation; that is just managing survival.

Real economic growth happens when the person selling building materials in Owerri can access enough credit to buy a whole container instead of five crates. 

If Nombank can keep leveraging Nomba's massive merchant network to offer credit that actually fits how these businesses run, they might just build the most valuable credit directory in West Africa. 

No fancy boardrooms, no heavy English, just clean code processing real transactions and putting money where it actually moves the needle. Let's see how they scale this from here.