---
title: "Dear MTN and Airtel: Please don't hide your new AI models behind a USSD menu"
date: "2026-06-17T13:40:29.518Z"
excerpt: "The big telcos are building African language LLMs. That sounds amazing on paper, but as a dev who has survived integration hell with local telecom APIs, I have some serious concerns."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://techpoint.africa/wp-content/uploads/2026/06/G6-the-operators-Airtel-Axian-Telecom-Ethio-Telecom-MTN-Orange-and-Vodacom.png"
readTime: "4 min read"
sourceUrl: "https://techpoint.africa/news/africa-ai-language-models/"
---

Last night, I spent three hours trying to get a popular LLM to understand a simple customer complaint written in Pidgin. The user was trying to say their delivery in Onitsha hadn’t arrived and they were close to losing their temper. The model, bless its heart, responded in this incredibly stiff, overly formal translation that completely missed the urgency. It sounded like a British aristocrat trying to settle a dispute at a local motor park. 

So, when I saw the news that Africa’s biggest telcos—the G6 alliance, including MTN, Airtel, and Orange—are building native AI language models, my developer brain did a quick double-take. On paper, this is exactly what we’ve been waiting for. A Swahili model is already live, and models for other major languages are in the pipeline.

But as someone who has spent years building products in this ecosystem, my excitement is mixed with a healthy dose of skepticism.

![A developer trying to debug local language processing on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The API Trauma is Real

Let’s be honest for a second. If you’ve ever tried to integrate a service with a telecom operator in Nigeria, you probably still have the scars. 

Remember trying to set up a simple SMS gateway or a USSD shortcode back in the day? It usually involved endless trips to corporate offices in Victoria Island, signing physical papers in triplicate, paying crazy setup fees, and waiting weeks for an API key. And when you finally got the endpoint, the documentation looked like it was written in 2004, and the connection would randomly time out whenever it rained.

If these new language models are going to change how we build apps, the telcos need to completely change how they think about developer experience (DX). 

If I have to jump through corporate hoops or sign an enterprise licensing agreement just to get an API key to test a Yoruba voice-assistant for market women, the project is dead before it even starts. We need self-serve developer portals. We need a simple, clean API where we can input a credit card (or pay in Naira without a hassle) and get building immediately. 

### Latency, Edge Servers, and the Gbagada Workstation

When you are sitting in a shared workstation in Gbagada, trying to optimize an app to work on a cheap Android phone with a shaky 3G connection, latency is everything. 

Right now, if I send a prompt to OpenAI or Anthropic, that request travels across the ocean to servers in Oregon or Frankfurt and back. For a user in a rural market with spotty reception, that delay makes conversational AI feel clunky and unusable. 

![A typical chaotic street scene where high-speed internet is a luxury](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

If MTN and Airtel are hosting these new models locally on edge servers right here in Lagos, Nairobi, or Accra, that changes the game. We are talking about dropping latency down to milliseconds. 

Imagine building a voice-to-text system for a farmer in Jos who wants to diagnose a plant disease in Hausa. If the response is near-instant because the model is running on local infrastructure, that’s a massive win. That is how we actually build useful tech, not by showing off high-level slides at tech conferences.

### Tokenization and the "Sapa" Economy

There is also the boring but critical issue of tokenization. 

Standard LLMs are trained mostly on English text. When you pass Yoruba, Igbo, or Swahili through their tokenizers, they break the words down into tiny, inefficient fragments. A single sentence in Yoruba can cost three to four times more tokens than the same sentence in English. 

When you are bootstrapping a startup and dealing with "Sapa" (the constant struggle to keep overhead costs low), paying triple for token usage just to support local languages is a massive bottleneck.

If these telco-backed models are trained natively on African languages, the tokenization should be highly efficient. It should cost the same, or less, to query a model in Pidgin as it does in English. If they get the pricing right, we can finally build localized customer support bots, automated voice systems for microfinance, and educational tools that don't burn through our seed funding in a week.

The economic stakes are high, and the potential is real. I genuinely want to see this succeed. I just hope the decision-makers realize that the success of these models won't be decided by press releases. It will be decided by the developers trying to make an API call at 2:00 AM in a quiet room, hoping the server actually responds.