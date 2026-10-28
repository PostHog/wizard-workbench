# Replay Vision setup report

> ⚠️ **Needs your attention**
> - Enable **Record user sessions** in PostHog under **Settings → Session replay** (or use an MCP credential with `product_enablement:write`).
> - To create the deferred Replay Vision scanners, use an MCP credential with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`.

## What is ready

PostHog is now installed and initialized in this Vite React app with `posthog-js`. The browser SDK is configured through `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST`; its normal capture defaults remain enabled.

The client is ready to record sessions, but server-side Session Replay is not yet enabled for the project. Once **Record user sessions** is enabled, new browser sessions will record without further app changes.

## Replay Vision scanners

No scanners were created or updated in this run. The current MCP credential does not have the Replay Vision scanner read/write or session-recording read scopes, so no scanner inventory, monthly-cost estimate, quota check, or create/update operation could be performed. The following product-specific scanner configurations are prepared for an authorized follow-up:

| Scanner | What it watches | Query scope | Estimated monthly credits |
| --- | --- | --- | --- |
| **Booking failures** | Visible booking failures: a selected court cannot be found, time slots do not display or change, **Confirm booking** does nothing or fails, or the **Booking confirmed** screen never appears. | Intended URL scope: `/book/` for the parameterized booking route. The confirmation route may need an additional OR condition because it is `/confirmation`. | **Not estimated** — scanner access was unavailable. Intended fixed sampling: 0.5 with `gemini-3-flash-preview`. |
| **Padel booking frustration** | Stuck or frustrated moments while choosing a court, selecting a time slot, submitting **Confirm booking**, or starting another booking from confirmation. | Locked `RecordingsQuery` for recordings containing `$rageclick`; no additional filters. | **Not estimated** — scanner access was unavailable. |
| **Padel booking session summaries** | Session summaries using the product vocabulary: padel courts, time slots, bookings, browsing courts, selecting a time slot, and confirming a booking. | Unscoped `RecordingsQuery`, so it is intended to sample sessions across the product. | **Not estimated** — scanner access was unavailable. Intended sampling: 0.1 with `gemini-3-flash-preview`. |

When the required credential is available, list existing scanners first to avoid duplicates, estimate each scanner's credits, compare the estimates with remaining quota, then create or update the matching configuration. Keep `emits_signals` disabled or omitted.

## Where to look

After Session Replay is enabled and new recordings complete, results will appear on the **Replay Vision** page in PostHog. Scanner observations begin arriving as qualifying new recordings finish processing; the deferred scanners will remain idle until both Replay is enabled and the scanners are created.
