---
title: "The 'Everything App' Trap: Why One Plus One Often Equals Zero"
date: "2026-04-10T14:52:54.777Z"
excerpt: "I was just reading about Safaricom’s new My OneApp launch, and it's a painful reminder that even the biggest giants can stumble when they try to force too many features into one screen."
category: "Product Development"
tags: ["Nigeria", "Africa", "Tech", "Safaricom", "Fintech"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/04/myone-app-launch.webp"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/04/10/%f0%9f%91%a8%f0%9f%8f%bf%f0%9f%9a%80techcabal-daily-my-oneapp-zero-access/"
---

I’ve spent enough time staring at VS Code until my eyes hurt to know one thing: users don’t care about your "grand vision" if they can’t log in. 

I was catching up on the news today and saw that Safaricom just dropped "My OneApp" in Kenya. The idea is to merge M-PESA and their main service app into one "super app." On paper, it sounds like a dream for a product manager—one place to track everything, one UI to maintain, and total control over the user journey.

But in reality? It sounds like a headache. Only a week in, and people are already getting locked out.

### The Login is the Most Important Feature

As a developer, I know the pressure of a big launch. You’re checking your CI/CD pipelines, making sure the database scaling is handled, and praying the API doesn't choke. But if the authentication flow breaks, you’ve already lost. 

![Lines of code represent the complexity behind these apps](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

When you try to merge two massive, legacy systems into one "Everything App," you aren't just merging code. You’re merging different auth protocols, different user databases, and different sets of bugs. Safaricom wants to replace two core platforms in six months. Honestly? That feels like trying to change the tires on a danfo while it’s doing 100km/h on the Third Mainland Bridge. It’s risky, and the users are the ones feeling the bumps.

### Why Are We Obsessed With Super Apps?

I see this in Nigeria all the time. Every bank app now wants to sell me insurance, show me movie tickets, and help me book a flight to Abuja. I just want to send 5k to my guy for suya without the app crashing or asking me to "verify my identity" for the tenth time this morning.

We’re obsessed with the WeChat model, but we forget that WeChat grew in a very specific environment. Over here, our internet is spotty, our phones sometimes run out of storage, and our patience is thin because we're already dealing with enough "wahala" daily. 

Chukwuemeka Mbachu hit the nail on the head in the TechCabal piece: "Scale without clarity is just noise." He’s right. If I have to navigate five menus just to find the "Send Money" button because you wanted to show me a banner for an investment product I didn't ask for, the UX has failed.

### Building for Real Life

When I’m building products, I try to think about the guy standing in a crowded market in Lagos, trying to make a quick payment while someone is shouting behind him. He doesn't want a "lifestyle partner" in his pocket; he wants a tool that works.

![The reality of building for a busy, mobile-first environment](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

The "Everything App" goal is usually about the company wanting more data, not about the user wanting more features. By putting everything in one place, Safaricom can see every move a user makes. That’s great for their bottom line, but if the app is too heavy or the login fails, users will just go back to USID codes or—heaven forbid—physical cash.

### Keep It Simple, Abeg

If Safaricom, with all their billions, is struggling with a "smooth first impression" for a merged app, it should be a lesson for the rest of us. 

Complexity is the enemy of reliability. I’d much rather have three apps that work perfectly every single time than one "super app" that leaves me stranded because of a "login failure." 

Let’s focus on making things work before we make them "everything." I'm going to get back to my own bugs now—hopefully, mine aren't as public as Safaricom's today.