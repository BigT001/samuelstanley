---
title: "AI Study Buddies: Can We Finally Burn Those Dusty Past Question Booklets?"
date: "2026-05-27T17:22:21.688Z"
excerpt: "I've been looking at Amit's build of an AI study partner. If we can get this right, we might finally save Nigerian students from the horror of poorly printed WAEC prep pamphlets."
category: "Tech"
tags: ["Tech", "Innovation", "Digital"]
image: "https://hackernoon.imgix.net/images/AOlxmWIGgfSM2F068aoQuaNrNel1-ua922ce.jpeg"
readTime: "4 min read"
sourceUrl: "https://hackernoon.com/how-i-built-an-ai-study-buddy-that-generates-notes-tutorials-and-self-validated-tests?source=rss"
---

If you went through the Nigerian educational system, you probably remember those tiny, poorly printed "Past Questions and Answers" booklets. You would buy them from a dusty bookstand near a bus park in Owerri or a roadside vendor in Akure, only to find out halfway through your prep that the answer key for the 2015 Physics paper was completely wrong. It was incredibly frustrating. You essentially had to "no gree for anybody" and cross-reference three different textbooks just to verify if option C was actually correct.

Amit’s recent write-up on building an AI study buddy that generates notes, tutorials, and self-validated tests hits close to home. The magic in his build isn't just that it throws prompts at a large language model and hopes for the best. It's the "self-validation" part. 

As developers, we all know LLMs love to hallucinate when they get tired or when the prompt is slightly off. If you are building an educational tool, a hallucination isn't just a minor bug—it's a system failure that can make a student fail an actual exam.

![A developer debugging on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Tech Behind the Self-Validation Loop

Amit’s approach uses a loop where the AI generates the test, but then another layer of the system validates the questions against a strict grading rubric before the user ever sees them. 

If I were to build this for our local context—say, a JAMB or WAEC prep app—this validation step is where the entire product wins or loses. If the AI generates a chemistry question about organic compounds, it needs to run through a validator that checks if the question aligns with the actual Nigerian curriculum, not just some generic high school syllabus from California. 

From a developer's perspective, this means setting up a structured JSON output schema. You can't just let the model output raw markdown text. You need to enforce a schema where every question has a clear stem, options, the correct key, and an explanation. Then, you spin up a secondary, lightweight model agent to "solve" the generated question. If the secondary agent's answer doesn't match the generator's key, you scrap the question and run it again.

### The "Sapa" Reality: Bandwidth and API Costs

It’s easy to build cool AI agents when you are running on a fast fiber connection with unlimited credits. But building this for a student sitting in a cold room in Jos or trying to study in a Gbagada workstation with patchy network coverage changes the engineering constraints.

First, API calls cost money. If your app is making five sequential LLM calls just to generate three multiple-choice questions, your token bill is going to eat you alive. And you can’t easily charge Nigerian students 15,000 Naira a month just to practice past questions—Sapa is real, and data subscriptions are already expensive enough.

![The busy reality of building products locally](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

To make Amit's architecture work over here, we have to think about aggressive caching. 

Instead of generating a unique test on the fly every single time a student requests one, we should generate high-quality, validated question banks asynchronously. When a student wants to learn about "Equilibrium of Forces," we fetch pre-generated, validated QA sets from a fast PostgreSQL database. We only invoke the real-time AI when they ask a highly specific follow-up question or need a personalized tutorial explanation. This keeps the database fast, the latency low, and the API bill manageable.

### Meeting the Students Where They Are

Another thing is the user interface. Amit built a web-based study buddy, but if we want this to scale across Nigeria, we need to think about accessibility. 

A lot of students don't have laptops. They study on mid-range Android phones. A heavy React or Next.js frontend with complex UI components will lag, and it eats through mobile data. 

I’ve been thinking that the best frontend for this might actually be a WhatsApp bot or a very lightweight Telegram app. Imagine a student sending a message like "/topic Photosynthesis" to a WhatsApp number, and getting back a cleanly formatted summary note, followed by three interactive multi-choice questions. It meets them where they already spend their data.

Building in this ecosystem means you can't just copy-paste foreign tech stacks and expect them to float. You have to adapt the execution to the infrastructure on the ground. But the core idea of using self-validating AI to replace those terrible paper past questions? That’s something I’m absolutely down to build.