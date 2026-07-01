# 🛡️ AI Agent Prompt: PROmonitor Telemetry & SRE Integration Guide

Copy and paste the prompt block below directly into any AI Coding Assistant (such as Claude, Gemini, GPT, or Cursor) working on another website project (like your `nextgenfashion` site) that you want to monitor.

---

### Copy and Paste this Prompt into your other AI Assistant:

```markdown
You are an expert Frontend/Full Stack Developer. I need your help to integrate PROmonitor SRE Client Telemetry monitoring into this codebase.

PROmonitor is a real-time site reliability engineering workspace. To register this website, we must load the PROmonitor telemetry SDK script globally and configure it with our unique API key.

Here are the requirements for the setup:

### 1. Identify Layout File
Locate the root layout file of this project (e.g., `app/layout.tsx` for Next.js App Router, `pages/_document.js` for Pages Router, `index.html` for pure HTML, or equivalent entry layout file).

### 2. Inject SDK Script Tag
Load the PROmonitor Telemetry script dynamically in the layout template. The script is hosted at:
`http://localhost:3000/monitor-sdk.js` (or replace with your production domain when deployed).

We need to supply our PROmonitor API key dynamically using an environment variable (e.g. `process.env.NEXT_PUBLIC_PROMONITOR_KEY` or direct config).

**Integration snippet structure (Next.js example):**
```typescript
import Script from "next/script";

// Inside your root layout body block:
{process.env.NEXT_PUBLIC_PROMONITOR_KEY && (
  <Script 
    id="promonitor-telemetry-sdk" 
    src="http://localhost:3000/monitor-sdk.js" 
    data-key={process.env.NEXT_PUBLIC_PROMONITOR_KEY}
    strategy="afterInteractive"
  />
)}
```

*(If this is a pure HTML file, insert a standard `<script src="http://localhost:3000/monitor-sdk.js" data-key="YOUR_API_KEY" async></script>` tag inside the `<head>`).*

### 3. Setup Client Environment Variable
Add the following key to this target site's `.env` and `.env.example` configurations:
```env
# PROmonitor Telemetry client key obtained from dashboard Client Registry
NEXT_PUBLIC_PROMONITOR_KEY=
```

### 4. Create Custom Activity Logs Helpers
Expose a utility wrapper (e.g., `lib/logger.ts` or helper file) to perform custom client-side event tracking (like payments, registrations, or api calls):
```typescript
/**
 * PROmonitor telemetry helper wrapper
 */
export const logger = {
  info: (message: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.info(message, metadata);
    } else {
      console.log("[PROmonitor Info Log]:", message, metadata);
    }
  },
  warn: (message: string, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.warn(message, metadata);
    } else {
      console.warn("[PROmonitor Warn Log]:", message, metadata);
    }
  },
  error: (message: string, error?: Error | any, metadata?: Record<string, any>) => {
    if (typeof window !== "undefined" && (window as any).PROmonitorLogger) {
      (window as any).PROmonitorLogger.error(message, error, metadata);
    } else {
      console.error("[PROmonitor Error Log]:", message, error, metadata);
    }
  }
};
```

### 5. Verify & Test Setup
Confirm that standard client-side exceptions and unhandled promise rejections are automatically intercepted by the SDK.
Create a temporary test hook or trigger a dummy error to verify ingestion:
```typescript
// Add a temporary click handler to test logging:
const triggerTestError = () => {
  throw new Error("PROmonitor Telemetry Test Crash: Verification Successful!");
};
```

Proceed with modifying this codebase to implement this telemetry integration successfully. Let me know when complete and verify the imports and layout build checks.
```
