---
title: "Skip the Warehouse: Why Glovo’s Leapfrog Theory Actually Makes Sense to a Dev"
date: "2026-05-27T21:04:58.102Z"
excerpt: "Everyone is trying to build Amazon for Africa, but maybe the neighborhood shop was the real API all along. Let's talk about why quick commerce is the actual hard problem we need to solve."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://c76c7bbc41.mjedge.net/wp-content/uploads/tc/2026/05/dima-glovo-tap-1024x563.png"
readTime: "4 min read"
sourceUrl: "https://techcabal.com/2026/05/27/glovo-thinks-africa-will-skip-traditional-e-commerce/"
---

If you’ve ever tried to explain to a dispatch rider that "the blue gate next to the yellow kiosk with the sleeping dog" is your actual delivery address, you already know why traditional e-commerce in Nigeria feels like trying to run Docker on a 2GB RAM machine. The infrastructure is fighting you at every turn.

Glovo's regional GM, Dima Rasnovsky, thinks Africa is going to bypass the massive, warehouse-heavy e-commerce model that Europe and the US spent decades perfecting. He thinks we are leaping straight to quick commerce—hyperlocal, neighborhood-driven delivery. 

Honestly? I think he’s onto something.

Think about how we bypassed desktops. In Akure or Gbagada, most people’s first interaction with the internet was on a cheap Android phone. We didn't wait for landlines or bulky PCs; we built around our mobile-first reality. Traditional e-commerce wants us to wait two to three days for a parcel to leave a massive warehouse in Shagamu, crawl through gridlocked expressways, and eventually find its way to our doors. But our economic heartbeat is already hyper-local.

The neighborhood kiosk is the real distribution center.

### Building the API for the Corner Shop

The real engineering hurdle here isn't the delivery rider; it’s the merchant. How do you integrate a neighborhood store that doesn't even use a point-of-sale system into a real-time digital inventory? 

If I'm building a platform for a local pharmacy in Jos or an electronics merchant in Onitsha, I can't expect them to manage a complex admin dashboard. Their inventory is in their head or on a paper ledger. If the app says they have three bottles of a specific syrup, but they sold the last one five minutes ago to a walk-in customer, the user experience breaks instantly. 

![Writing code for lightweight apps that survive bad network connections](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

We need lightweight, offline-first syncing. We need databases that can handle intermittent internet connections without corrupting state. If the merchant's phone goes offline because of a power cut, the app should gracefully degrade, estimate stock based on historical sales, and sync the moment the network comes back. 

### The Hard Math of the 2-Kilometer Radius

Let's talk about the math, because at the end of the day, code has to pay for the fuel. 

"Profitability is a side effect of volume," Rasnovsky says. This is pure facts. But volume in our cities is a function of density, not distance. 

If a rider has to navigate the insane traffic near Onitsha main market just to deliver one item across town, the fuel cost eats the entire margin. Sapa is real, and customers will delete your app the moment delivery fees spike. But if you can squeeze ten deliveries into a single Gbagada estate within a 1.5km radius, the unit economics suddenly make sense.

![Crunching the numbers on unit economics for local delivery routes](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

As developers, we need to design routing algorithms that prioritize localized clusters over long-haul trips. We should be grouping orders dynamically, not just by "first come, first served," but by real-time corridor mapping. If rider A is already at a store picking up bread, the system needs to instantly bundle the paracetamol order from the pharmacy next door going to the same apartment block.

### No Gree for the GPS

We also have to stop pretending standard geocoding works perfectly here. Standard mapping tools struggle with our informal addresses. 

Building tech that actually works in Nigerian cities means writing custom routing logic that leverages local landmarks. Maybe we need to let users pin their locations and attach a short voice note for the rider, or save "micro-directions" that bypass the broken turn-by-turn navigation of standard map APIs. 

It is a tough, low-margin space. We saw Jumia Food exit, and we’ve watched local players struggle to keep their heads above water. But the answer isn't to build bigger warehouses on the outskirts of town. The answer is to write better software that connects the dots between the merchants who are already sitting right next to the customers. 

The infrastructure is already on the ground. We just need to write the code that connects it.