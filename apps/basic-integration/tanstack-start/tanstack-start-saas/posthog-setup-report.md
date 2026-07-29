# PostHog setup report

PostHog product analytics and exception tracking were added to the TanStack Start invoice app, with a dashboard for the instrumented invoice lifecycle.

## Installed and initialized

- Installed `posthog-js` 1.408.0 and `posthog-node` 5.46.1 with pnpm; `@posthog/react` is also present for the root provider.
- Client tracking is initialized through `PostHogProvider` in `src/routes/__root.tsx`, using `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` from the environment.
- `src/utils/posthog.ts` exports the guarded shared browser singleton/configuration used by the action handlers and error boundary. Missing configuration is loud in development and a no-op in production.
- Both environment keys were verified as present in the local `.env`; `.env.example` documents their names. The run did not verify deployment environments.
- No server-side `posthog-node` capture was added because the captured invoice actions use TanStack server functions and no suitable server request identity was established.

## Events instrumented

| Event | What it measures | File |
|---|---|---|
| `invoice_created` | A user successfully creates a new invoice from the invoice form. | `src/routes/posts.index.tsx` |
| `invoice_marked_paid` | A user successfully marks a pending invoice as paid. | `src/routes/posts.$postId.tsx` |

Both captures occur after their awaited mutations succeed and include only non-PII `invoice_id` and `amount` properties. The run did not observe events arriving in PostHog, so delivery and event volume remain unconfirmed.

## Identification

User identification was skipped. The app has no authentication, registration, session, account-switching, or logout flow. The displayed team users are externally fetched records, not the current authenticated user; using them would misattribute events and could attach PII. The events therefore remain anonymous/personless.

**Open issue:** No stable application identity is available for attribution. If left unresolved, invoice events and exceptions cannot be reliably tied to an authenticated account or user. Add identification only when a real authenticated identity exists, using its stable primary key and person properties; reset on logout.

## Error tracking

`src/components/DefaultCatchBoundary.tsx` now calls `posthog.captureException(error)` from the global TanStack Router error boundary while preserving the existing UI and console logging. Browser exception autocapture remains enabled by the provider configuration. The run verified the code path was added, but did not trigger an error or observe an exception event in PostHog.

## Dashboard

[Analytics basics (wizard)](https://us.posthog.com/project/483112/dashboard/1926666) contains daily trends for both events and an ordered 14-day invoice creation-to-payment funnel. The dashboard and its three insights were created successfully; tiles may remain empty until the app generates events.

## Build and verification

- `pnpm install` completed successfully with the lockfile current.
- `pnpm build` passed: Vite client, SSR, and Nitro builds completed, followed by `tsc --noEmit` with no TypeScript errors.
- No lint script or separate typecheck script exists in `package.json`.
- The build emitted a non-failing advisory that the main client chunk exceeds 500 kB. This is the only reported build conflict; it did not fail the build.
- The run did not verify event delivery, production deployment configuration, or runtime behavior in a browser.

## Next steps

1. Set `VITE_PUBLIC_POSTHOG_PROJECT_TOKEN` and `VITE_PUBLIC_POSTHOG_HOST` in every deployment environment, not only the local `.env`.
2. Exercise invoice creation, payment, and an error in a real browser session, then confirm the corresponding events and exception appear in PostHog.
3. Decide how authenticated identity will be represented when authentication is added; do not identify from the fetched team-user records.
4. Review the dashboard after real traffic arrives; its insights are expected to be empty until then.
5. Consider addressing the non-blocking >500 kB client-chunk advisory if bundle size matters.

## Before you merge

- [ ] Run a full production build and fix any lint or type errors introduced by the integration; the verified command was `pnpm build`, which passed, but no lint script exists (`package.json`, scripts section).
- [ ] Run the test suite and update any mocks or fixtures affected by the new captures (`src/routes/posts.index.tsx:20-27`, `src/routes/posts.$postId.tsx:22-27`) and exception capture (`src/components/DefaultCatchBoundary.tsx:15`).
- [ ] Confirm the exact environment names from `.env.example` are configured in each deployment environment, not only locally (`.env.example:1-2`).
- [ ] Trigger the invoice actions and an error in a browser and confirm delivery in PostHog; the run only verified compilation and PostHog artifact creation (`src/routes/posts.index.tsx:20-27`, `src/routes/posts.$postId.tsx:22-27`, `src/components/DefaultCatchBoundary.tsx:15`).
