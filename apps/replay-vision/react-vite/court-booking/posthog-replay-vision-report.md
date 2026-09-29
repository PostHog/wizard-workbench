# Replay Vision report — court-booking

## PostHog: newly installed

This project had no PostHog SDK before this run. It now does:

- Installed `posthog-js@1.434.17` via pnpm.
- Initialized in `src/posthog.ts`, imported as the first line of `src/main.tsx` so it runs before the app renders.
- Config: `posthog.init(key, { api_host, defaults: '2026-05-30' })` — defaults left untouched, so session recording is **not** disabled anywhere in the client code.
- Project keys written to `.env` (`VITE_PUBLIC_POSTHOG_KEY`, `VITE_PUBLIC_POSTHOG_HOST`), with an empty `.env.example` committed for documentation. Build and typecheck both verified green.

## What's recording

Nothing is confirmed recording yet. The client is instrumented and would start capturing sessions as soon as replay is enabled, but the connection used for this run lacked the `product_enablement:write` scope, so the "Record user sessions" toggle could not be flipped from here.

**Follow-up needed (you or an admin):** turn on session replay for this project — Settings → Session replay → "Record user sessions" — at [PostHog session replay settings](https://us.posthog.com/project/483112/settings/replay). Once that's on, the client is already wired to send recordings; no further code changes are needed.

## Scanners: none created — blocked, not skipped

Three scanners were drafted for this padel court-booking app (browse courts → pick a time slot → confirm booking) but **none could be created**. Every attempt to reach the scanner API (`vision-scanners-list`, `vision-scanners-create`) and the scanner skill (`skill-get`) failed with a missing-scope error: the MCP connection lacks `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, and `llm_skill:read`. This is a connection/auth gap, not a decision about the product — nothing was skipped as "not applicable."

Drafted and ready to submit once the connection is reauthorized with those scopes:

| Scanner | Watches for | Query scope | Est. cost |
|---|---|---|---|
| **Broken court bookings** (monitor) | Errors, blank screens, dead buttons — especially the time-slot selector, "Confirm booking," or the confirmation page failing | `$current_url` contains `/book` or `/confirmation` (booking flow + completion, excludes plain browsing) | Not estimated — `vision-scanners-estimate` also requires the blocked scopes |
| **Court booking frustration** (monitor) | Rageclicks — repeat clicks on "Book," "Confirm booking," or the time selector from users getting no feedback | `$rageclick` event only (no URL scope, per the disjointness rule vs. the breakage monitor) | Not estimated |
| **Padel booking session recaps** (summarizer) | Two-to-three sentence recap of each session: what the user tried to book and how it ended | Unscoped, 10% sampling rate | Not estimated |

None of these can produce results without both (a) the scanner scopes above and (b) session replay actually turned on, since a scanner has nothing to scan without recordings.

## Where to look next

Once session replay is enabled and the scanners are created on a follow-up run:
- Recordings and scanner output appear on the [Replay vision page](https://us.posthog.com/project/483112/replay) in PostHog.
- First observations arrive as new recordings complete after replay is turned on — nothing retroactive.

## Summary of what's blocking

Everything downstream of the SDK install is blocked on PostHog MCP connection scopes:
- `product_enablement:write` — to turn on session replay itself.
- `replay_scanner:read`, `replay_scanner:write`, `session_recording:read`, `llm_skill:read` — to list/create the three scanners above.

Reauthorize the connection with these scopes, then re-run the enable-replay and scanner tasks — the drafted configs above are ready to submit as-is.
