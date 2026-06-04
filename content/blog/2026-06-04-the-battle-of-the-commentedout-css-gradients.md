---
title: "The Battle of the Commented-Out CSS Gradients"
date: "2026-06-04T12:43:22.720Z"
excerpt: "We have all been there: staring at ten different shades of dark blue linear gradients while hoping our CSS grid doesn't break on a mobile viewport. Let's talk about the reality of building lightweight e-commerce."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fe2zza8bherh9u6rq0od3.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/deva_i_932c8869ada96d4c9f/product-card-like-e-commerce-website-2aha"
---

I had a massive grin on my face looking at this codebase. It wasn't because of the JavaScript loop or the API calls. It was those commented-out CSS linear-gradient lines in the card styles. 

Anyone who has ever spent three hours at 2:00 AM trying to decide if their product card should look like Amazon Dark Mode, a high-end luxury portal, or a cyberpunk dashboard knows exactly what went down here. You try one background gradient, it looks too purple. You try another, it clashes with the yellow text. You finally settle on a deep dark blue-grey, but you leave the other ten options commented out just in case you change your mind tomorrow.

It is the universal developer experience. We build, we tweak, we obsess over details that the end-user might not even notice.

![A developer's workspace with a laptop open on code](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Fake Store API Rite of Passage

Using the Fake Store API is a rite of passage. When you are moving past basic "Hello World" scripts and trying to understand how to handle async-await, fetch real data, and map it to the DOM, this API is your best friend. 

The approach here is as vanilla as it gets. You fetch the products, loop through the array with a forEach, programmatically create the HTML elements (the divs, headings, images, and paragraphs), assign the content, append them to the DOM, and let CSS Grid handle the responsiveness. 

It works. It is clean. But if we are building for the real-world market here, we need to talk about where this approach starts to show some cracks.

### Designing for Infinix Screens in the Afternoon Sun

Let’s look at the visual choices. The developer went with a dark, rich gradient for the cards, white and light grey text, and a vibrant yellow-orange color for the product titles. 

If you are sitting in a cool, air-conditioned co-working space in Gbagada with a high-end monitor, this dark aesthetic looks incredibly sleek. 

But take that same interface outside. Imagine a customer walking through the open-air markets in Onitsha or standing at a bus park in Owerri under the blazing noon sun, trying to buy a phone charger or a pair of shoes. They are looking at a mid-range Infinix or Tecno screen with the brightness cranked up, fighting intense glare. 

High-contrast dark cards with busy gradients and small, light-grey text become incredibly hard to read in those environments. For local e-commerce, flat white backgrounds, dark bold text, and highly visible primary buttons usually win the day. It might feel less "designer-esque," but it gets the job done when visibility is poor.

![A busy street scene with everyday hustle](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

### The Cost of Client-Side Fetching on Airtel 3G

Now, let’s talk about performance. The script relies entirely on client-side rendering. When a user hits the page, they get a blank HTML skeleton. The browser then has to download the JS file, execute it, make a network request to an external API, wait for the response, parse the JSON, and then loop through the items to build the DOM node-by-node.

In Akure, or anywhere else where network speeds can randomly drop from 4G to a crawling Edge connection, this lag is painful. 

While the user is waiting for the fetch to resolve, they are staring at a completely blank screen. If the connection drops midway, they get nothing.

If you are building a real e-commerce platform that needs to convert visitors into paying customers, you want to avoid this setup. Ideally, you want to pre-render that product data on the server side or static-site generator, so the user gets the fully formed product cards instantly, even if their network is having a bad day. 

If you must do it on the client side, always design a loading state or some simple skeleton cards. Never leave your user guessing whether your app is loading or just broken.

### Appending to the DOM in a Loop

Another minor detail that catches my eye is appending each new division directly to the document body inside the loop. 

Every time you call `document.body.appendChild()`, the browser has to do some work to recalculate the layout and repaint the screen. Doing this twenty times in a fast loop is fine for a small demo, but if you have a catalog of hundreds of items, it can make the page stutter.

A better habit to form early on is using a Document Fragment. You create a virtual container in memory, dump all your new product cards into that container inside the loop, and then append that single container to the DOM once. The browser only repaints once. It is a tiny tweak that makes your web pages feel much snappier.

At the end of the day, seeing raw vanilla JS implementations like this makes me happy. It proves you don't need a heavy framework like React or Next.js to start building functional interfaces. You just need some HTML, CSS, a fetch call, and the willingness to experiment with a dozen different gradients until you find the one that feels right.