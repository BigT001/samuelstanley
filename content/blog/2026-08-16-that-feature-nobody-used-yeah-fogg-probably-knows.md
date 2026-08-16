---
title: "That Feature Nobody Used? Yeah, Fogg Probably Knows Why."
date: "2026-08-16T10:20:11.303Z"
excerpt: "You pour your soul into a new feature, launch it, and then... nothing. Crickets. It's a pain every product builder in Nigeria knows. Turns out, there's a simple model that explains exactly why."
category: "Tech"
tags: ["Tech", "Innovation", "Digital", "Product Management", "UX", "Nigeria"]
image: "https://hackernoon.imgix.net/images/B3UwyP96RlRj4oMHtkpLT4igvlx2-g2f3a0d.png"
readTime: "5 min read"
sourceUrl: "https://hackernoon.com/ux-unpacked-using-the-fogg-behavior-model-to-diagnose-product-adoption?source=rss"
---

I swear, sometimes it feels like we're just throwing code at the wall, hoping something sticks. You spend sleepless nights debugging, refactoring, getting that perfect animation just right. Then you ship, maybe even pop a cheap bottle of palm wine, only to find out users are ignoring your masterpiece like it's a 'flash sale' notification from 2021.

Sound familiar? It's the story of countless features, even entire products, failing to gain traction. I was just reading this piece on Hackernoon about the Fogg Behavior Model, and man, it hit home. It’s so simple, yet it unlocks so much of the 'why' behind product adoption failures, especially when you're building for the unique challenges of the Nigerian market.

### The Problem Isn't Always Bad Code

Ribin Roy's article breaks down Dr. BJ Fogg's model, which basically says: A behavior happens only when Motivation, Ability, and a Prompt all align at the same moment. `B = MAP`. If any one of them is missing, nothing moves. No complexity, no hidden variables. Just these three.

This immediately got me thinking about all those apps I've built, or tried to build, where adoption was like pulling teeth from a lion. We often blame the market, the competition, or even the users. But what if we just misunderstood their motivation, overestimated their ability, or failed to give them the right nudge?

### Motivation: What Really Moves People Here?

The article talks about three types of motivation: internal desire, external reward, and context. For us building in Nigeria, this is crucial. You can't just slap a 'new feature' label on something and expect people to jump on it.

Think about the `sapa` struggle. That's a powerful motivator. If your app genuinely helps someone save money on data, or finds them a side hustle to escape `sapa`, that's an existing motivation you can tap into. Trying to *manufacture* motivation, like getting someone to use a complex budgeting app just because it's 'good for them,' when they're worried about their next meal, is a losing battle.

![Nigeria Scenes](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)
*The daily hustle creates unique motivations. Are we tapping into them?*

I remember building a little internal tool once that streamlined some reporting. Nobody used it until I tied it to performance bonuses. Suddenly, "context" and "external reward" kicked in. People moved. It's not about being manipulative, it's about connecting with what *already matters* to them.

### Ability: The Nigerian Gauntlet

This is where Fogg’s model truly shines a light on our local ecosystem. "Can I do this easily?" he asks. In Nigeria, 'easily' is a moving target.

*   **Time**: Does it take too long? Try navigating a slow 3G network in Owerri, or battling data costs in a major city. Every extra tap, every loading screen, adds 'time' and 'money' friction.
*   **Money**: Is it expensive? Data costs are a real barrier. An app that's heavy on bandwidth is immediately at a disadvantage.
*   **Physical effort**: Does it require too many clicks? Imagine a finance app that needs 10 steps to transfer money. Forget it. People will just use USSD or go to the nearest agent. The less mental energy, the better.
*   **Routine fit**: Does it disrupt their workflow? If your app makes me leave my existing flow for sending money or buying airtime, I'm out.

This is why simple, direct experiences win here. We can have all the fancy features, but if the 'ability' to use them is hindered by network, data, or sheer complexity, it's dead on arrival. Building for Akure, for Aba, for the person in a bus park in Gbagada – means building for low bandwidth, low memory devices, and varied digital literacy.

![Laptop with lines of code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)
*Sometimes the code works perfectly, but the environment doesn't.*

The easiest fix is almost always to reduce friction. I've personally seen features get adopted instantly just by pre-filling fields or reducing the number of confirmation screens. We developers love to build, but sometimes the best "feature" is what we *remove*.

### The Prompt: Nudging, Not Nagging

Even with high motivation and easy ability, nothing happens without a prompt. This is your trigger. But the article warns against being annoying, and man, do we know about annoying notifications here.

A well-timed, contextual prompt is gold. If someone just completed a payment, maybe prompt them to review the vendor. If they're low on airtime, suggest topping up. Not just a generic notification that gets lost in the flood of 'Good Morning!' messages.

The Fogg model even breaks prompts into Facilitators (high motivation, low ability), Signals (high motivation, high ability), and Sparks (low motivation, high ability). This distinction is critical. If your users are motivated but struggling (like trying to set up a complex profile), a step-by-step wizard (facilitator) is better than a simple notification (signal). If they're capable but just need a nudge (like a limited-time offer for a product they often browse), a 'spark' works.

### My Takeaway for Fellow Builders

The Fogg Model, with its `B = MAP` formula, is a mental shortcut I’m definitely baking into my product thinking now. It's a simple lens to look through when a feature isn't landing.

*   **Is the motivation truly there?** Are we connecting to an existing pain point or desire that resonates deeply with Nigerians?
*   **Is it unbelievably easy to use?** And I mean *unbelievably* easy, considering network, device, and digital literacy challenges. Can my mother in Jos use this? Can a trader in Onitsha navigate it quickly during a busy market day?
*   **Is the prompt timely and non-intrusive?** Are we guiding them or just spamming them?

This isn't just theory for Silicon Valley types. This is practical stuff that can save us countless hours, energy, and mental stress (and maybe even a few sleepless nights). Instead of just building, let's build *smarter*, with our users' reality firmly in focus.

Now, if you'll excuse me, I have to go review some of my 'dead' features through the Fogg lens. Maybe they just need a little adjustment, not a complete burial. And perhaps a cold drink, it's been a long day of thinking.

![Graph showing success](https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop)
*Plotting the path to user behavior requires understanding these critical axes.*