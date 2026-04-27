---
title: "Why I’m Still Putting Myself Through the Arch Linux Ritual"
date: "2026-04-27T11:43:39.291Z"
excerpt: "Setting up a fresh Arch install is a rite of passage that feels like moving into a new apartment in Ibadan—empty, echoing, but full of potential."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fzcjfon522tbpe0es2n28.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/natorsc/pos-instalacao-do-arch-linux-4k6g"
---

My laptop screen just flickered back to life with that terrifyingly blank TTY prompt. There’s a specific kind of adrenaline you get from a fresh Arch Linux install. It’s like moving into a new apartment in Ibadan—everything is empty, the walls need painting, and you’re wondering if you should have just stayed where you were. But once you start running those initial commands, it starts feeling like home.

I was looking at a post-installation breakdown recently, and it reminded me of how much we take for granted in our dev environments. Most people just want a browser, but for me, it’s about the piping. Getting the noto-fonts right is the first thing I do. If the typography looks like garbage while I’m staring at code for ten hours, I’m going to have a bad time. I need those CJK and emoji fonts because, let’s be honest, half of my Slack communication is just the "eyes" emoji.

![A laptop screen showing complex lines of code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

Doing this in a place like Akure, where you’re balancing your power bank charge against the time it takes to download a few gigabytes of Flatpaks, makes you very selective. I saw the guide mentions heavy hitters like Libvirt and Gnome Boxes. I used to be heavy on VMs for testing, but these days I’m leaning more into Podman. It’s lighter. When my laptop fan starts sounding like a generator in an Owerri market, I know I’ve pushed the virtualization too far. Keeping the system lean is a survival skill when you don't want your hardware to throttle in the heat.

The Python section of any setup guide always gets me thinking. Seeing "uv" on the list makes me happy. It’s significantly faster than traditional pip, and when you’re dealing with "Sapa" and every megabyte of data counts, having a tool that handles dependencies efficiently is a lifesaver. I’m moving all my projects over to uv and poetry. No gree for slow builds this year.

![A vibrant scene from a busy Nigerian street](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

Then there’s the editor debate. I’ve been trying to give Zed a real shot lately. It’s built in Rust, it’s snappy, and it doesn't eat RAM like Chrome at a buffet. But I still keep VS Code around because the extensions are just too good to leave behind. It’s like having a favorite spot for Suya—you might try new places, but you know exactly which one hits the spot every time you’re actually hungry.

![A person typing on a laptop in a dimly lit room](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

You can’t talk Arch without the AUR. Whether you’re using yay or paru, it’s the secret sauce. Being able to pull basically any piece of software without hunting for a random .deb file or some broken PPA is why I stick with this distro, despite the occasional "I broke my kernel" headache on a Tuesday morning. It's about that control. I want to know exactly what is running on my machine, from the Bluetooth service to the power profiles. 

Setting this all up is a chore, yeah, but it’s my chore. It’s the digital equivalent of sweeping your yard before the sun gets too high in the sky. Once the environment is set, I can finally get back to the actual work of building things.