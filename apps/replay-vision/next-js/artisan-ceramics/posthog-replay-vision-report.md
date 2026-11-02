# Replay Vision report

> ❌ **Session replay is off.** A project admin must turn on **Record user sessions** in **Settings → Session replay** before any Replay Vision scanner can observe sessions.

## Deploy this change first

**Deploy this change: session replay only records from code your users run, so your scanners start when the first recording arrives.**

- Changed file: `instrumentation-client.ts`
- Production environment variables required: `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST`

The browser SDK was already initialized in the app. This run removed its `disable_session_recording: true` override, allowing the deployed SDK to honor the project-level replay setting.

There were **0 recordings in the last 30 days**, so the scanners cost nothing until recordings arrive. After a project admin enables recording and this change is deployed, the scanners can begin with the first completed recording.

## Replay Vision scanners

No scanners were created or updated in this run. The connected PostHog credential lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`, so scanner inventory, duplicate checks, credit estimates, quota checks, and provisioning were deferred. A credential with those scopes is required after replay is enabled.

### Prepared: Artisan Ceramics checkout failures

- **Watches:** payment-declined feedback; a checkout form or **Place order** action that does not advance; checkout content or totals that fail to load; a stuck checkout spinner; and a missing order confirmation.
- **Query scope:** recordings in the checkout journey, URL-scoped to cover `/cart`, `/checkout`, and `/checkout/success`.
- **Planned configuration:** `monitor`, 50% sampling, `gemini-3-flash-preview`.
- **Estimated monthly credit spend:** not estimated — session-recording and Replay Vision read access are required to estimate it.

### Prepared: Artisan Ceramics checkout frustration

- **Watches:** clear signs a shopper is stuck or frustrated: repeatedly attempting to proceed from cart to checkout, correcting email or card-number fields, retrying **Place order** after a declined-payment message, or abandoning the order flow.
- **Query scope:** the locked `$rageclick` recordings gate.
- **Planned configuration:** `monitor`, 100% sampling, `gemini-3-flash-preview`.
- **Estimated monthly credit spend:** not estimated — scanner estimation and quota access are unavailable to this connection.

### Prepared: Artisan Ceramics session summaries

- **Watches:** session narratives using the storefront vocabulary and flow: browsing ceramics and products, adding to cart, proceeding to checkout, placing orders, and order completion.
- **Query scope:** unscoped recordings query.
- **Planned configuration:** summarizer at 10% sampling, `gemini-3-flash-preview`.
- **Estimated monthly credit spend:** not estimated — scanner estimation and quota access are unavailable to this connection.

## What remains

1. A project admin enables **Record user sessions** under **Settings → Session replay**.
2. Deploy `instrumentation-client.ts` with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` set in production.
3. Grant a PostHog connection `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` to estimate, check quota, and create or update the prepared scanners.

## Where to look

Once recordings are completing and scanners are provisioned, results appear on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete.
