# Replay Vision report

> ⚠️ **Needs your attention**
> - **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `package.json`, `pnpm-lock.yaml`, and `src/main.tsx`.
> - Set `VITE_POSTHOG_KEY` and `VITE_POSTHOG_HOST` in production. Without both, the browser SDK does not initialize and no new recordings arrive.
> - The Replay Vision scanners use **Free credits only**, but the organization’s free-credit pool is currently exhausted. The enabled scanners will pause until those credits reset. If you want them to use paid credits, turn off **Free credits only** in each scanner’s PostHog settings; that is a deliberate billing choice.
> - `Padel court booking outcome` is currently disabled. Enable it in PostHog when you want outcome classifications.

PostHog is now installed and initialized in this Vite React app. Session replay is enabled in the project and is already recording: **3 recordings arrived in the last 30 days**. New completed recordings are eligible for Replay Vision scanning right away.

## What Replay Vision watches

All three scanners use an unfiltered recording scope (`RecordingsQuery`), sample at the low-volume rate of **1%**, and were estimated from **1 scannable session over 7 days** (roughly 4 per month). At the current volume, each estimate is approximately **20 credits per month** (5 credits per observation). Because recordings already exist, scanners begin scanning—and spending—when they can run; they are currently held by their free-only configuration and exhausted free-credit pool.

- **Padel court booking problems** — **enabled**. Watches for visible booking failures across the court list, invalid court routes, time-slot selection, the **Confirm booking** action, and the booking-confirmation screen. Scope: all recordings, 1% sampling. Estimated spend: **~20 credits/month**. It is paused until free credits reset because it is configured for Free credits only.
- **Padel court booking outcome** — **disabled**. Classifies the booking flow—choosing a court on `/`, selecting a time slot on `/book/:courtId`, and reaching `/confirmation`—as `completed`, `abandoned`, `blocked-by-error`, `confused`, or `not-attempted`. Scope: all recordings, 1% sampling. Estimated spend when enabled: **~20 credits/month**. It remains disabled because it was already paused; its enabled state was intentionally preserved. It would also be paused by Free credits only while the free pool is exhausted.
- **Padel booking session summaries** — **enabled**. Produces product-specific summaries using the vocabulary courts, time slots, bookings, browsing courts, selecting a time slot, and confirming a booking. Scope: all recordings, 1% sampling. Estimated spend: **~20 credits/month**. It is paused until free credits reset because it is configured for Free credits only.

No scanner was skipped for product coverage. Existing scanners for other apps were left untouched.

## Where to look

Open the **Replay Vision** page in PostHog. New observations appear there as newly recorded sessions finish processing. Start with the enabled **Padel court booking problems** scanner and **Padel booking session summaries** scanner; enable **Padel court booking outcome** when you want its flow labels too.
