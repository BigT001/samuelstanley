---
title: "265,000 Fiber Lines for 200 Million People? No Wonder My Docker Pushes Keep Failing"
date: "2026-07-04T15:08:38.572Z"
excerpt: "Afro Mobile is buying a 40% stake in iSAT, but let's talk about the real bottleneck: why building software in Nigeria still feels like driving a Ferrari on a flooded dirt road."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://technologytimes.ng/wp-admin/admin-ajax.php?action=rank_math_overlay_thumb&id=193286&type=gif&hash=eb058a8c12675e95c372e526d9c7d9b8"
readTime: "4 min read"
sourceUrl: "https://technologytimes.ng/afro-mobile-buys-40-stake-in-isat-group-nigeria/"
---

Yesterday afternoon, I was sitting in a corner of a shared workspace in Gbagada, trying to push a 120MB Docker image to AWS. It should have taken two minutes. Instead, I spent forty minutes watching the progress bar freeze, fail, retry, and fail again. 

I ended up tethering to my phone, burning through expensive Airtel data just to get the build deployed. 

It’s easy to read the tech news and get excited about big money moves. We just saw Afro Mobile acquire a 40% stake in iSAT Group Nigeria. iSAT is a serious player in satellite and connectivity infrastructure across Africa, and Afro Mobile is trying to beef up its local footprint. It’s a solid play on paper. But as a developer who actually has to build, deploy, and run software in this country, it reminded me of a harsh reality we try to ignore when we talk about the "digital economy."

![Developing software in Lagos](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The 265,000 Fiber Joke

The NCC recently dropped a statistic that made me laugh so I wouldn't cry: Nigeria has only 265,000 fiber-to-the-home (FTTH) connections. 

Let that sink in. A country of over 200 million people, with hundreds of thousands of startups, tech hubs, remote workers, and businesses, has fewer fiber lines than a small European suburb. 

If you aren't living in a high-brow estate in Lekki or Ikeja, your chances of getting a stable, unlimited fiber connection are basically zero. If you are building a startup in Akure or trying to run an e-commerce operation out of a warehouse in Owerri, you are at the mercy of microwave links, spotty 4G, or expensive VSAT that goes to sleep the moment a dark cloud appears in the sky.

This isn't just an inconvenience; it's a massive tax on engineering. When your latency is bouncing between 80ms and 400ms, you can't build snappy, real-time applications. You have to write twice as much code just to handle offline states, aggressive caching, and packet loss.

### Why laying cable is a nightmare

So why don't we have fiber everywhere? 

It’s not because the telcos don't want to lay it. It’s because the cost of "Right of Way" (RoW) in Nigeria is absolute extortion. To lay fiber cables, operators have to dig up roads. To dig up roads, they have to pay state governments and local councils. 

Some states treat this as a quick way to cure their own budget "Sapa." They charge ridiculous fees per meter. Add to that the local "area boys" who show up demanding "community fees" the moment they see a shovel, and the math just doesn't work for internet service providers.

![The infrastructure gap](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

The result? ISPs are fighting over the same wealthy neighborhoods in Lagos and Abuja while the rest of the country relies on bad wireless networks. It’s why some industry voices are begging telcos to share infrastructure. It makes no sense for MTN, Airtel, and three different ISPs to dig up the same road to lay five different fiber cables when they could just share one pipe and split the cost. 

### What the iSAT Deal Actually Means for Us

This is where the Afro Mobile and iSAT deal gets interesting. iSAT specializes in satellite, enterprise VSAT, and backhaul. 

Satellite isn't going to give you 5ms ping for your gaming server, but it is a massive lifesaver for the parts of Nigeria that fiber will simply never reach in the next decade. If you are deploying IoT sensors for an agritech setup in the middle of Oyo, or setting up a branch office for a logistics firm in Jos, you can't wait for a fiber cable to be laid from Lagos. You need satellite backhaul.

But we have to be realistic. Satellite is a band-aid, not the final solution. 

As developers, we have to adopt a "no gree for anybody" mindset when it comes to optimization. We can't build heavy, bloated web apps and expect them to run well here. 

We have to optimize our bundles, use lightweight frameworks, and design our APIs to be incredibly chat-frugal. We have to build for the user who is accessing our app on a shared 3G connection in the middle of a chaotic bus park in Onitsha.

I hope the Afro Mobile investment injects enough capital into iSAT to bring down the cost of enterprise bandwidth. But until our local governments realize that internet is as basic as water and stop taxing fiber cables into oblivion, we are going to keep burning money on backup routers and debugging failed deployments.

Now, let me go try and push this Docker image again. Wish me luck.