# Replay Vision setup report

## Deploy this change

Session replay only records from code your users run, so your scanners start when the first eligible recording arrives. Deploy these application changes:

- `src/main.tsx`
- `package.json`
- `pnpm-lock.yaml`

Set these production environment variables for the deployed Vite app:

- `VITE_POSTHOG_KEY`
- `VITE_POSTHOG_HOST`

PostHog was not present when this run began; the browser SDK is now installed and initialized. Session Replay is enabled in the PostHog project and is recording: there has been **1 recording in the last 30 days**.

## What Replay Vision watches

All configured scanners use an unfiltered recordings scope so that the first eligible booking session can be assessed. Current sizing found **0 scannable sessions** in the one-day estimate window. The scanners are therefore configured for low/unknown volume, and should be resized after production recordings arrive.

- **Padel court booking problems** — **enabled**. Watches visible booking failures: loading the court list, a missing court, selecting a time slot, pressing **Confirm booking**, and reaching the booking-confirmation screen. Scope: all recordings; 1% sampling; free credits only. **Estimated monthly spend: 0 credits** at current eligible volume. It will not consume paid credits; it is currently paused because the free-only capacity is 0.
- **Padel court booking outcome** — **paused** (its pre-existing user-controlled state was preserved). Classifies each booking flow into one of five single-label outcomes. Scope: all recordings; 1% comprehensive sampling; free credits only. **Estimated monthly spend: 0 credits** at current eligible volume. It will remain paused unless someone enables it, and free-only capacity must also become available.
- **Padel booking session summaries** — **enabled**. Produces a concise two-to-three-sentence account of browsing courts, selecting a time slot, and confirming a booking. Scope: all recordings; 1% sampling; free credits only. **Estimated monthly spend: 0 credits** at current eligible volume. It pauses while free-only credits are unavailable and resumes when they are available.

The enabled scanners are ready to scan eligible recordings, but the organization currently has no free-only scanner capacity. Consequently, none of these scanners will add paid credit spend. The existing generic **User frustration** monitor and an unrelated product summarizer were intentionally left unchanged to avoid altering overlapping or unrelated monitoring.

## Where to look

Open the **Replay Vision** page in PostHog to see scanner observations. New observations appear as eligible recordings complete. Re-run scanner sizing after the deployed app begins generating regular recordings, especially before changing sampling or allowing paid usage.
