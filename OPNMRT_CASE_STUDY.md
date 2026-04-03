OPNMRT: Project Summary

**OPNMRT** is a robust, multi-tenant e-commerce SaaS platform that functions as an intelligent "storefront engine." Unlike traditional centralized marketplaces (like Amazon) that act as an intermediary, OPNMRT empowers independent sellers to build and manage their own branded storefronts while providing buyers with a seamless, account-driven shopping experience. 

At its core, it is a business intelligence and infrastructure software focusing on direct-to-seller interactions, AI-powered insights, and strict data isolation.

### 1. Core Architecture & Philosophy
- **Multi-Tenant Model:** A single application serves all sellers securely. However, data is strictly isolated at the database level using `tenantId` / `storeId`. 
- **Routing & Domains:** Stores are accessed via subdomains (e.g., `storename.opnmrt.com`) or custom domains connected by the seller. Next.js middleware and NestJS interceptors seamlessly resolve the active tenant from the request domain.
- **Monorepo Structure:** The project uses a monorepo approach (via `pnpm` workspaces), dividing responsibilities into distinct packages, most notably:
  - `apps/web`: The Next.js frontend.
  - `apps/api`: The NestJS backend.
  - `packages/shared` (`@opnmrt/shared`): Unified TypeScript interfaces, Zod validation schemas, and utilities used cohesively across the stack.

### 2. User Experiences & Roles
The platform is designed around three primary user personas:

- **Sellers (Tenants):** Sellers have full ownership over their brand, products, pricing, and customers. Their dashboard provides comprehensive tools for order fulfillment, inventory management with low-stock alerts, and advanced sales analytics.
- **Buyers:** Buyers enjoy a modern, mobile-first shopping experience. They create accounts scoped simply per store (or platform), tracking their order history, spending metrics, and communicating directly with sellers through an integrated simple chat system to build trust.
- **Super-Admins (Platform Owners):** Admins maintain global governance. Their dashboard allows them to monitor the health of all stores, moderate content, access buyer-seller dispute chats, and manage platform-wide metrics.

### 3. Payment Model: Bring Your Own Keys (BYOK)
One of OPNMRT's most distinguishing features is its payment flow:
- **No Escrow:** The platform does not hold funds, take commissions on sales, or manage payouts. 
- **Direct P2P Payments:** Sellers securely integrate their own payment gateway API keys (e.g., **Paystack**, **Flutterwave**). When a buyer makes a purchase, the money flows *directly* to the seller's merchant account. 
- OPNMRT strictly handles the infrastructure, cart logic, and metadata tracking without touching the actual funds.

### 4. AI-Powered Assistant (MVP Scope)
The platform integrates advanced AI capabilities (such as the Gemini API or OpenAI) to function as an intelligent "Storefront Assistant" for sellers:
- **Content Generation:** Automatically writes compelling product descriptions.
- **Business Intelligence:** Translates raw analytics into plain-English sales and performance insights.
- **Inventory Forecasting:** Predicts stock run-outs and intelligently recommends restock timelines.
- **Privacy-First:** The AI models only consume pre-aggregated, anonymized data to ensure strict tenant data privacy.

### 5. Hyper-Local Logistics with Radar
Traditional delivery systems ignore the nuances of local geography. I built **Radar** to match merchants with rider pools specifically filtered by Local Government Area (LGA). 
This pairs merchants with delivery riders from their immediate vicinity. By avoiding cross-city dispatch errors, I ensured sub-hour turnarounds while lowering the overall carbon footprint per delivery.
> "Logistics must be hyper-local. Global mapping solutions often fail the last-mile test in emerging markets."

### 6. The Technical Stack
OPNMRT is built using a modern, scalable, and highly performant full-stack architecture:
- **Frontend:** Next.js (App Router), styled with Tailwind CSS, shadcn/ui, Radix UI, and Framer Motion for premium aesthetics. State is managed via React Query (server) and Zustand (client).
- **Backend:** NestJS (Node.js) using Modular, Domain-Driven Design. It exposes a deeply segmented REST API (Public, Seller, Buyer, Admin).
- **Database Layer:** PostgreSQL managed via Prisma ORM (enforcing strict tenant isolation). Redis is utilized for caching session data, AI insights, and rate-limiting.
- **Real-time & Events:** Event-driven side effects (`ORDER_CREATED`, `STOCK_UPDATED`) using WebSockets (Socket.IO), Redis Pub/Sub, and background cron jobs.

### 7. Monetization / Pricing Model
The platform monetizes via software subscriptions rather than transaction fees:
- **Free Tier:** Allows platform subdomain usage, basic analytics, and a limited product count.
- **Paid Tier:** Unlocks custom domains, unlimited products, advanced AI assistant features, and priority support.

---

Summary Conclusion
**OPNMRT** is an extremely sophisticated commerce operating system. It elegantly marries the ease of setup found in modern SaaS platforms with the operational independence and lack of fee-sharing found in self-hosted solutions. With built-in AI intelligence, a robust Event-Driven NestJS/Next.js stack, and direct BYOK payment routing, it is built to scale high-end, independent retail operations seamlessly.
