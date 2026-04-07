// ─── Blog Dummy Data ────────────────────────────────────────────────────────
// Replace with real CMS / markdown-based posts when ready.

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  content: string;
  featured?: boolean;
};

export const blogPosts: BlogPost[] = [
  {
    slug: "building-saas-next-js-2026",
    title: "Building a Production-Ready SaaS in 2026 with Next.js",
    excerpt:
      "A deep-dive into the architecture decisions, tooling choices, and deployment strategies that power modern SaaS applications built on the Next.js App Router.",
    date: "2026-04-05",
    readTime: "8 min read",
    category: "Engineering",
    tags: ["Next.js", "SaaS", "Architecture"],
    featured: true,
    content: `
## Introduction

Building a SaaS product in 2026 is simultaneously easier and more complex than ever before. The tooling has matured, but the surface area of decisions has expanded dramatically.

## The Stack That Works

After shipping multiple production SaaS products, here is the stack I trust:

- **Next.js 16** — App Router, Server Components, and Partial Prerendering
- **NestJS** — Typed, modular, testable backend API layer
- **PostgreSQL + Prisma** — Rock-solid relational storage with type-safe queries
- **Vercel** — Zero-config, branch previews, edge functions

## Architecture Principles

The single most important thing you can do is **design your database schema first**. Everything downstream — your API, your UI, your business logic — is a function of your data model.

## Deployment

Use Vercel for the frontend and a managed Postgres provider like Neon for the database. Set up GitHub Actions for CI, run your test suite on every PR, and never merge without a green build.

## Conclusion

Shipping fast doesn't mean shipping sloppy. With the right stack and disciplined architecture, you can go from zero to production in days without accruing technical debt.
    `,
  },
  {
    slug: "mastering-postgresql-indexes",
    title: "Mastering PostgreSQL Indexes: The Queries You Did Not Know Were Slow",
    excerpt:
      "Indexes are the single biggest lever you have over database performance. Learn the patterns that silently kill production apps and how to fix them.",
    date: "2026-03-28",
    readTime: "6 min read",
    category: "Database",
    tags: ["PostgreSQL", "Performance", "Backend"],
    featured: false,
    content: `
## Why Indexes Matter

A missing index on the wrong column can take a sub-millisecond query to 4 seconds at scale. I have seen it collapse a production app with 50,000 users.

## The Most Common Mistakes

1. **No index on foreign keys** — PostgreSQL does not auto-index FK columns.
2. **Indexing columns with low cardinality** — A boolean column is a terrible index candidate.
3. **Not using partial indexes** — Filter your index to only the rows that matter.

## Diagnosing Slow Queries

\`\`\`sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 42;
\`\`\`

Look for **Seq Scan** — that is the red flag. A proper index will show **Index Scan** instead.

## Conclusion

Make \`EXPLAIN ANALYZE\` your best friend. Run it on every query that touches more than a few thousand rows before you ship.
    `,
  },
  {
    slug: "ai-agents-real-world-products",
    title: "Integrating AI Agents into Real-World Products Without the Hype",
    excerpt:
      "Practical lessons from embedding AI into production software. What works, what fails, and what your users actually care about.",
    date: "2026-03-20",
    readTime: "7 min read",
    category: "AI",
    tags: ["AI", "Product", "LLMs"],
    featured: true,
    content: `
## The Gap Between Demo and Production

Every AI demo looks incredible. Production is a different story. The moment you expose an LLM to real users, you encounter edge cases the demo never hit.

## What Actually Works

- **Constrained outputs** — Give the model a strict format to respond in (JSON schema, for example).
- **Human-in-the-loop for high-stakes actions** — Never let the agent take irreversible actions autonomously.
- **Streaming responses** — Users tolerate latency far better when they see output appearing in real time.

## What Fails

- Trusting the model's math
- Long context windows without retrieval
- Skipping evals

## The Takeaway

AI is a powerful tool, not a magic wand. Use it to augment workflows, not replace careful engineering judgment.
    `,
  },
  {
    slug: "typescript-patterns-clean-code",
    title: "Five TypeScript Patterns That Make Your Codebase Dramatically Cleaner",
    excerpt:
      "TypeScript is more than type annotations. These five patterns, used consistently, produce codebases that are a joy to work in.",
    date: "2026-03-12",
    readTime: "5 min read",
    category: "TypeScript",
    tags: ["TypeScript", "Clean Code", "Patterns"],
    featured: false,
    content: `
## 1. Discriminated Unions

Model state explicitly. A discriminated union forces the call site to handle every case.

\`\`\`typescript
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: string };
\`\`\`

## 2. Branded Types

Prevent mixing IDs from different entity types at compile time.

\`\`\`typescript
type UserId = string & { readonly _brand: 'UserId' };
type OrderId = string & { readonly _brand: 'OrderId' };
\`\`\`

## 3. Exhaustive Checks

Ensure a switch statement handles every variant.

\`\`\`typescript
function assertNever(value: never): never {
  throw new Error(\`Unexpected value: \${value}\`);
}
\`\`\`

## 4. Utility Types as Documentation

Use \`Readonly\`, \`Partial\`, and \`Pick\` to express intent at the type level, not just in comments.

## 5. Const Assertions

Lock down literal types with \`as const\` to prevent accidental widening.

## Conclusion

TypeScript's type system is a communication tool. Use it to make the impossible states impossible.
    `,
  },
  {
    slug: "freelance-developer-pricing",
    title: "How I Price My Freelance Work as a Senior Full Stack Developer",
    excerpt:
      "Pricing freelance development work is an art as much as a science. Here is how I think about it, and the framework I use with every client.",
    date: "2026-03-04",
    readTime: "5 min read",
    category: "Business",
    tags: ["Freelance", "Business", "Career"],
    featured: false,
    content: `
## Hourly vs. Project-Based

I almost always prefer project-based pricing. Hourly rates create adversarial dynamics where the client watches the clock and you watch the meter. Project pricing aligns incentives.

## How to Scope

Break the project into phases. Charge a small discovery fee to produce the spec. This filters out time-wasters and ensures you both agree on what is being built before money changes hands.

## The Rule of Three

Whatever number you think is fair — triple it for new clients. You are not just selling code; you are selling your expertise, your time, your opportunity cost, and your reliability.

## Retainers

Once you have delivered a successful project, offer a monthly retainer for ongoing support and iterative work. Predictable recurring revenue is far more valuable than chasing new clients every month.

## Conclusion

Your rate communicates your value. Price low and clients assume low quality. Price confidently and clients assume expertise.
    `,
  },
  {
    slug: "docker-nextjs-production",
    title: "Dockerizing a Next.js App for Production: The Complete Guide",
    excerpt:
      "A step-by-step walkthrough of building a lean, production-grade Docker image for a Next.js application with proper multi-stage builds and caching.",
    date: "2026-02-22",
    readTime: "9 min read",
    category: "DevOps",
    tags: ["Docker", "DevOps", "Next.js"],
    featured: false,
    content: `
## Why Docker for Next.js?

Vercel is great, but not every project belongs on Vercel. Self-hosting gives you control over your infrastructure, costs, and data residency.

## The Multi-Stage Dockerfile

\`\`\`dockerfile
FROM node:22-alpine AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile

FROM node:22-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN pnpm build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV production
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
EXPOSE 3000
CMD ["node", "server.js"]
\`\`\`

## Key Optimisations

- Use \`output: 'standalone'\` in your \`next.config.ts\` to get a self-contained server bundle.
- Mount \`.next/cache\` as a Docker volume to preserve build cache between deploys.
- Use a \`.dockerignore\` to exclude \`node_modules\` and \`.git\`.

## Conclusion

A well-crafted Dockerfile gives you a production image under 200 MB that starts in under a second.
    `,
  },
];

export function getFeaturedPosts(): BlogPost[] {
  return blogPosts.filter((p) => p.featured);
}

export function getAllBlogPosts(): BlogPost[] {
  return blogPosts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
}

export function getBlogPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug);
}

export function getCategoryColor(category: string): string {
  const map: Record<string, string> = {
    Engineering: "#6b8cff",
    Database: "#4ecdc4",
    AI: "#9b7dff",
    TypeScript: "#5cb8ff",
    Business: "#febc2e",
    DevOps: "#ff7c5c",
  };
  return map[category] ?? "#ff4d4d";
}
