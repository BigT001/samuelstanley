---
title: "750 Megawatts and the Reality of Local Compute"
date: "2026-06-09T21:03:04.353Z"
excerpt: "While we battle power fluctuations in Gbagada to run basic Docker containers, they are deploying $290M liquid-cooling setups in New York. Let's talk about the physical reality of building for the AI era."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://techpoint.africa/wp-content/uploads/2026/06/Motivair-ChilledDoors-at-TeraWulf-1021x682.jpg"
readTime: "4 min read"
sourceUrl: "https://techpoint.africa/brandpress/schneider-electric-progresses-phased-delivery-of-over-290m-in-ai-infrastructure/"
---

My generator mechanic, Baba Tunde, is currently the most important person in my life. He was over yesterday to patch up our noisy 10kVA diesel generator because the grid in my corner of Lagos has been doing its usual dance. As I watched him wipe grease off his hands, my phone buzzed with an update about Schneider Electric delivering over $290 million in AI infrastructure to a massive 750-megawatt data center in upstate New York. 

The contrast was so sharp it almost made me laugh. Here I am, hoping my inverter batteries don’t pack up during a database migration, while on the other side of the Atlantic, they are engineering ways to stop thousands of high-density GPUs from melting into a puddle of expensive silicon.

When we talk about the AI boom, we usually talk about clean interfaces, clever prompts, and SaaS integrations. But as developers, we sometimes forget that software is ultimately a tenant of physical hardware. And right now, the physical world is struggling to keep up.

### The Thermal Bottleneck

The project in question is TeraWulf’s Lake Mariner campus. They are setting up a massive environment to support high-performance computing (HPC) and AI workloads for heavy hitters like Fluidstack and Core42. 

If you’ve ever run a heavy local model on your laptop, you know how quickly the fans start screaming. Now multiply that by a few hundred thousand enterprise-grade chips. You can't cool that kind of heat with standard air conditioning anymore. 

![Coding on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

Schneider Electric is pulling this off by integrating specialized liquid cooling tech from Motivair. We are talking about liquid-to-air in-row cooling and "ChilledDoors" that sit directly on the rear of the server racks. It’s an elegant, brute-force engineering response to a simple problem: compute generates heat, and heat kills chips. 

The phrase that caught my eye in the report was "time to power." In the US and Europe, the biggest hurdle for AI startups isn't writing the code; it's finding a physical location with enough electricity and cooling infrastructure to host the servers.

### The True Cost of "No Gree for Anybody"

This brings me back to our local reality. In Nigeria, the tech community has an incredible "no gree for anybody" attitude. We build amazing products, optimize our code to the absolute limit, and find creative workarounds for terrible internet latency. 

But when it comes to raw compute, we are renting space on foreign servers. Almost every startup I know in Lagos, Abuja, or even the quieter hub in Akure, hosts their backend on AWS, Heroku, or DigitalOcean. 

And why wouldn't we? Hosting a physical server rack here is a financial nightmare. 

![A typical scene showing local infrastructure challenges](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

If you try to run your own hardware, you aren't just a software company anymore; you are a power utility company that happens to write code. The diesel costs alone would eat your runway before you even get to launch. 

This means we are permanently paying for compute in US Dollars while earning in Naira. Every time the exchange rate fluctuates, our server bills stretch our margins. 

### Can We Reclaim the Physical Layer?

TeraWulf built their massive 750 MW campus on a legacy industrial site, reusing existing power infrastructure. 

It makes me wonder: could we do something similar? We have quiet, cooler regions like Jos where the climate naturally reduces the need for heavy cooling. We have empty industrial estates in places like Enugu or Kaduna that are currently lying fallow. 

If we ever want to move past simply building wrappers around foreign APIs and actually train models on our own local datasets—for localized healthtech, logistics, or native language processing—we have to solve the power and cooling puzzle locally.

Until then, we have to keep optimizing. If you can't afford massive liquid-cooled server farms, your only option is to write highly efficient code. Make your queries fast. Keep your database indexes clean. Don't spin up heavy EC2 instances when a simple lambda function can do the job.

As for me, I’m off to check the diesel level in the generator. Baba Tunde did a good job, but I’d still prefer a stable grid over a well-serviced engine any day.