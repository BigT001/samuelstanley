---
title: "Why your Go code breaks at 2 AM (and it’s not the NEPA switch)"
date: "2026-05-01T11:04:59.715Z"
excerpt: "We keep treating every variable like a generic string and then wonder why our production data looks like a bowl of scattered pepper soup. It’s time to stop the 'just use a string' laziness."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Fdev-to-uploads.s3.amazonaws.com%2Fuploads%2Farticles%2Fjzx0y02q9n4q1vm9gchv.png"
readTime: "4 min read"
sourceUrl: "https://dev.to/gabrielanhaia/domain-primitives-in-go-one-type-per-real-world-concept-2gja"
---

I’ve spent too many nights in a cold room in Jos, staring at a monitor and wondering why a payment that was supposed to be 5,000 Naira ended up being 5,000 Dollars in the database. When you’re building fintech products in Nigeria, these aren't just "bugs"—they are "call your lawyer" moments. 

The culprit is almost always the same: we are too obsessed with primitive types. We treat a UserID, a CurrencyCode, and a TransactionNote as the exact same thing—a string. If it has quotes around it, we’re happy. But the compiler doesn't care about your intentions; it only cares that the types match.

### The trap of the generic string

Think about the last time you wrote a function for transferring funds. You probably had five arguments, and four of them were strings. From, To, Currency, Note. It looks clean on your VS Code screen while you’re sipping a cold Maltina. 

Then, two weeks later, Sapa hits a user because the system swapped the "From" and "To" IDs. The compiler didn't blink because a string is a string. The "Just Use a String" philosophy is a debt you pay back with interest when the system scales. 

![A descriptive caption](https://images.unsplash.com/photo-1526304640581-d334cd06f69d?q=80&w=1200&auto=format&fit=crop)

In our ecosystem, where internet stability can be as unpredictable as a Danfo driver in Oshodi, we can't afford logic that relies on "hoping" the caller sends the right data in the right order. We need guarantees that don't depend on us being awake or caffeinated.

### Making every concept a type

The fix is something called Domain Primitives. The idea is dead simple: if it’s a real-world concept, it gets its own type. 

Instead of a generic string for an email, you create an Email type. It’s a struct with a single private field. You don't let anyone just "create" an email by typing quotes. They have to go through a constructor—a function that validates the data right there at the door. If the email doesn't have an "@" symbol or the domain is trash, the constructor throws an error.

Once that value is created, it’s "safe." Every other function in your system that asks for an "Email" type knows for a fact that it’s looking at a valid email. You don't have to re-validate it in the service layer, the repository layer, and the controller. You validate once at the edge, and the compiler protects you for the rest of the journey.

### Stop swapping your IDs

I’ve seen junior devs (and let’s be honest, seniors too) accidentally delete the wrong account because they swapped a UserID with an AdminID. When both are just strings, Go will let you pass them in any order you want. 

![Lines of code on a screen](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

But if you define a UserID type and an AdminID type, the compiler becomes your bodyguard. If you try to put an AdminID where a UserID belongs, the build fails. You catch the mistake while you’re still coding in your workstation in Gbagada, not when a frustrated customer is blowing up your support line.

### The "IsZero" safety net

One thing we often forget in Go is that every type has a zero value. For a string, it’s just an empty space. This is how "ghost" records end up in your database. 

By using domain primitives, you can add an IsZero method to your types. It gives you a clear, readable way to check if a value is actually there before you try to use it in a database query. It makes the code feel less like a collection of scripts and more like a solid engineering project.

### The cost of doing it right

People complain that this is "too much boilerplate." They say it’s faster to just use a string and move on. 

But I’ve learned that the time you save by not writing a constructor, you spend ten times over debugging a production issue on a Saturday morning when you’d rather be at a wedding. Building products that last requires a bit of discipline. 

![A person working on a laptop](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

In the Nigerian tech scene, we pride ourselves on the "hustle," but the best kind of hustle is the one that doesn't break under pressure. Whether you're building a small side project in Akure or the next big fintech in the heart of Lagos, give your types some respect. Your future self, the one who actually wants to sleep at night, will thank you.