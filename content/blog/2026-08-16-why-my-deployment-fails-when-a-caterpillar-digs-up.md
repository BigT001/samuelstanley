---
title: "Why My Deployment Fails When a Caterpillar Digs Up Gbagada"
date: "2026-08-16T06:20:48.412Z"
excerpt: "We talk about building world-class software, but we're still debugging why a single road contractor can take down an entire sprint's worth of pull requests."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://cdn.businessday.ng/2021/07/Untitled-design-2021-07-27T172413.244-1.png"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/ipnx-atcon-stakeholders-seek-stronger-collaboration-to-improve-fibre-broadband-in-nigeria/"
---

There is a specific kind of heartbreak that only Nigerian developers know. 

You’re in the middle of pushing a hefty Docker image to AWS, or you’re screen-sharing a staging demo with a client in London, and your terminal hangs. The blinking cursor just freezes. 

You check your router. Red light. You step outside, look down the street, and see a backhoe digging a trench for a new drainage gutter. 

Just like that, your fibre connection has been sliced in half.

![Working through the bugs](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Redundancy Circus

Every remote engineer or technical founder I know runs an insane backup setup. I have my main fibre line, an MTN 5G router on standby, an Airtel MiFi in the drawer, and my phone’s hotspot loaded with emergency data. 

We budget for high latency and sudden packet loss the same way we budget for fuel in the generator. It’s an invisible tax on building software here. 

When ipNX, ATCON, and the NCC gathered at the Radisson Blu in Lagos to talk about Fibre-to-the-Home (FTTH), they touched on the exact problem making our lives harder: nobody treats fibre optic lines like critical infrastructure. 

Aminu Maida from the NCC pointed out that we need properly installed, documented, and protected cables. Tony Emoekpere from ATCON hit the nail on the head when he said people need to treat damaged fibre the way they treat vandalized transformers. When a transformer blows, the whole street shouts. When a fibre cable gets shredded by road workers, nobody bats an eye except the remote dev whose SSH session just timed out.

![Writing code without steady connectivity is painful](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Shared Poles and Common Sense

The piece of the conversation that actually gave me some hope came from Adebayo Akande over at Oyo State’s infrastructure agency. He advocated for shared pole infrastructure along common routes.

If you’ve ever walked around Bodija in Ibadan or driven through Ikeja, you’ve seen the chaotic spaghetti of overhead lines. Every ISP digs their own shallow trench or strings their own fragile cable across makeshift poles. Then the state road maintenance agency comes along, tears up the road, and cuts three different providers' lines in one morning.

Shared infrastructure isn't just a cost-saver for telcos; it makes the internet resilient. If providers share conduit ducts and sturdy utility poles, the odds of an accidental line cut drop dramatically. 

### What Fast, Stable Fibre Actually Unlocks

This isn't just about streaming 4K video without buffering. It’s about productivity.

1. **Local-first builds don't cut it anymore**: Modern web development relies on cloud dev environments, rapid CI/CD pipelines, and heavy package downloads. If your `npm install` takes 20 minutes because of packet loss, you lose your flow state.
2. **Real-time collaboration**: Running pairing sessions on Tuple or doing design critiques on Figma gets miserable on a jittery 4G connection. Stable FTTH means you actually feel part of a distributed team.
3. **Decentralizing the tech scene**: Good fibre shouldn't just be a luxury for folks in Ikoyi or Victoria Island. When stable broadband hits places like Akure, Jos, and Abeokuta, developers can build profitable products without paying insane Lagos rents.

Until we fix the physical layer of the internet—the actual glass cables running under our gutters—our software layer will always be playing catch-up. 

It’s good to see the industry finally sitting in one room to talk about standards. Now let’s see if they can stop the excavators from cutting my line next Tuesday.