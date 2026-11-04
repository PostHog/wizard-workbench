# Replay Vision setup report

> ⚠️ **Needs your attention**
> - **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `package.json`, `pnpm-lock.yaml`, and `src/main.tsx`.
> - Configure `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in the production deployment environment. Do not deploy `.env` or `.env.example`.
> - The scanners cost nothing until recordings arrive. Session replay is enabled, but the project has no recordings from the last 30 days. If people already use the app, the version they run may not yet include the PostHog SDK.
> - All configured scanners use **Free credits only**, and the organization’s free-credit pool is currently exhausted. Enabled scanners pause until free credits are available; the outcome classifier is also intentionally disabled to preserve its prior human-controlled state.

PostHog is now installed and initialized in this browser application. Once the deployed app sends its first session recording, Replay Vision can begin processing new completed recordings.

## What Replay Vision watches

### Padel court booking problems
- **Status:** Enabled, but paused while free credits are exhausted.
- **Watches:** The court list, invalid court selection, time-slot selection, booking-confirmation submission, and the confirmation screen for booking problems.
- **Scope:** All recordings (no route or property filter).
- **Sampling:** 1% of recordings.
- **Estimated monthly spend:** **0 credits at current volume** (no matched sessions in the seven-day estimate); each observation costs **5 credits** once recordings arrive.

### Court booking outcome
- **Status:** Disabled, preserving its prior user-controlled state. It will not process recordings until enabled in Replay Vision.
- **Watches:** Whether a padel-court booking was completed, abandoned, blocked by an error, confused, or not attempted—from court and time-slot selection through confirmation.
- **Scope:** All recordings (no route or property filter).
- **Sampling:** 1% of recordings.
- **Estimated monthly spend:** **0 credits at current volume**; each observation costs **5 credits** once it is enabled and recordings arrive.

### Padel booking session summaries
- **Status:** Enabled, but paused while free credits are exhausted.
- **Watches:** Short factual summaries of browsing courts, selecting a time slot, and confirming a booking.
- **Scope:** All recordings (no route or property filter).
- **Sampling:** 1% of recordings.
- **Estimated monthly spend:** **0 credits at current volume** (no matched sessions in the seven-day estimate); each observation costs **5 credits** once recordings arrive.

## Deferred and untouched items

- Scanner validation and volume right-sizing are deferred until production recordings arrive; there are currently no recordings or scannable sessions to validate against.
- The outcome classifier remains disabled because its existing human-controlled state was deliberately preserved.
- The unrelated legacy **User frustration** monitor was left untouched. It overlaps broadly with the new problem monitor and can be disabled in Replay Vision if it is no longer useful.
- The unrelated **Artisan Ceramics session summaries** scanner was left unchanged because it does not describe this product.

## Where to look

Open the [Replay Vision page](https://us.posthog.com/project/483112/replay-vision) in PostHog. New observations will appear as new recordings complete after deployment. You can also open the configured scanners directly:

- [Padel court booking problems](https://us.posthog.com/project/483112/replay-vision/01a1a871-d274-7b7f-aacb-8f88e82222e2)
- [Padel booking session summaries](https://us.posthog.com/project/483112/replay-vision/01a1a871-dca7-7064-afaf-8f833ebaa2a4)
