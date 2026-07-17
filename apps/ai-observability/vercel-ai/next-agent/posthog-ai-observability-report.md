# PostHog AI Observability Report

**Project:** next-agent  
**SDK variant:** Vercel AI SDK (`ai` + `@ai-sdk/openai`)  
**Status:** Wired, unverified (awaiting user confirmation)

---

## What was done

### 1. Packages added (`package.json`)

```
@posthog/ai          ^0.3.0
@opentelemetry/sdk-node    ^0.57.2
@opentelemetry/resources   ^1.30.1
```

Run `pnpm install` from the workspace root to install them.

### 2. OTel initialization (`instrumentation.ts`)

Created at the project root. Next.js loads this file automatically before the app starts (no extra wiring needed). It initializes a `NodeSDK` with `PostHogSpanProcessor`, which forwards `gen_ai.*` spans to PostHog as `$ai_generation` events.

Credentials are read from:
- `POSTHOG_API_KEY` — your PostHog project token
- `POSTHOG_HOST` — PostHog ingest host

Both variables have been written to `.env.local`. The `.env.local.example` file has been updated with placeholder entries for collaborators.

### 3. Telemetry enabled on LLM call site (`agent/weather-agent.ts`)

Added `experimental_telemetry: { isEnabled: true, functionId: 'weather-agent' }` to the `ToolLoopAgent` constructor. Every `generateText` loop the agent runs will now emit an OTel span captured by the processor.

---

## How to verify

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the dev server:
   ```bash
   pnpm dev
   ```

3. Open the app in your browser and send a message (e.g. "What's the weather in London?") to trigger an LLM call.

4. In PostHog, open **AI Observability → Generations** and filter by today. You should see a `$ai_generation` event with:
   - `$ai_provider`: `openai`
   - `$ai_model`: `gpt-4o`
   - `$ai_input_tokens`, `$ai_output_tokens`, `$ai_latency`

### Troubleshooting

- **No events in PostHog after 1 minute:** Add `console.log('OTel started')` right after `sdk.start()` in `instrumentation.ts`. If you don't see it in the server logs, Next.js isn't loading the file — confirm you're on Next.js 13.4+ which supports the `instrumentation.ts` convention.
- **Confirm env vars loaded:** Add a temporary `console.log(process.env.POSTHOG_API_KEY)` at the top of `instrumentation.ts`.
- **Vendor SDK imported before OTel:** The `instrumentation.ts` register hook runs before route modules, so import order is handled correctly by Next.js.

---

## Files changed

| File | Change |
|------|--------|
| `package.json` | Added `@posthog/ai`, `@opentelemetry/sdk-node`, `@opentelemetry/resources` |
| `instrumentation.ts` | Created — OTel + PostHog span processor init |
| `agent/weather-agent.ts` | Added `experimental_telemetry` to `ToolLoopAgent` |
| `.env.local` | Added `POSTHOG_API_KEY`, `POSTHOG_HOST` |
| `.env.local.example` | Added placeholder entries for both vars |
