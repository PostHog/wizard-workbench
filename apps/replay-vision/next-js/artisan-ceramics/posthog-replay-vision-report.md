# Replay Vision setup report

> ⚠️ **Needs your attention**
> - Session recordings are not flowing yet. A project administrator must enable **Record user sessions** in **Settings → Session replay** (or grant the integration `product_enablement:write` and rerun enablement).
> - Update `instrumentation-client.ts` to remove or set `disable_session_recording: false`; it currently disables client recording.
> - Grant the integration `replay_scanner:read`, `replay_scanner:write`, and `session_recording:read` before rerunning scanner setup.

## What is recording

Replay Vision is not recording yet. The SDK was already present in the project, but client-side session recording is explicitly disabled and server-side replay enablement could not be completed with the available permissions. Once the two recording prerequisites above are resolved, new completed recordings will become available for Replay Vision.

## Replay Vision scanners

No scanners were created or updated because the connected PostHog credential cannot read recordings or manage Replay Vision scanners. Recording volume and quota were therefore unavailable, so **estimated monthly credit spend could not be calculated** for any scanner.

| Scanner | What it watches | Intended query scope | Estimated monthly credit spend | Status |
|---|---|---|---:|---|
| **Checkout problems** | Visible checkout failures: a payment-declined message, placing an order without reaching the confirmation, an unresponsive checkout form, or difficulty reaching cart/checkout. | Checkout journey: `/cart` → `/checkout` → `/checkout/success` recordings. | Unavailable — scanner and recording access are required to estimate. | Deferred |
| **Checkout outcome** | Whether shoppers complete checkout from adding ceramics to the cart through order confirmation. | Checkout journey: adding an item → `/cart` → `/checkout` → `/checkout/success`. | Unavailable — scanner and recording access are required to estimate. | Deferred |
| **Artisan Ceramics shopper session summaries** | Shopper-session summaries using the product vocabulary: ceramics, products, cart, checkout, and orders; browsing, adding to cart, checking out, and placing an order. | Storefront shopper recordings, including browsing products and the cart-to-checkout journey. | Unavailable — scanner and recording access are required to estimate. | Deferred |

## Follow-up

After access is granted and recording is enabled, rerun scanner setup. The setup will check for existing scanners, measure recording volume, choose the appropriate tier, estimate each exact query's credit spend, check quota, and then create or update the scanners above.

## Where to look

Open the **Replay Vision** page in PostHog. Its first observations will appear as new session recordings complete, after recording is enabled and the scanners have been created.
