# Replay Vision report

> ⚠️ **Deploy this change:** session replay only records from code your users run, so your scanners start when the first recording arrives. Deploy `instrumentation-client.ts` and set `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN` and `NEXT_PUBLIC_POSTHOG_HOST` in production.

Session replay is enabled in the PostHog project, but there have been **0 recordings in the last 30 days** (and 0 scannable sessions in the recent 7-day estimate). The scanners cost nothing until recordings arrive. Once the deployment is live and eligible traffic generates recordings, scanners can begin observing completed recordings.

## Replay Vision monitors

No scanners were created or updated in this run, so current Replay Vision scanner spend is **0 credits/month**. Scanner creation is deferred because this connection does not expose the required Replay Vision scanner create/update endpoints.

- **Artisan Ceramics checkout problems** — deferred. It is prepared to watch payment declines; unresponsive checkout fields or **Place order** control; cart-to-checkout navigation failures; unavailable products or cart content; and orders that do not reach confirmation. Its intended scope is all recordings initially (`RecordingsQuery` with no filters), using free credits only. **Estimated monthly spend: 0 credits while deferred; to be calculated from the live estimate and free-credit pool before creation.**
- **Order outcome** — deferred. It is prepared to classify the flow from `/cart` through `/checkout` to `/checkout/success` as `completed`, `abandoned`, `blocked-by-error`, `confused`, or `not-attempted`. Its intended initial scope is all recordings (`RecordingsQuery` with no filters), using free credits only. **Estimated monthly spend: 0 credits while deferred; to be calculated from the live estimate and free-credit pool before creation.**
- **Artisan Ceramics shopping session summaries** — deferred. It is prepared to summarize shopping behavior using the product vocabulary: ceramics, products, cart, checkout, and order, including browsing products, adding items to cart, proceeding to checkout, and placing an order. Its intended initial scope is all recordings (`RecordingsQuery` with no filters), using free credits only. **Estimated monthly spend: 0 credits while deferred; to be calculated from the live estimate and free-credit pool before creation.**

When Replay Vision scanner write access is available, rerun setup after recordings arrive. The setup will inventory existing scanners, estimate the exact scope against live traffic, calculate sampling within the free-credit allocation, check quota, and create or update rather than duplicate the prepared monitors.

## Where to look

Results appear on the **Replay Vision** page in PostHog. The first observations arrive as new session recordings complete.
