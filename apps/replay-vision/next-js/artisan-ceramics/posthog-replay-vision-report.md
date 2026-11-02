# Replay Vision readiness report

> ❌ **Session replay is off.** A project admin must enable **Record user sessions** under **Settings → Session replay** before any Replay Vision scanner can observe sessions.

> **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `instrumentation-client.ts`. Set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in the production environment.

## What is ready

The browser SDK’s client configuration no longer disables session recording. This command started with client-side replay disabled; after the deployment and project-level setting are enabled, the app can send recordings to PostHog.

There were **0 recordings in the last 30 days**. Replay Vision scanners cost nothing until recordings arrive. Once the setting is enabled and the deployment reaches users, scanning begins with the first completed recording. If people already use the app, ensure the version they run includes the released PostHog SDK configuration.

## Prepared Replay Vision scanners

No scanners were created or updated because the connected credential cannot read, estimate, or create Replay Vision scanners. It lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read`; scanner inventory, quota, and credit estimates could not be inspected.

- **Artisan Ceramics checkout failures** — planned monitor for the purchase journey `/cart` → `/checkout` → `/checkout/success`. It watches visible checkout failures: payment-declined messaging, a nonresponsive **Place order** action, checkout content failing to load, and no order confirmation. **Estimated monthly credits:** unavailable until an authorized credential estimates the proposed 0.5-sampling monitor against quota.
- **Artisan Ceramics checkout frustration** — planned `$rageclick`-only monitor focused on struggle when adding products, reaching cart or checkout, entering checkout details, retrying after a declined payment, or waiting for confirmation. **Query scope:** the checkout journey described above. **Estimated monthly credits:** unavailable until an authorized credential estimates it against quota.
- **Artisan Ceramics session summaries** — planned `summarizer` across all recordings, at **0.1 sampling**, using the storefront vocabulary of ceramics, products, cart, checkout, and order. **Query scope:** all recordings. **Estimated monthly credits:** unavailable until an authorized credential estimates it against quota.

## What still needs to happen

1. A project admin enables **Record user sessions** in **Settings → Session replay**.
2. Deploy `instrumentation-client.ts` with `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` configured in production.
3. Use a credential with the required replay-scanner and session-recording scopes to inspect existing scanners, estimate credit use and quota, then create or update the prepared monitors.

## Where to look

Results will appear on the **Replay Vision** page in PostHog. The first observations arrive as new recordings complete after session replay is enabled and the deployed application receives browser traffic.
