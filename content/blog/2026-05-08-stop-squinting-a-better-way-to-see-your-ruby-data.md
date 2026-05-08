---
title: "Stop Squinting: A Better Way to See Your Ruby Data"
date: "2026-05-08T15:26:52.883Z"
excerpt: "Debug logs shouldn't feel like a puzzle. I’m looking at a tiny Ruby gem that finally makes hash dumps readable without the usual bloat."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fuelen6xj6qt7yqpcb69t.jpg"
readTime: "4 min read"
sourceUrl: "https://dev.to/eayurt/i-built-a-ruby-gem-so-i-dont-have-to-squint-at-hash-dumps-anymore-2hha"
---

My eyes are tired. It is 11 PM in my Gbagada workspace, the fan is humming a low-key rhythm, and I am staring at a terminal screen that looks like a bowl of alphabet soup. If you have ever worked with Ruby, you know the pain of printing an array of hashes and getting a wall of curly braces, arrows, and colons that make your head spin. It’s a mess.

Usually, we reach for pretty-print or some heavy gem that promises to make things beautiful but ends up bringing twenty dependencies along for the ride. I don't always need colors or JSON parsing logic when I'm just trying to see if a score updated correctly in the database. I just need to see my data without the mental gymnastics.

### The Squinting Tax

The "typed_print" gem caught my eye because it addresses a very specific itch: turning those ugly hash dumps into clean, aligned tables. Think about it—when you have twenty rows of user data, you don't want to scan horizontally for every single attribute. You want a table. You want columns. 

![A descriptive caption](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

What’s impressive here isn’t that it does something revolutionary, but that it does one thing very well without any "magic." It takes your data and spits out a formatted table directly in your console. It handles strings, numbers, and booleans, and it even lets you align columns or pick which headers you actually want to see.

### Why "Zero Dependencies" Actually Matters

In the Nigerian tech space, we talk a lot about "No gree for anybody," but we should also talk about not letting our "vendor" folders gree for us. Every time I add a gem with ten dependencies, I’m adding ten more points of failure and ten more things to download when the internet decides to act up during a deployment.

The creator of this gem made a deliberate choice: zero required dependencies. It works in a plain Ruby script, a massive Rails app, or even a tiny Docker container running on a cheap VPS. It’s lightweight enough that you don't feel guilty adding it to a quick Rake task just to debug something on the fly. 

![A descriptive caption](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### Markdown for the Win

One feature that actually made me sit up was the Markdown output. If you’ve ever had to document an API response or show a sample of data in a GitHub README, you know the struggle of manually typing out pipes and dashes. This gem can output a proper Markdown table that you can just copy and paste. 

That’s the kind of "small win" that saves fifteen minutes of boring work. For someone building a CLI tool or managing a team where documentation is key, this is a lifesaver. It’s not about being fancy; it’s about being efficient so you can get back to the actual building.

### Shipping with Heart

I love the philosophy here. The developer mentioned shipping Markdown support within hours of a user request. That’s the "hustle" I recognize—listening to the community and iterating fast. Whether you're coding in a quiet corner of Akure or navigating the noise of a Lagos commute, we all appreciate tools that just work without asking for much in return.

![A descriptive caption](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

If you’re tired of the "pp" struggle and want your terminal to look like it belongs to a professional instead of a chaotic wizard, this is worth a look. It’s simple, it’s fast, and it doesn't try to be a "platform." It’s just a table. And sometimes, a table is all you need to keep your sanity.