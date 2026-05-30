---
title: "Losing 500k to an IP Address and the Art of the Workaround"
date: "2026-05-30T20:11:34.680Z"
excerpt: "If you've ever had a transaction flagged because of a sketchy IP address, you know the pain. Here's why building payment rails in Africa is still the ultimate boss level."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/05/TC-Featured-Image-design-6-1.jpg"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/05/30/day-1-to-1000-startbutton-africa/"
---

Imagine losing your entire law school tuition because your guy forgot to turn on a VPN in 2012. 

That is not just "sapa" knocking at your door; that is a complete, soul-crushing system error. Mallick Bolakale lived through this exact nightmare. He was trying to flip laptops from eBay to raise money, his friend refreshed a page without an active VPN, eBay flagged the Nigerian IP address as fraudulent, the order got nuked, and the middleman ran away with the refund. Just like that, ₦500k—which was serious money back then—vanished into the ether. 

That story made me physically wince because anyone who has tried to buy a domain, pay for AWS servers, or pull in international payments from a keyboard in Nigeria knows that we have been playing this game on hard mode for decades. 

![Coding and debugging through the night](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Workaround is the Product

We are a nation built on workarounds. If the national grid fails, we buy generators. If the roads are bad, we buy SUVs or use bikes. And if the global financial system locks us out, we build crazy, multi-layered underground pipelines just to pay for a simple digital service.

But relying on a guy who knows a guy with a US bank card is not scalable. It is stressful, and it eventually breaks. 

This is why I find the evolution of Startbutton Africa so interesting. It started in 2022 because someone in Rwanda reached out to Mallick via Twitter DMs, complaining about how hard it was to plug into Nigeria’s payment rails without local structures. He didn't set out to write a grand corporate pitch deck; he just started manually helping them route payments. 

That is the secret of the best software. You don’t start with a "disruptive vision." You start by writing dirty scripts to solve a highly specific, painful problem for one desperate user. 

### What Actually is a Merchant of Record?

Let’s talk about the tech stack and operational headache here. If you are building an app in Lagos and you want to expand to Kenya, Ghana, or Senegal, you can't just write a few lines of code and call it a day. 

Every single one of these borders comes with its own financial gatekeepers. You have to deal with localized tax laws, varying KYC demands, different currency fluctuations, and completely different payment APIs (like M-Pesa in Kenya vs. Mobile Money in Ghana). 

![Writing clean payment APIs is only half the battle](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

If you try to handle all of this yourself, you will spend 80% of your engineering time fighting compliance bugs instead of actually building your product. 

This is where a Merchant of Record (MOR) comes in. They basically act as the legal entity that handles the transaction. They take on the liability, the tax calculations, the local payout structures, and the regulatory relationships. As a developer, you just integrate their SDK, hit their endpoints, and let them worry about whether the Kenya Revenue Authority is going to breathe down your neck. 

### "No Gree for Anybody" on the Payments Front

Expanding to 15 African markets is no joke. I’ve sat in a Gbagada workstation on a rainy morning, debugging webhooks that were failing simply because a local bank's server decided to go offline for three hours. Now imagine trying to coordinate that chaos across Nigeria, Uganda, and Senegal simultaneously. 

It takes a special kind of resilience to build infrastructure here. You have to adopt a strict "no gree for anybody" mindset, because if the APIs don't break, the regulators will shift the goalposts overnight. 

I’m glad we are moving away from the era of manual workarounds and VPNs. If we want African developers and businesses to compete globally, we need infrastructure that makes borders invisible. We need tools that let a kid coding in Akure or a founder building in Owerri spin up a product and collect payments from Nairobi as easily as they do from down the street. 

The next time you push code to production, remember that the systems we take for granted today were born from the ashes of someone’s lost law school fees. Let's keep building.