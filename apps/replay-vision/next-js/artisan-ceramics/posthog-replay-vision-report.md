# Replay Vision report

> ⚠️ **Session replay is off.** A project admin must enable **Record user sessions** in **Settings → Session replay** before any scanner can observe recordings.

> ⚠️ **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Merge and release `instrumentation-client.ts`, and set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in production.

No recordings have arrived in the last 30 days. The scanners cost nothing until recordings arrive; after replay is enabled and the deployment is live, they begin working with the first completed recording. If people already use the app, the version they run may not yet include the PostHog SDK change.

## What Replay Vision will watch

No scanners could be created with the current PostHog connection. It needs `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` scopes to inventory, estimate, and create scanners. The following configurations are ready to create once those permissions are available.

### Artisan Ceramics checkout problems

- **Watches:** Shopping and checkout failures: a cart that does not lead to checkout; non-responsive checkout fields or **Place order**; a declined payment without a usable recovery path; a missing order confirmation; and loading or layout failures during checkout.
- **Query scope:** Every recording initially — unfiltered `RecordingsQuery`, sampling rate `1.0`, with **Free credits only** enabled.
- **Estimated monthly credit spend:** Not available. The required estimate and quota checks are blocked by the current connection’s missing read scopes.
- **Behavior:** With Free credits only enabled, the scanner pauses when the organization’s free credits are exhausted. It can be changed later in scanner settings to continue on paid credits.

### Checkout outcome

- **Watches:** The outcome of the key flow: proceeding from the cart through placing an artisan ceramics order to the order confirmation. It classifies sessions using the locked outcome tags: completed, abandoned, blocked-by-error, confused, and not-attempted.
- **Query scope:** Every recording initially — unfiltered `RecordingsQuery`, sampling rate `1.0`, with **Free credits only** enabled.
- **Estimated monthly credit spend:** Not available because the connection cannot run the required estimate or quota checks.
- **Behavior:** It pauses after free credits are used unless **Free credits only** is disabled.

### Ceramics shopping session summaries

- **Watches:** End-to-end customer activity across browsing ceramics, adding items to cart, checking out, and placing orders. It uses the vocabulary: ceramics, shop, cart, checkout, and orders.
- **Query scope:** Every recording initially — unfiltered `RecordingsQuery`, sampling rate `1.0`, with **Free credits only** enabled.
- **Estimated monthly credit spend:** Not available because the current connection lacks the required Replay Vision and session-recording read access.
- **Behavior:** It pauses after free credits are used unless **Free credits only** is disabled.

## What is deferred

All three scanners are deferred, rather than created or updated, because the current credential lacks the Replay Vision and session-recording permissions required to inspect existing scanners, check the credit quota, estimate spend, and create scanners. After an authorized connection is available, it should first inventory existing scanners, estimate each planned scanner against the organization’s credit budget, and then create or update the matching configurations.

## Where to look

Once replay is enabled, the deployment is live, and scanners are created, results appear on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete.

The app already had PostHog browser initialization; this run changed that initialization so it no longer disables session recording.