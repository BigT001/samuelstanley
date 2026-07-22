---
title: "ESG Reports Don't Swap Batteries: My Take on Spiro's Net-Zero Push"
date: "2026-07-22T20:15:06.319Z"
excerpt: "Spiro dropped a shiny sustainability report promising net-zero by 2040. But as anyone building tech in Nigeria knows, the real challenge isn't publishing PDFs—it's keeping battery stations online when the grid collapses."
category: "Business"
tags: ["Business", "Startups", "Entrepreneurship"]
image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=1200&auto=format&fit=crop"
readTime: "4 min read"
sourceUrl: "https://businessday.ng/technology/article/spiro-targets-net-zero-by-2040-sets-esg-benchmark-for-africas-electric-mobility-industry/"
---

Writing code for a web app is hard enough, but trying to build a hardware and software ecosystem tied to physical batteries on our unpredictable electrical grid? That is pure, unadulterated stress. 

Spiro just released its first sustainability report, making headlines with promises of reaching net-zero Scope 1 and 2 emissions by 2040 and registering with the Science Based Targets initiative. The corporate suit crowd is clapping for the disclosures, but my eyes immediately scanned past the PR fluff down to the actual operational numbers. 

![Nigeria Scenes](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

## The Grid Is the Ultimate Bottleneck

Look at the breakdown: Spiro reported about 243 tonnes of Scope 1 emissions (direct operations) versus 16,652 tonnes of Scope 2 emissions for 2025. Scope 2 is almost entirely the electricity pulled from the local power grid to charge thousands of swap batteries. 

In this part of the world, charging batteries off the public grid means you're frequently sucking power from fossil-fueled plants or relying on massive diesel generators when the feeder line trips for the third time in an afternoon. You can't claim to be clean green mobility if your charging hub in the middle of a busy bus park is secretly powered by a roaring 250KVA generator belching black smoke into the air.

That’s why their plan to slap 80–125 KVA solar systems onto battery swapping stations isn’t just some eco-friendly flex—it’s an engineering necessity. If your swap station goes dark because the grid fails, your entire fleet stalls out. Solar plus localized battery storage is the only way to guarantee 99.9% uptime for hardware deployed in places where power drops without warning.

## Code Meets Asphalt

Behind all these sustainability metrics lies a massive software challenge that people rarely talk about. Managing a fleet of electric motorcycles and battery swap stations isn't just about bending metal and shipping frames; it’s an intense IoT and telemetry problem.

![Coding Laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

Every single lithium battery pack out there needs to report its State of Charge (SoC), temperature, cycle counts, and health status in real time back to a centralized backend. 

Think about the execution layer here:
* **Thermal Management:** Batteries sitting inside a hot metal station in Akure or being pushed hard on dusty roads in Onitsha will degrade quickly if your firmware isn't actively monitoring thermal thresholds.
* **Authentication & Latency:** When a rider pulls up to swap a dead pack, that transaction needs to happen in seconds. If your API gateway hangs, or your station controller loses internet connectivity, that driver is stuck.
* **Anti-Theft & Telematics:** You're tracking high-value assets deployed across chaotic urban routes. If a pack gets opened or tampered with, the system needs to kill the circuit instantly.

If the software layer glitches, the entire physical operation breaks down.

## Sapa Trumps Sustainability

Spiro claims commercial riders using their bikes cut operating costs by 70% to 80% compared to traditional fuel bikes. That right there—and *only* that—is what will drive actual adoption across Africa.

An okada rider navigating morning traffic in Owerri or hauling goods through cold mornings in Jos doesn't care about Scope 3 inventories or GRI standards. They care about daily cash flow. Fuel prices have hit everyone hard, and Sapa is a very real motivator. If swapping a battery costs significantly less than filling a tank with expensive petrol, people will switch. "No gree for anybody" applies to high fuel bills, too.

It’s great that Spiro is laying down an ESG baseline to lock in climate funds and DFI capital—because hardware startups in Africa need huge balance sheets to survive. But for those of us watching from the builder's perspective, the true test will be on the ground: stable microservices, rugged swapping hardware, smart solar integration, and batteries that don't die prematurely under the harsh sun.