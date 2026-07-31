---
title: "The Undo Trap: Why Mutating State Always Comes Back to Haunt You"
date: "2026-07-31T08:31:48.856Z"
excerpt: "Ripping up five 'finished' rules just to support a simple undo feature hurts, but building on a cracked foundation hurts even worse."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2F8oev8410mkdwi02hfe45.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/thkim5937/traceroute-devlog-2-11kc"
---

Ripping out code you’ve already marked as "done" is one of the most frustrating feelings in software engineering. 

You sit back, check off five unit tests, and feel good about your progress. Then you try adding one tiny, seemingly harmless feature—like letting a user step back on a path they just drew—and the whole thing falls apart. 

That was the exact wall I slammed into mid-week while working through path-drawing logic. Everything was working on paper: starting paths, blocking overlapping colors, stopping self-crossing. But the second I tried to build an "undo" mechanism by clicking a previous cell, the architecture buckled.

![Developer working on code logic](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

## The Lie of Mutating State in Place

Up until that point, I had taken the easy route. Every time a click happened, I edited the game state directly in memory. Added a cell here, chopped one off there. Same object, sitting in the same place in memory, constantly being modified.

That works fine when your app only cares about *right now*. But an undo feature forces your app to care about *ten seconds ago*. 

If you’re quietly mutating the exact same object in place, there is no "ten seconds ago" left in memory. The past is erased. To fix it, I had to stop writing quick-and-dirty edits and refactor the core pattern: every single interaction now produces a completely new snapshot of the state, leaving the old snapshot intact.

It meant going back through five rules I thought were completely finished and rewriting their underlying data flow. I didn't want to do it. When you're coding on a limited power supply during a rainstorm in Akure, wasting battery re-writing working logic feels painful. But patching around a broken state model is just setting a trap for your future self.

![Lines of code on a screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

## Hidden Bugs and Grid Coordinate Humbling

The silver lining of doing a proper rewrite is that it forces you to inspect every corner of your data pipeline. During the refactor, I caught an invisible bug—a leftover empty entry lingering in the state array after specific backtracks. It wasn't breaking the rendering yet, but three weeks from now when state changes get animated, that ghost entry would have wasted two days of my life.

I also got thoroughly humbled by grid math. I spent almost an hour convinced that a self-intersection rule was broken, when in reality I was just misreading the grid coordinates off my own test output. 

Grid coordinates have a funny way of making you feel completely foolish once you finally trace the cell path step by step.

```
Expected: [2, 3] -> [2, 4] -> [3, 4]
Actual:   [2, 3] -> [3, 3] -> [3, 4]  <-- Misread index in test run
```

## Fix It Right or Fix It Twice

We also fixed a annoying visual artifact this week. The rejection "bounce back" animation was cutting off halfway through when a move failed, making the game look like it was freezing rather than explicitly telling the player "No, you can't go here." Switching from frame-skipping calculations to actual elapsed time tracking smoothed the whole thing out.

The week ended on a solid note: full automated builds and deployments are up, colorblind-friendly palettes are locked in for the grid, and all click rules are passing tests. Next up is level win logic.

The big lesson here was a simple one: when you realize your state foundation is cracked, don't try to smear quick-fix paste over it. Take the hit, rewrite the base layer, and keep moving. "No gree for anybody"—especially bad state architecture.