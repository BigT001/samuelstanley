---
title: "Handling the 'Late-Arriving' Nightmare in Code"
date: "2026-06-29T20:51:36.308Z"
excerpt: "When the system lags, do you drop the payload or build a grace period? Lessons from building resilient payment pipes in Nigeria."
category: "Fintech"
tags: ["Fintech", "Finance", "Banking", "Nigeria"]
image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
readTime: "4 min read"
sourceUrl: "https://news.google.com/home?hl=en-US&gl=US&ceid=US:en"
---

My server logs this morning looked like a battlefield. Webhook retries piling up, database locks screaming for mercy, and users wondering why their balances hadn't updated. 

While waiting for my Gbagada workstation's router to stop blinking red, I caught up on the morning news. The US Supreme Court just upheld a grace period for late-arriving mail-in ballots. Political arguments aside, my developer brain immediately went somewhere else: late-arriving data. 

How do we build systems that handle the inevitable lag of the real world without breaking?

![A developer debugging a late-arriving webhook issue](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Tyranny of the 10-Second Timeout

In a perfect world, APIs are synchronous. You make a request, the server processes it, and you get a 200 OK within 200 milliseconds. 

But if you are building fintech products in Nigeria, you know that the "perfect world" is a myth. 

Imagine a merchant in the chaotic main market of Onitsha trying to confirm a customer's transfer. The customer's bank says "Successful," but your system hasn't received the credit notification because a core banking switch in Lagos is currently choked. 

If your backend is designed with a strict, rigid timeout, you are going to drop that transaction. You fail the user, the merchant gets angry, and "Sapa" gets closer because you're losing transaction volume. 

We cannot afford to discard late-arriving data. We have to design for the grace period.

### Designing the Virtual Waiting Room

To survive the unpredictable nature of our local infrastructure, we had to ditch synchronous payment verification entirely for our major integrations. Here is how we handle the lag:

Instead of waiting for an instant response, we immediately write the transaction to our database as "pending" and hand a temporary "we are checking" status back to the frontend. 

We push the transaction ID to a Redis-backed queue. If the webhook from our payment gateway doesn't arrive in 5 minutes, a background worker triggers an active poll to their verification endpoint. 

If that poll fails, we don't give up. We schedule another poll for 15 minutes, then 1 hour, then 6 hours. 

Idempotency keys are our best friends here. When the late-arriving webhook finally hits our server three hours later, the system recognizes the key, processes the credit, and prevents double-spending. It is essentially a digital grace period.

![The hustle of keeping systems online amidst chaotic infrastructure](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

### No Gree for Rigid Code

Building here forces you to be a better software engineer. You can't rely on clean, uninterrupted fiber connections or 99.99% uptime from third-party APIs. 

Whether it is a cold morning in Jos where local towers are acting up, or a busy bus park in Owerri where thousands of devices are competing for one cell tower, your code has to expect delay.

The lesson is simple: stop writing code that assumes immediate success. Build queues. Implement smart retries. Give your incoming data a grace period. Your users—and your own sanity during late-night debugging sessions—will thank you for it.