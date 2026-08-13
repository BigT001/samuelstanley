---
title: "Stop Throwing Kafka at Everything: A Developer's Guide to System Design"
date: "2026-08-13T15:00:41.886Z"
excerpt: "Before you spin up three Redis clusters and a Kubernetes pod for an app that barely has fifty active users, let's talk about how to actually approach system design without losing your mind."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fttgbwo7w29w39pc7ww7j.png"
readTime: "5 min read"
sourceUrl: "https://dev.to/akarsh_7464bb454ffc25d1e2/how-to-approach-any-system-design-problem-5b0g"
---

A few months ago, I was having coffee with a junior dev in Akure who was building an event ticketing MVP for local tech meetups. Before he had written a single database migration or processed one test payment, he was already stressing over whether to deploy Kafka or RabbitMQ for his background jobs. 

I had to pause and ask him: "Bro, how many people are actually buying tickets at the same second?"

His answer? Maybe fifty people on a good Saturday.

That conversation reminded me of a trap almost every engineer falls into at some point. We see shiny tech words floating around tech Twitter—Load Balancers, Redis, Microservices, Sharding, Kubernetes—and suddenly, a simple feature turns into a monster setup. We start picking our tools before we even understand the problem we're trying to solve.

![Developer working on code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

## The Resume-Driven Design Problem

The biggest mistake I see folks make is designing for scale they don't have. They know Redis, so they slap Redis into the architecture. They read an article about Netflix's microservices, so they split a CRUD app into six microservices.

Then power drops, their local docker setup breaks, or AWS sends them a bill charged in USD while their startup is earning in Naira, and the pain sets in.

System design isn't about flexing how many technologies you can cram into a diagram. It's about trade-offs. It's about knowing *why* a piece of infrastructure belongs in your architecture and what it costs you to maintain it.

## Step 1: Figure Out What You're Building

Before you draw a single box on a whiteboard or write a line of code, ask the basic questions:

What are the functional requirements? If it's a URL shortener, the system takes a long link, gives back a short one, and redirects users when they click it. That's it. 

What are the non-functional requirements? Does it need real-time speed? Does it need 99.99% uptime? If a server goes offline during peak hours in Onitsha, does the data survive? 

Don't guess. Lock down the requirements first.

## Step 2: Do the Math

You don't need a degree in pure math to do scale estimation. You just need rough figures to guide your decisions.

Handling 500 requests a day is a completely different beast from handling 50,000 requests per second. If you're building a lightweight logistics tracker for bus parks in Owerri, a single PostgreSQL instance on a cheap virtual server will probably handle your load for the next two years without sweating. 

When you estimate traffic and storage up front, you avoid over-engineering things you don't need yet.

![Data and metrics](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

## Step 3: Define the API Boundary

Once you know the scale, lay out the entry points. How will your mobile app or frontend talk to your backend?

Keep it clean:
- POST /api/v1/shorten
- GET /{shortCode}

APIs set the boundaries of your system. Once your endpoints are clear, you can actually visualize how data flows from the user's phone down to your database.

## Step 4: Start Simple, Add Complexity Only When It Hurts

Start with the absolute minimum architecture:

Client -> Load Balancer -> App Server -> Database

That's your foundation. You only add extra components when you hit a clear bottleneck.

Why add a Cache? Because hitting your primary database every time a million users request the exact same home feed will fry your database CPU. You introduce Redis to save those expensive reads.

Why add a Message Queue? Because sending a transactional email or processing an image upload during an HTTP request makes the user wait unnecessarily. You put that heavy task in a queue so a background worker can deal with it quietly while the user gets an instant success response.

![Tech workspace scene](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

## Every Box Needs a Reason

When I look at an architecture diagram, I always ask one thing: "What happens if this specific box dies?"

If you can't explain why a component exists or what happens when it fails, it shouldn't be in your stack. Simple, boring architecture that you can debug at 2 AM when servers are burning is worth ten times more than a complex, fragile web of microservices you barely understand.

Build simple first. Scale when the users actually force you to.