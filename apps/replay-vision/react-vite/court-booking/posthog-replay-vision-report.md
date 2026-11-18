# Replay Vision setup report

**Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `package.json`, `pnpm-lock.yaml`, and `src/main.tsx`. Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in production.

Session Replay is already enabled and recording: this project has **3 recordings in the last 30 days**. This run installed and initialized the browser `posthog-js` SDK, so the app now has PostHog client instrumentation once the deployment and production environment configuration are in place.

## What Replay Vision watches

All three enabled scanners currently scope to **all recordings** (`RecordingsQuery`) at **1% sampling**, because the 7-day estimate found **0 eligible/scannable sessions**. Their current estimated monthly spend is **0 credits** each; Replay Vision costs **5 credits per observation** once eligible recordings are scanned.

- **[Court Booking booking problems](https://us.posthog.com/project/483112/replay-vision/01a1edeb-0ca1-7216-aa13-8310bc209c82)** — watches the padel-court booking journey for court-list failures, invalid court pages, unresponsive time-slot selection, a Confirm booking action that does not progress, and failed confirmation rendering. **Estimated monthly spend: 0 credits.**
- **[Court Booking booking outcome](https://us.posthog.com/project/483112/replay-vision/01a1edeb-1f08-7828-96b6-d90e488e8b82)** — classifies the flow from selecting a court and time slot through booking confirmation as `completed`, `abandoned`, `blocked-by-error`, `confused`, or `not-attempted`. **Estimated monthly spend: 0 credits.**
- **[Court booking session summaries](https://us.posthog.com/project/483112/replay-vision/01a1edeb-0243-7ccd-a31d-790adbd9c62f)** — summarizes sessions involving browsing padel courts, choosing a time slot, and confirming a booking. **Estimated monthly spend: 0 credits.**

## Current constraint

These scanners are configured as **Free credits only**. The organization currently has no free-only credits available, so they are enabled but paused until free credits are available. To deliberately allow paid scanning, turn off **Free credits only** on each scanner’s Replay Vision page. The organization has **934,138** total remaining Replay Vision credits, so paid capacity is available if you choose it.

## Where to look

View results on the [Replay Vision page](https://us.posthog.com/project/483112/replay-vision). New observations will appear there as new eligible recordings complete and the scanners have available credits. Once observations arrive, you can rate them in each scanner to improve its prompt quality.
