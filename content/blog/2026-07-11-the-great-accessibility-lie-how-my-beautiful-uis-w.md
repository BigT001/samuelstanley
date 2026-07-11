---
title: "The Great Accessibility Lie: How My Beautiful UIs Were Actually Broken"
date: "2026-07-11T07:38:18.028Z"
excerpt: "We love to brag about clean code and snappy animations, but a brutal reality check made me realize most of our 'perfect' frontend work is completely unusable for real people."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.us-east-2.amazonaws.com%2Fuploads%2Farticles%2Fa2456vblsjk0kyvc3or1.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/richardlemon/the-accessibility-audit-that-slapped-me-awake-2e1o"
---

I used to think my frontend game was top-tier. You know the feeling: you set up a clean React or Svelte project, style it with Tailwind, throw in some springy Framer Motion animations, and check the color contrast with a handy browser extension. You look at the lighthouse score, see a green 90+, and tell yourself you are a champion of the modern web. 

I was recently sitting in a quiet shared space in Gbagada, sipping cold water, and admiring a dashboard UI I had just polished. It felt smooth. It looked expensive. 

Then I read about a developer who got absolutely wrecked by a professional 43-page accessibility audit on a site they were incredibly proud of. It was a massive reality check. It made me look at my own open VS Code tabs and realize how much brittle, broken markup I have been shipping under the guise of "modern UI design."

We are all guilty of it. We design for our high-end MacBooks, our fast fiber connections, and our perfect eyesight. But the moment you take away the mouse, or turn on a screen reader, our beautiful layouts crumble like a bad batch of chin chin.

![Struggling with code late at night](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Modal Trap

One of the most humbling callouts from that audit was about a custom modal. We love custom modals. We build them with blurred backdrops, spring animations, and custom close buttons. 

The developer had implemented a "focus trap" using a standard utility. On paper, it worked. If you pressed Tab, your focus stayed inside the modal. But there was a catch. On smaller screen sizes, the close button's text label was visually hidden to save space, leaving only a tiny close icon. 

Because of some weird outline-offset styling combined with the layout, the browser's native focus ring on that icon button actually rendered outside the viewport. 

If you were navigating with a keyboard, you would tab into the modal, cycle through the input fields, and then... nothing. The focus went to the close button, but because the ring was off-screen, it looked like the interface had frozen. You were trapped in a UI dead-end. 

Since reading that, I have started doing something incredibly frustrating but necessary in my Gbagada workstation: I push my mouse to the far end of the desk, unplug my trackpad, and try to use my web apps using only the Tab, Shift+Tab, and Enter keys. 

Try it on your latest project. I guarantee you will get stuck within three clicks. 

### CSS Grid is Lying to Your Screen Reader

This is the big one. We have all used CSS Grid or Flexbox to change the visual layout of a page depending on screen size. 

On a desktop hero section, you want the headline and copy on the left, and a cool 3D product mockup on the right. But on mobile, you want that image to appear first. So, what do we do? We use the CSS order property, or we restructure the grid tracks. Visually, it looks perfect. 

But assistive technology like NVDA or VoiceOver does not care about your clever CSS. It obeys the DOM. 

When a screen reader parsed a layout built this way, the reading order went completely wild. It read the hero image, then some floating decorative badges, then skipped directly to the footer navigation, and only *then* did it read the actual headline and main copy. It sounded like a chaotic radio station changing frequencies.

We are basically treating the DOM like a junk drawer, relying on CSS to sort out the mess for the visual user. It is lazy engineering. 

![The complexity of modern web development](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

### Flipping the Script on My Workflow

In our local tech ecosystem, we often talk about building for "Sapa"—optimizing for low data, bad network connections, and cheap Android devices. We pride ourselves on performance because we know what it is like to load a heavy site on a unstable 3G connection in Akure or Owerri. 

But accessibility is the other half of that coin. What is the point of a page that loads in 0.5 seconds if a user who relies on keyboard navigation or text-to-speech cannot actually click the register button?

I am changing how I build. No more guessing. 

First, the DOM order is now the absolute source of truth. If I need to reorder things visually for mobile, I will rethink the layout design before I start hacking the visual order with CSS properties that lie to screen readers.

Second, I am turning on VoiceOver. It is annoying, it feels slow, and it highlights every single layout shortcut I took. But listening to your own site read aloud is the quickest way to realize where you messed up. 

We need to adopt a "no gree for anybody" mindset when it comes to code quality. Let us stop shipping pretty garbage that only works under perfect conditions. Unplug your mouse today and see what your code actually feels like.