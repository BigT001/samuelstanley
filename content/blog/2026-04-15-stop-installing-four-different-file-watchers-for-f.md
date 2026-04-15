---
title: "Stop installing four different file watchers for four different languages"
date: "2026-04-15T15:09:32.513Z"
excerpt: "I’m tired of my node_modules folder weighing more than my car just to run a simple file watcher. Here is why one small Rust binary is better than a dozen ecosystem-specific tools."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2F59chkf3xhkxzb9b7rpnv.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/sendotltd/the-notify-crate-is-surprisingly-pleasant-i-built-a-cross-platform-file-watcher-in-four-7md"
---

Switching between a Python backend, a React frontend, and a bit of Rust systems work in a single afternoon is a recipe for a headache. Not because the code is hard, but because the tooling is so incredibly fragmented. If I’m in JS world, it’s nodemon. If I’m hacking away in Rust, it’s cargo-watch. If I’m doing some Python scripts, maybe it’s watchmedo. 

Honestly, my "No gree for anybody" mindset kicks in when I realize I’m wasting mental energy just remembering which CLI flags belong to which language-specific tool. Why do we need a different watcher for every ecosystem? It’s just files and commands.

I stumbled across a project called watch-exec that really hit home. It’s a tiny 10 MB binary built in Rust that does one thing: watches files and runs commands. No bloat, no 500MB node_modules folder, just a single file you can drop into a Makefile and forget about.

### The Hidden Complexity of "Just Watching Files"

Building something like this sounds easy until you actually try to do it. If you’ve ever sat in a quiet workstation in Enugu trying to get a build script to behave, you know the frustration of a tool that triggers ten times for a single save. 

![A clean workspace with a laptop showing code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

When you hit 'Save' in VSCode, the filesystem doesn't just send one "Hey, this changed" event. It sends a chaotic burst of them—metadata changes, temp file creations, renames. A naive watcher would try to restart your server twelve times in half a second. That's a great way to make your laptop fans sound like a generator in the middle of a power cut.

The real magic in a tool like watch-exec isn't in the code it has, but in the logic it uses to ignore the noise. It uses a "debounce" trick. It waits for the first event, then opens a small window of time to suck up every other event that follows before finally deciding to run your command once. It’s simple, elegant, and saves your CPU from unnecessary stress.

### Killing the Zombies

Another thing that usually breaks my flow is the "zombie process" problem. You change a file, the watcher triggers, but the old version of your app is still hanging onto the port. Now you have to manually find the PID and kill it. It's the kind of small friction that ruins a productive morning.

A good watcher needs to be an aggressive parent. It has to kill the child process immediately when a change is detected, wait for it to actually die, and then spawn the new one. Most of the "simple" scripts we write ourselves forget this part, leading to a mess of hung processes that eventually slow your machine to a crawl.

![Lines of code on a dark screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Why Small Binaries Matter in Nigeria

I think about the "Sapa" struggle—not just with money, but with data and bandwidth. Downloading a massive dev environment just to get a file watcher is overkill. When I’m working on a project, I want tools that are portable. I want a binary I can move around via a flash drive or a quick Telegram message if the internet is acting up. 

The fact that this tool is just 600 lines of Rust and uses only four dependencies (clap, notify, glob, and ctrlc) is beautiful. It’s proof that you don't need a massive framework to solve a real problem. 

We often overcomplicate our stacks because we think more features mean more value. But usually, the value is in the stuff you *don't* have to deal with. I don't want a "strategic platform for file observation." I want a tool that watches my .rs files, ignores the target folder so it doesn't loop forever, and runs my tests when I hit save. 

Next time you’re setting up a project, maybe skip the ecosystem-specific watchers. Go for something that doesn't care what language you're writing. It’s one less thing to think about when you’re deep in the zone, whether you're coding from a quiet corner in Jos or a busy hub in Lagos.