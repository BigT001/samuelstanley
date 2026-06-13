---
title: "AI in the Clouds? Try AI in actual Orbit (And my 200ms ping)"
date: "2026-06-13T11:53:15.641Z"
excerpt: "SpaceX wants to launch a million satellites to run AI workloads in space. But back here on Earth, I'm just wondering how this changes things for a developer sitting in a cold room in Jos."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://cdn.businessday.ng/2023/01/Starlink-Satellite-1.png"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/spacex-plans-orbital-ai-data-centers-on-elon-musks-space-based-computing-push/"
---

My laptop is currently hot enough to fry an egg. I’m running some intensive processing on a local model, and the fan is screaming. So, when I hear that SpaceX is planning to put a million satellites in orbit to act as AI data centers, part of me gets very excited. The other part—the developer who has spent too many nights debugging API latency—is deeply skeptical.

The Dev Math of Space Computing

Let’s look at the actual physics here. In space, you don’t have to worry about the national grid tripping or buying diesel for a massive generator. You get raw, uninterrupted solar power. And heat? You can radiate it right out into the void.

But as anyone who has built a real-time application knows, distance is the ultimate killer.

![A laptop open with lines of code, the developer's workbench](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

If I’m building an app for a user in Owerri, and every simple AI query has to travel to low Earth orbit, get processed by a floating GPU, and beam back down, what does that do to the response time? For batch processing—like training models or running heavy data analysis—it's brilliant. For real-time conversational AI? That round-trip latency might make the experience feel painfully sluggish.

Bypassing the Grid

But let's look at the flip side. For those of us building products in Nigeria, infrastructure is a constant tax.

If you’ve ever tried to run a high-performance local server in Jos during a cold harmattan morning, you might get lucky with the cooling, but you still have to worry about the power cutting out. We spend so much mental energy and capital just keeping the lights on.

![Life and hustle on the streets of Nigeria](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

If SpaceX manages to make orbital compute cheap enough, they aren't just selling us internet bandwidth anymore. They’re selling us a way to offload our heavy computational lifting entirely off the planet. We won't need to build massive, power-hungry data centers on land that constantly fight with an unstable grid. It’s a wild way to think about scaling, but it might actually work.

The "No Gree" Engineering Challenge

This isn't going to be an easy build. Space is a brutal environment.

You have cosmic radiation flipping bits in your memory. You have the constant threat of space debris. And unlike a server farm in Gbagada where you can just tell a junior dev to go swap out a bad SSD, you can't send anyone upstairs to fix a dead graphics card. Once a satellite’s hardware degrades, it's basically space junk waiting to burn up in the atmosphere.

It’s a massive engineering risk. But honestly, watching SpaceX push the limits makes you want to build bigger things. They are taking the "no gree for anybody" mindset to a cosmic level.

Whether this actually drops our API latency or just becomes an expensive playground for massive tech giants remains to be seen. But for now, I'll go back to cooling down my laptop with a table fan and pushing code to the servers we have on solid ground.