---
title: "Stop Reusing Your Student Portal Password on Kuda"
date: "2026-08-05T16:02:12.834Z"
excerpt: "AI phishing templates, fake Chrome extensions, and credential stuffing are tearing through Nigerian campuses. Here is my breakdown of how these attacks work under the hood."
category: "Nigeria"
tags: ["Nigeria", "Africa", "Tech", "Startups"]
image: "https://h2g6j3q2.delivery.rocketcdn.me/wp-content/uploads/2026/07/IMG_9706.jpeg"
readTime: "4 min read"
sourceUrl: "https://www.techcityng.com/cybersecurity-threats-students-2026/"
---

A junior dev I mentor from FUTA sent me a screenshot of an email he got last week. It looked clean—styled with proper CSS, clean typography, official varsity branding, and a urgent call-to-action asking him to re-verify his portal credentials or miss his semester course registration. 

Five years ago, a scam email like that would be riddled with broken English, terrible formatting, and obvious giveaways. Today? Someone plugged a prompt into an LLM API, pulled the HTML template of a university portal, and generated a flawless phishing lure in 30 seconds.

![Coding setup](https://images.unsplash.com/photo-1517694712282-14f494bc6f0e?q=80&w=1200&auto=format&fit=crop)

Students in Nigeria are currently under heavy attack, and it is not hard to see why. Between trying to survive *Sapa*, searching for dollar-paying remote gigs, and rushing to meet assignment deadlines, the average undergrad is running on low sleep and high stress. Attackers know this and build vectors targeted right at that desperation.

## The LLM Phishing Pipeline

The biggest shift in 2026 is how cheap it has become to automate high-converting scams. Phishing is no longer a manual effort where someone types out bad emails one by one. 

Scammers use basic Python scripts to scrape student email directories, feed the names into an LLM to personalize the tone, and deploy clean Tailwind UI frontend clones hosted on cheap Vercel or Netlify subdomains. 

When an unsuspecting student clicks the link and types in their details, the credentials do not even hit a database—they get posted directly to a Telegram bot channel managed by the attacker. Simple, effective, and ridiculously cheap to run.

The same mechanism powers those "Federal Bursary Award 2026" and "Remote Tech Internship ($500/month)" links circulating in hostel WhatsApp groups. The moment a site asks for an "application fee" or demands your student portal login to verify your identity, the code behind that screen is almost certainly harvesting your inputs.

## Rogue Chrome Extensions and Fake AI Tools

Every student wants an edge. When assignments pile up, everyone starts looking for AI tools to summarize PDFs, generate citations, or rewrite draft papers.

I was inspecting a popular "Free AI Essay Helper" browser extension that a few students in Nsukka were sharing around. Under the hood, the extension did actually call an AI endpoint to generate text. But its `manifest.json` file requested permissions to read and change all data on every website visited.

![Lines of code](https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1200&auto=format&fit=crop)

In plain terms: the extension contained a background content script that listened for login forms. Whenever a user typed a password on any site, the script scraped `localStorage` and token headers, then silently piped them back to a remote server. You get a quick 200-word essay summary, and the dev behind the extension gets your session tokens. 

If you are installing browser extensions or third-party AI wrappers, inspect what permissions they ask for. If an essay summarizer wants access to your cookies and browser storage on all domains, uninstall it immediately.

## Credential Stuffing is Still Winning

Here is a common scenario: a student uses the password `Oluwaseun2024!` for their departmental blog, their main Gmail, their official school portal, and their fintech app like Kuda or Moniepoint.

Departmental sites in most Nigerian universities are notoriously insecure. Many are built by final-year students as project work, abandoned after graduation, and left running on outdated WordPress installs with zero security patches. 

When an attacker breaches one of these weak databases and dumps the plaintext passwords, they run automated credential stuffing scripts using tools like Python’s `requests` module. The script systematically tests that same email-password combination against popular portals, social media accounts, and banking endpoints. If you reuse passwords, one breached hobby site knocks down your entire digital life.

## How We Build Around This

If you are a developer building products for this demographic, we have to start building defensive defaults into our stacks:

*   **Ditch basic password auth where possible**: Move toward WebAuthn, passkeys, or at least enforce mandatory TOTP-based Multi-Factor Authentication (MFA).
*   **Rate-limit aggressively**: If your auth endpoints do not have strict IP rate-limiting and bot protection, you are making credential stuffing trivial for attackers.
*   **Educate on session security**: Remind users that public Wi-Fi at the campus library or local workstation means open unencrypted traffic unless they are running a trusted VPN.

For the students building and studying out there: get a password manager today, turn on 2FA across all your core accounts, and stop installing random Chrome extensions just because a WhatsApp broadcast recommended them. Cybercriminals are refining their stack—you need to upgrade yours too.