# Replay Vision is ready to watch checkout sessions

> ⚠️ **Needs your attention**
> - **Deploy this change:** session replay only records from code your users run, so your scanners start when the first qualifying recording arrives. Merge and deploy `instrumentation-client.ts`.
> - Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in the production deployment environment before releasing. Neither is set in the local environment files.
> - The project already has one recording in the last 30 days, so session replay is recording. However, the current one-day sizing window has **0 qualifying/scannable sessions**.

PostHog was already installed in this app; this run updated its browser initialization so it no longer disables session recording. Session Replay was already enabled in the project.

## What Replay Vision watches

### Artisan Ceramics checkout problems

- **Status:** Existing enabled monitor reused; no duplicate was created.
- **Watches:** Visible checkout failures: payment declines, blocked email or card fields, clicking **Place order** without completing checkout, missing cart items or totals, and no order confirmation.
- **Scope:** All recordings via an unfiltered `RecordingsQuery`.
- **Sampling:** Comprehensive mode at **1%**, with **Free credits only** enabled.
- **Estimated monthly spend:** No reliable monthly estimate yet because the current sizing window has zero scannable sessions. Each observation is estimated at **5 credits**. The free-credit pool is currently exhausted, so this monitor is paused until free credits are available. Turning off **Free credits only** in the scanner UI would allow paid scanning.

### Artisan Ceramics checkout outcome

- **Status:** New enabled classifier.
- **Watches:** The ceramics purchase journey from adding products to cart through checkout and order confirmation. It assigns one outcome: `completed`, `abandoned`, `blocked-by-error`, `confused`, or `not-attempted`.
- **Scope:** All recordings via an unfiltered `RecordingsQuery`, including sessions that never begin checkout so they can be classified as `not-attempted`.
- **Sampling:** Comprehensive mode at **1%**, with **Free credits only** enabled.
- **Estimated monthly spend:** Unknown until qualifying traffic arrives; each observation is estimated at **5 credits**. It is currently paused because the free-credit pool is exhausted. To scan using paid credits, turn off **Free credits only** in the scanner settings.
- **Open it:** [Artisan Ceramics checkout outcome](https://us.posthog.com/project/483112/replay-vision/01a1a8ef-c275-7543-afc9-f703c5f3476e)

### Artisan Ceramics session summaries

- **Status:** Existing enabled summarizer retained without changing its established configuration.
- **Watches:** What visitors do in the storefront: browsing products, using the shop and cart, completing checkout, and placing orders.
- **Scope:** All recordings, with no query filters.
- **Sampling:** **10%** sampling; **Free credits only** is off. This prior higher-tier setting was preserved rather than overwritten.
- **Estimated monthly spend:** Unknown until qualifying recordings arrive. Each observation is estimated at **5 credits**; because free-only mode is off, this scanner may use paid organization credits when it begins scanning.

## Current readiness and results

No scanner was skipped. The checkout-problem monitor and session-summary scanner were already correctly configured, and the checkout-outcome classifier was created for this run.

The project has one recent recording, but the current one-day estimate contains no qualifying recordings to scan. After the deployment is live and new qualifying recordings complete, the scanners can produce observations—subject to the free-credit pause on the two free-only scanners. The session-summary scanner can scan using organization credits under its existing configuration.

Find results in the **Replay Vision** page in PostHog. New observations will appear there as new recordings complete and eligible scanners process them.
