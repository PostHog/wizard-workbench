# Replay Vision setup report

> ⚠️ **Needs your attention**
> - A project administrator must enable **Record user sessions** in **Settings → Session replay** before new browser recordings can flow.
> - To create the configured Replay Vision scanners, connect an API key with `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` scopes. Credit estimates could not be retrieved with the current connection.

## What is recording

The browser SDK initialization is in place, and its explicit `disable_session_recording: true` override was removed. Browser session recording will begin once a project administrator enables **Record user sessions** under **Settings → Session replay**. No further client-side replay configuration is needed.

## Replay Vision scanners

No scanners were created or updated in this run because the active MCP credential lacks the Replay Vision and session-recording permissions required to list existing scanners, estimate credit use, inspect quota, or create scanners. The following monitors are ready to create after access is granted.

| Scanner | What it watches | Query scope | Estimated monthly credits |
| --- | --- | --- | --- |
| **Artisan Ceramics checkout breakage** | Cart or checkout content failing to load; a non-responsive checkout form or **Place order** action; visible payment decline; and a missing order-placed confirmation. | URL-scoped to `/cart` and `/checkout`; no event gate; planned 50% session sampling. | **Not available** — estimation and quota access are blocked by missing scopes. |
| **Artisan Ceramics checkout frustration** | Clear signs that shoppers are stuck or frustrated while adding items, proceeding from cart to checkout, submitting an order, or retrying after a payment decline. | `$rageclick` as the only query event. | **Not available** — estimation and quota access are blocked by missing scopes. |
| **Artisan Ceramics session summaries** | Summaries of storefront sessions using the product vocabulary: products, cart, checkout, orders, adding products, proceeding to checkout, and placing an order. | Unscoped recordings query; planned 10% session sampling. | **Not available** — estimation and quota access are blocked by missing scopes. |

Before creating these scanners, use an appropriately scoped connection to list existing scanners, avoid duplicate monitors, estimate each scanner's spend, and compare the estimates with the organization quota. The checkout-breakage monitor should remain URL-scoped with no event gate; the frustration monitor should retain `$rageclick` as its sole event filter.

## What was deferred

- **Project-level session replay enablement** was deferred because the current connection lacks `product_enablement:write` permission. An administrator must enable it in PostHog settings.
- **All three Replay Vision scanners** were deferred because the current connection lacks `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` permissions. This also prevents obtaining reliable monthly credit estimates, so no costs have been invented or assumed.

## Where to look

After session replay is enabled and visitors generate new browser sessions, results will appear on the **Replay vision** page in PostHog. The first observations arrive as new recordings complete; existing sessions from before recording is enabled will not supply new scanner results.
