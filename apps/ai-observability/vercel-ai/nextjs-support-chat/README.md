# wb-aio-nextjs-support-chat

Next.js App Router support chat on the Vercel AI SDK. PostHog-less fixture for
`wizard ai-observability`.

```
threadId (from the request)        ← $ai_session_id — varies PER REQUEST
└─ POST /api/chat                  ← trace
   ├─ generateText (tool_use)      ← generation
   ├─ lookupOrder                  ← span (auto: ai.toolCall)
   └─ generateText (final)         ← generation
```

## Expected outcome

- per POST: one trace of `generation → span(lookupOrder) → generation`,
  session = the request's `threadId`, person = the request's `userId`
- `instrumentation.ts` created at the project root, starting the OTel SDK with
  `PostHogSpanProcessor` once per process; no provider instrumentor package
- `experimental_telemetry: { isEnabled: true }` on the `generateText` call,
  with `$ai_session_id` and distinct id passed **per request**
- tool definition and `lib/orders.ts` untouched — `ai.toolCall` is already a
  span

Fail: `threadId`/`userId` on the OTel Resource (process-global, but they vary
per request); SDK started inside the handler; a manual span around
`lookupOrder`; a provider instrumentor this SDK doesn't use.
