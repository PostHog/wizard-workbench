# PostHog Revenue Analytics Report

## What changes were made

- Updated the Stripe checkout session creation flow to include `posthog_person_distinct_id` in Stripe metadata.
- Set Stripe Checkout `client_reference_id` to the same PostHog distinct ID used elsewhere in the app (`String(user.id)`).
- Threaded the PostHog distinct ID through existing checkout call sites so Stripe metadata uses the real analytics identifier instead of a fabricated value.
- Added local environment variables for the PostHog project token, host, and project ID in `.env.local`.

## Files modified or created

### Modified
- `lib/payments/stripe.ts`
- `lib/payments/actions.ts`
- `app/(login)/actions.ts`
- `.env.local`

### Created
- `posthog-revenue-report.md`

## Manual steps to take next

- Install project dependencies, since verification was limited by missing `node_modules` in this environment.
- Run `pnpm build` locally after installing dependencies to confirm the project still builds cleanly.
- In Stripe, complete a test checkout and confirm the resulting Checkout Session and Subscription contain `posthog_person_distinct_id` in metadata.
- In PostHog, connect Stripe revenue analytics for project `483112` and verify revenue data starts appearing against identified users.
