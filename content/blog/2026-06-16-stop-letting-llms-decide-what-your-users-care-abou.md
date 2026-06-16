---
title: "Stop Letting LLMs Decide What Your Users Care About"
date: "2026-06-16T18:27:46.430Z"
excerpt: "Vector search is great, but letting an LLM decide what's important to a human is a recipe for bad UX. Here is how we can fix it with a bit of simple math."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fy4rzhn3xjirkmsxmt1st.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/aftabkh4n/letting-users-teach-an-ai-which-memories-matter-3an8"
---

I woke up this morning to a cold, misty breeze here in Jos, the kind that makes you want to stay in bed and ignore your pull requests. But instead, I was staring at my laptop, fighting with a stubborn AI agent that refused to remember what actually mattered. 

If you have built anything with "persistent memory" lately, you know the drill. You use an LLM to extract facts from a conversation, save them as vector embeddings, and pull them up when the user asks something related. 

On paper, it works beautifully. In reality? It has a massive, quiet flaw. 

The LLM is the one deciding what is important. You, the developer, have no say. And more importantly, your user has absolutely zero control. 

## The Hubris of Automated Memory

Let’s say you are building an assistant for a trader in Onitsha main market. The trader tells the bot, "I don't do deliveries on Thursdays because of the market rush, and also, I'm drinking some cold malt right now." 

An LLM processing that conversation might extract both facts. But when Thursday rolls around, the vector search decides to surface "User enjoys cold malt" with a high similarity score, while completely ignoring the delivery restriction. 

It is incredibly frustrating. The LLM thinks it knows what matters, but it is just guessing based on probability. 

![Coding on a quiet afternoon](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

The creator of BlazorMemory, a library for persistent AI memory, ran into this exact wall. Users would mark their birthdays, but the assistant would keep bringing up some random comment about liking coffee instead. 

The solution they came up with in their v0.5.0 update is so simple and practical, I had to share it. 

## The Math: Simple Multipliers Over Heavy Re-ranking

Instead of trying to build a complex, heavy machine learning model to predict human sentiment, the author went back to basics: simple multiplication.

Every saved memory now has an importance score. By default, it is set to 1.0. 

If a user looks at a memory in the UI and clicks a thumbs-up, that score gets bumped to 1.5. If they click a thumbs-down, it drops to 0.3. 

When a query comes in and the system performs a vector search, it does not just rely on the raw cosine similarity score. It takes that relevance score and multiplies it by the importance score. 

Think about how clean this is. 

If a highly relevant but annoying memory has a similarity score of 0.9, but the user previously gave it a thumbs-down, its score is multiplied by 0.3. It plummets to 0.27 and falls off the list entirely. 

Meanwhile, a memory with a lower similarity of 0.7 that the user explicitly liked gets multiplied by 1.5. It jumps to 1.05 and wins the search. 

No complex fine-tuning. No expensive API calls. Just straightforward arithmetic running on the retrieved results.

![Data processing logic](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

## Why Suppressing Beats Deleting

As developers, our first instinct when a user clicks "thumbs down" might be to just delete the record from the database. 

But that is a terrible UX choice for two big reasons. 

First, people make mistakes. If you are using an app while walking down a busy street or riding in a bouncing bus, you are going to misclick. A destructive action like deletion that cannot be undone is hostile to the user. 

Second, sometimes you do not want to destroy the context; you just want to quiet it down. Maybe a customer changed their delivery partner, but you still want the old partner's details somewhere in the system history just in case. Down-ranking it to 0.3 keeps the context alive in the database but keeps it out of the assistant's immediate response. 

And if they genuinely want it gone? You just put a clear delete button right next to the feedback thumbs. 

## Giving Control Back to the User

We need to stop assuming the AI is always right. The "AI knows best" mindset is why so many products feel like they are fighting against the user instead of helping them. 

Giving users simple, manual overrides—like a thumbs-up or thumbs-down that actually impacts the database queries in real-time—makes the software feel cooperative. It puts the human back in the driver's seat. 

I am tempted to implement this exact multiplier trick in a couple of internal tools I am hacking on this weekend. It is cheap, it is fast, and it actually solves the problem without burning through my OpenAI API credits. 

What about you? How are you handling vector search relevance in your own builds? Let me know. Now, back to my coffee before it gets as cold as this Jos weather.