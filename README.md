# Samuel Stanley — Full Stack Engineer

A professional, high-performance full-stack web and app developer portfolio built with **Next.js**, **TypeScript**, and **Framer Motion**, featuring a "Deep Space" aesthetic inspired by OpenClaw.ai.

![Samuel Stanley Logo](./app/icon.png)

## 🚀 Key Features

- **🛡️ PROmonitor Client Monitoring Workspace**: A fully featured virtual "Web OS" workstation located at `/os`. Includes draggable, resizable windows housing an Uptime Monitor, Log Terminal, Client Registry, Webhook Alert Settings, and AI Blog Agent.
- **Deep Space Aesthetic**: Custom starfield background with smooth, high-fidelity CSS animations.
- **Interactive Terminal**: A "Quick Start" terminal component for hiring managers and recruiters to quickly get in touch.
- **Project Showcase**: A structured, high-performance grid featuring major projects like **OPNMRT**, **EMPI Costumes**, and **Study Express UK**.
- **Smooth Scroll-Reveal**: Integrated IntersectionObserver system for premium, staggered animations on scroll.
- **Bilingual Themes**: Fully optimized "Deep Space" (Dark) and "Blueprint" (Light) modes with instant switching.
- **Global Reach**: Designed for remote-first collaboration with multi-timezone support and flexible hiring models.

## 🛠️ Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS v4-alpha, Framer Motion.
- **Backend**: Node.js, NestJS (in project examples), REST APIs, Prisma ORM, Supabase (PostgreSQL).
- **Database**: PostgreSQL, MongoDB, SQLite.
- **Infrastructure**: Vercel, Docker, CI/CD with GitHub Actions.
- **Integrations**: Discord/Slack Webhooks, Flutterwave, Paystack, Web3Forms, Canvas Confetti.

## 🛡️ PROmonitor Workstation Dashboard

Located at `/os`, this is a fully functional web-based operating system designed to manage and monitor clients' website health and logs in real-time.

### Features:
1. **Uptime & SSL Monitor:** Real-time HTTP pinging, response latency tracking, and SSL certificate expiration checks.
2. **Interactive Terminal Log Viewer:** Stream runtime warnings, errors, and fatal exceptions sent from client sites, with syntax coloring and stack trace expansions.
3. **🤖 SRE AI Diagnostics Engine:** Click to analyze any client-side JavaScript crash or error stack trace using Gemini LLMs. Returns an immediate SRE summary, root-cause analysis, and step-by-step code repair recommendations.
4. **Client Registry Manager:** CRUD operations for client websites, generating copyable SDK tags and unique API keys.
5. **Alert Settings:** Save Slack or Discord Webhooks to trigger instant channel alerts when a client website goes offline or reports fatal exceptions.
6. **AI Blog Content Agent Integration:** Control the portfolio's AI content agent writer directly from a desktop window.
7. **Mobile Responsive OS Fallback:** Drag-and-drop workspace on desktop that automatically adapts to a full-screen mobile app layout.

### Setup & Integration:
Client websites can easily integrate error-reporting by loading the lightweight SDK script from your portfolio domain:
```html
<script src="https://yourdomain.com/monitor-sdk.js" data-key="CLIENT_API_KEY" async></script>
```

#### Automatic Telemetry Captured:
When loaded on a client site, the telemetry SDK automatically logs the following activities under the **Terminal Logs** view:
- **Page Views & SPA Navigation:** Logs standard page loads and tracks routing page transitions (supporting Single Page Apps like React/Next.js).
- **User Action Breadcrumbs:** Captures element clicks (buttons, anchor links, form submissions) showing element IDs, class names, and button labels so you see exactly what the visitor clicked before an error occurred.
- **Developer Console Intercepts:** Intercepts runtime `console.warn` and `console.error` messages.
- **Uncaught Crash Reports:** Intercepts window-level exceptions and unhandled promise rejections.

---

## 📦 Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/BigT001/samuelstanley.git
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Run the development server:
   ```bash
   pnpm dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🏗️ Production Build

To generate an optimized production build:

```bash
pnpm build
pnpm start
```

## 📬 Get In Touch

Samuel is currently accepting offers for **project-based freelance work**, **remote engineering roles**, and **flexible hybrid positions**.

- **Email**: [info.samuelstanley@gmail.com](mailto:info.samuelstanley@gmail.com)
- **LinkedIn**: [Samuel Stanley](https://www.linkedin.com/in/samuel-stanley-345174234/)
- **Instagram**: [@samuel.g.stanley](https://www.instagram.com/samuel.g.stanley/)

---

© 2026 Samuel Stanley. Built with Next.js, TypeScript & passion.
