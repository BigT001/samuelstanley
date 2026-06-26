---
title: "Your Laptop is Not the Repo: Why I'm Sick of Cleaning Up Your Local Git Mess"
date: "2026-06-26T12:09:59.618Z"
excerpt: "A junior dev pushed their absolute path to a local directory in Jos into our main branch, and the build broke. Let's talk about why we need a hard wall between project context and local workstation noise."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fraw.githubusercontent.com%2Fagentprojectcontext%2Fapx%2Fmain%2Fassets%2Fdiagram.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/agentprojectcontext/global-context-belongs-outside-apc-4fg8"
---

My inverter started its low-battery warning beep around 2:00 AM last night in my Gbagada workspace. I was trying to push a critical hotfix before the batteries died completely and the house plunged into darkness. Right on cue, the build failed. 

Why? Because someone on the team had committed their local file paths and a personal API key into the main branch. The repository was trying to find a directory that only existed on a laptop sitting in a cold room in Jos. 

I had to sit there in the heat, trying to untangle their local environment setup from our codebase before my backup power died. This is exactly why we need to talk about the line between what travels with the code and what stays on your machine.

![A developer trying to debug local environment issues late at night](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Portability Rule: APC is for the Project

When we talk about building with modern AI tools, we keep hearing about context. Specifically, APC (Agent Project Context) is the portable context layer that stays inside your repository. 

Think of APC as the shared brain of the project. If a developer clones the repository from a bus terminal in Owerri or a shared hub in Akure, they should be able to run it immediately without asking you for a secret handshake or your personal config files. 

Good APC content is pure project identity:
- The shared roles your AI agents need to play.
- Reusable developer skills.
- The instructions in AGENTS.md that tell the system how the repository is structured.
- Project-level hints that every single contributor needs.

These are facts. They are dry, clean, and completely independent of who is sitting at the keyboard.

### APX Lives on Your Machine, Not in My Git History

On the other side of this hard line is APX. This is the local runtime and tooling layer. It is the muscle that makes APC useful, but it keeps its hands to itself. 

APX does not belong in the repository. It keeps all of its state under your home directory, tucked away in your user folder. Your personal API keys, your custom terminal aliases, your editor preferences, and your message logs belong there. 

When you start mixing these two, everything breaks. I don't need to see your local browser profile path in a pull request. I don't want to accidentally download your session transcripts when I do a git pull. And I definitely do not want your private keys ending up on a public GitHub repo because you forgot which file you added to the commit.

![Clean lines of code that shouldn't be cluttered with local paths](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### The Three Headaches of Git Pollution

If you do not enforce this boundary, you will run into three major issues:

First, portability dies. The moment a repository silently relies on one person's local setup to run, it stops being a shared project and becomes a personal hostage. 

Second, code reviews become a nightmare. Pull requests should be about logic and product decisions. Instead, they get cluttered with dozens of lines of local workstation baggage, making it impossible to spot actual bugs.

Third, secrets leak. It is the classic security nightmare. If you mix global and project context, eventually, someone is going to commit something they shouldn't.

### A Simple Test Before You Commit

Before you stage any file, ask yourself this simple question:

If a new developer clones this repo right now, do they need this file immediately to understand the project?

If the answer is yes, it belongs in APC. 
If the answer is no, keep it out.

A reviewer agent that every clone needs? Put it in APC.
Your personal OpenRouter API key? Keep it outside.
A shared hint telling the AI how to handle database migrations? APC.
Your local cache from the last test run? Definitely keep it outside.

This division makes our automation durable. It means we can build, test, and ship without worrying about whose machine the code was written on. Keep your local noise on your laptop, and let the repository carry only what matters to the product. Your team, and my inverter, will thank you.