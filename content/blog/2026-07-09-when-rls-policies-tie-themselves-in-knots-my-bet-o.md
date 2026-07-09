---
title: "When RLS Policies Tie Themselves in Knots: My Bet on JWTs"
date: "2026-07-09T16:29:07.419Z"
excerpt: "Debugging database policies can feel like untying a Gordian knot, especially when Postgres decides to throw an 'infinite recursion' error. This one almost gave me sapa for real."
category: "Engineering"
tags: ["Engineering", "Development", "Code"]
image: "https://media2.dev.to/dynamic/image/width=1200,height=627,fit=cover,gravity=auto,format=auto/https%3A%2F%2Ftef-erp.vercel.app%2Fcovers%2Fdevto%2Fcover-50-typo.png"
readTime: "5 min read"
sourceUrl: "https://dev.to/michelfaure/rls-recursion-infinite-loop-why-i-gave-up-policies-and-bet-everything-on-a-jwt-custom-claims-hook-229h"
---

You know those moments when a seemingly simple change blows up your carefully crafted system? Yeah, I just had one of those. A one-liner, meant to give our new agent role in Akure some basic read access, suddenly brought down the whole reporting dashboard. Françoise from the Maisons-Laffitte branch was already on the phone, her voice carrying that "foreman tone" that meant trouble. "They can't see anything over there — is that normal?"

Normal? *Abeg*.

My screen was spitting out "infinite recursion detected in policy for relation 'user_roles', code 42P17." Postgres was screaming, and honestly, after a silent error last month that cost me two days of my life and a week's worth of sleep, I was almost grateful. When Postgres shouts, you listen.

![A developer lost in thought, facing a screen full of code.](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

### The Ghost in the Policy Machine

My first thought was, "A policy on `user_roles` that queries `user_roles`? Classic rookie mistake." Except, I knew my `user_roles` policy was clean. I'd scrubbed it three weeks ago. It was calling `auth.email()`, not itself. The recursion, like a stubborn kpalasa stain, was coming from somewhere else.

I felt like I was debugging with my brain full of garri. The database was saying the problem was in `user_roles`, but my `user_roles` policy was innocent. This is where the real trap lies: the diagnostic points you one way, but the actual problem is chilling somewhere else, sipping palm wine.

Turns out, the root cause wasn't a faulty policy. It was the structural consequence of how RLS (Row Level Security) plays with Postgres role membership inheritance. When I added `agent_readonly` to `authenticated` membership, it didn't just inherit table privileges. It inherited the *policy evaluation scope* of anything posted `TO authenticated`.

### The Loop That Almost Broke Me

Here’s the kicker: we had an `Admin write cours` policy (classic name, I know) on `public.cours` that did an `EXISTS (SELECT 1 FROM public.user_roles WHERE email = auth.email() AND role IN ('admin', 'super_admin'))`. This policy, posted `TO authenticated`, now got evaluated for `agent_readonly` too.

So, when `agent_readonly` tried to read `user_roles` (because of the `Admin write cours` policy), Postgres then applied *its own* `user_roles` policies — which were also posted `TO authenticated`, and thus inherited by `agent_readonly` — and *those* contained an `EXISTS (SELECT FROM user_roles)` through that other table.

Boom. Loop closed. Infinite recursion. My head was spinning faster than a keke on a Lagos highway.

![Close-up of lines of code, illustrating complexity.](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

This wasn't a writing bug. This was a design flaw in how I'd coupled RLS with Postgres's role inheritance. As long as any `authenticated` role could, through *any* permissive policy path, fall back onto a read of `user_roles` that itself applied policies, the loop was possible. Cleaning it in one place just meant it'd pop up somewhere else, like whack-a-mole.

### Three Exits, One True Path

I explored three ways out of this mess.

1.  **`SECURITY DEFINER` Functions**: This involves wrapping the `user_roles` read in a function that runs with its owner's privileges, effectively bypassing RLS within its body. My other policies would then call this function instead of directly querying `user_roles`. It’s a quick fix that gets things working *now*. But oh, the technical debt. Six months down the line, when someone asks which policy reads what, and you've got opaque functions hiding the real permissions? That's premium debt, the kind that costs you more than money. I kept it for two weeks, feeling the weight of future problems.

2.  **Role Isolation**: This meant removing `agent_readonly` from `authenticated` membership and writing dedicated, hyper-specific policies per table, per role. For a very narrow, technical role, this might hold. But for a dashboard where all authenticated users must see data according to *their* specific roles? That doesn't scale. You'd be duplicating policies until your fingers hurt and your sanity ran thin. Who has time for that when you’re managing deployments across different states and trying to keep the team motivated with tight deadlines?

3.  **The JWT Bet**: If the role inheritance was the problem, why keep roles in the database at all for RLS evaluation? The solution? Pull the role out of the database completely. Push it into the JWT as a custom claim.

This was the switch. Let the application layer decide what role a user *is* when they log in and issue a JWT with that claim. Then, let the database policies simply check `auth.jwt() ->> 'role'` instead of querying `user_roles`. This decouples role management from Postgres's internal policy evaluation system. No more recursive loops because the database isn't trying to evaluate policies on a table that defines the very role it's evaluating.

It feels cleaner, more robust. Less chance of another sapa-inducing bug hiding in the shadows while we're trying to onboard vendors from Kano. The database becomes a gatekeeper for *what* you can do based on *who* you are (according to your JWT), not an interpreter of your identity.

![A bustling street scene in Nigeria, symbolizing active operations and diverse users.](https://images.unsplash.com/photo-1550005810-ca9161a0215a?q=80&w=1200&auto=format&fit=crop)

Sometimes, the simplest-looking database features hide the most intricate traps. This RLS journey taught me that tightly coupled systems, however elegant on paper, can become a nightmare when inherited permissions get involved. Offloading that role logic to the JWT? Best decision. Now, back to tackling those UI bugs for the new app update, before the network decides to mess things up again.