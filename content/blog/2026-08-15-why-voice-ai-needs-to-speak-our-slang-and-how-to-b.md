---
title: "Why Voice AI Needs to Speak Our Slang (And How to Build One That Doesn't Break)"
date: "2026-08-15T06:18:49.641Z"
excerpt: "Typing prompts into a chatbot when you're trying to learn something hard is painful. Here is a breakdown of low-latency voice pipelines, code-switching, and why audio tutors actually make sense."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fgqx5no5jsjvn8c6gua7o.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/rishabh_pandey_03ea87aa4c/building-bharat-buddy-my-10-day-voice-ai-journey-with-murf-falcon-2d7g"
---

Nobody wants to type out a three-step calculus problem on a cracked phone screen while sitting in a noisy bus park or rushing before the inverter battery gives up. 

Text interfaces are fine for search queries, but for learning, they suck the life out of the interaction. You spend half your energy trying to craft a neat prompt instead of just asking the question floating around in your head.

I was recently looking at a project called Bharat Buddy, built by an engineer during a 10-day voice AI challenge. The creator set out to solve a specific headache for students in India: building a voice tutor that understands Hindi, English, and Hinglish natively, remembers context, and talks back fast enough to feel like a real conversation. 

Looking at the architecture, the lessons apply word-for-word to what we need to build for our own market.

![Lines of Code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### The Latency Trap in Real-Time Voice

Most developers think building a voice agent is just chaining three APIs together: Audio In → Whisper API → OpenAI ChatCompletion → ElevenLabs TTS → Audio Out.

If you build it that way, your user will say "Hello" and wait five awkward seconds in dead silence before the bot replies. That delay instantly breaks the illusion. Nobody talks like that. 

To make voice AI feel human, the round-trip latency needs to sit under 800 milliseconds. 

The stack in the Bharat Buddy build handled this using LiveKit for low-latency WebRTC transport, combined with Murf Falcon for fast text-to-speech generation. LiveKit manages the bidirectional audio stream without the overhead of standard HTTP polling or clunky WebSocket handshakes. The moment the user stops speaking, the speech-to-text pipeline triggers the LLM, which streams tokens directly into the TTS engine chunk by chunk. 

You do not wait for the whole paragraph to finish generating before you start streaming audio back to the user's ears. That is how you kill the lag.

### Code-Switching is Mandatory, Not a Feature

What caught my eye in this build was the focus on Hinglish—the seamless blend of Hindi and English. 

Here in Nigeria, nobody speaks textbook Queen’s English when they are stuck or stressed. If a student in a federal university hostel in Akure or a secondary school kid in Enugu is confused about physics, they won't say: *"Could you kindly elucidate the second law of thermodynamics?"* 

They will say: *"Abeg, explain this force and momentum thing, I no get the formula."*

If your model falls flat on its face whenever someone mixes Nigerian Pidgin, Yoruba, or Igbo phrases with standard English, you haven't built an accessible product. You've built a toy for people who already have MacBook Pros and private tutors. 

Building an agent that handles colloquial code-switching means picking an LLM fine-tuned on regional dialects, or setting system prompts that explicitly normalize the blend without scolding the user.

![Coding Laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### Memory Without Token Bloat

The developer behind Bharat Buddy made a practical engineering choice around memory: do not try to feed the whole raw conversation history back into the LLM on every turn. 

If you store every single audio transcript chunk, your context window explodes, your latency goes through the roof, and your API bill will give you hypertension. 

Instead, practical memory should be structured:
1. **User profile state**: What topics has this person struggled with previously?
2. **Current session goals**: Are we working on fractions or quadratic equations right now?
3. **Session summaries**: Compress the last 10 turns into a 2-sentence summary and feed only that into the system prompt.

Keep the memory lean. The agent only needs to know enough to not ask "What's your name?" every two minutes.

### The Escape Hatch: Tools and Human Escalation

The biggest mistake founders make with AI agents is pretending the bot knows everything. 

In this voice agent build, the LLM had clear tool-calling boundaries. Need to solve a math problem? Don't let the LLM guess the arithmetic—hand it off to a deterministic calculation tool. Is the student getting frustrated or asking something outside the safety guardrails? Trigger an outbound escalation hook to a human tutor.

An AI voice agent shouldn't be a closed loop. It should be the front desk that handles 80% of the repetitive queries instantly, and gracefully hands off the remaining 20% to specialists or external tools.

If you are hacking on voice tech right now, stop thinking about generic chatbots. Pick a specific, noisy problem, optimize your audio streaming pipeline for speed, and make sure the thing actually understands how real people speak.