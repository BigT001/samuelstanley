# 🛡️ AI Agent Prompt: OPNMRT Telemetry & SRE Integration Guide

Copy and paste the prompt block below directly into any AI Coding Assistant (such as Claude, Gemini, GPT, or Cursor) working on the **opnmrt** codebase (`www.opnmrt.com`) to integrate real-time site reliability and user activity monitoring.

---

### Copy and Paste this Prompt into the OPNMRT Assistant:

```markdown
You are an expert Frontend/Full Stack Developer. I need your help to integrate PROmonitor SRE Client Telemetry monitoring into our OPNMRT codebase.

PROmonitor is a real-time site reliability engineering workspace. To register and monitor OPNMRT, we must load the PROmonitor telemetry SDK script globally and configure it with our unique client key.

Here are the integration specifications:

### 1. Identify Entry Layout File
Locate the root layout file of this project:
- If this is a Next.js App Router project: `app/layout.tsx` (or `app/layout.js`)
- If Next.js Pages Router: `pages/_document.tsx` (or `pages/_document.js` / `pages/_app.tsx`)
- If standard HTML or other single-page app framework: `index.html` or equivalent main layout template.

### 2. Inject SDK Script Tag
Load the PROmonitor Telemetry script dynamically in the layout template. The production script is hosted at:
`https://samuelstanley.com/monitor-sdk.js`

We want to feed the telemetry client key dynamically using an environment variable (`NEXT_PUBLIC_PROMONITOR_KEY` or appropriate prefix depending on the framework).

**Next.js script example:**
```typescript
import Script from "next/script";

// Inside the root layout html/body tag:
{process.env.NEXT_PUBLIC_PROMONITOR_KEY && (
  <Script 
    id="promonitor-telemetry-sdk" 
    src="https://samuelstanley.com/monitor-sdk.js" 
    data-key={process.env.NEXT_PUBLIC_PROMONITOR_KEY}
    strategy="afterInteractive"
  />
)}
```

**Pure HTML example:**
```html
<script src="https://samuelstanley.com/monitor-sdk.js" data-key="cs_b07d3a798b723c1eef16f8ad3ecdbcafd6a48bed628b262d" async></script>
```

### 3. Setup Client Environment Variable
Add the following key to OPNMRT's `.env`, `.env.local` and `.env.example` configurations:
```env
# PROmonitor Client key for OPNMRT integration
NEXT_PUBLIC_PROMONITOR_KEY=cs_b07d3a798b723c1eef16f8ad3ecdbcafd6a48bed628b262d
```

### 4. Expose Logger Utility Helpers
Create a logger helper utility (e.g. `lib/logger.ts` or helper modules) so we can manually log custom transactions, user registrations, checkout events, or API logs:
```typescript
/**
 * PROmonitor custom logging interface
 */
export const logger = {
  info: (message: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.info(message, metadata);
    } else {
      console.log("[PROmonitor Info]:", message, metadata);
    }
  },
  warn: (message: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.warn(message, metadata);
    } else {
      console.warn("[PROmonitor Warn]:", message, metadata);
    }
  },
  error: (message: string, error?: Error | any, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.error(message, error, metadata);
    } else {
      console.error("[PROmonitor Error]:", message, error, metadata);
    }
  }
};
```

### 5. Verify Ingestion
Verify that unhandled exceptions, browser console warnings, Core Web Vitals metric events, and click actions are automatically streamed to the dashboard. Expose a temporary button or link to verify correct transmission:
```typescript
const handleTestError = () => {
  throw new Error("OPNMRT PROmonitor Test Crash: Telemetry verified successfully!");
};
```

Please proceed with integration, confirm the layouts compile, and that no build checks are broken. Let me know when you have completed this step.
```
