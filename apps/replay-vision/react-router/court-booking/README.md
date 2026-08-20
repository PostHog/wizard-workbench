# Court Booking (Vite + React Router 7)

A padel court booking app with no analytics at all.
Test fixture for `wizard replay-vision` - the "no PostHog yet" arm.

The completion flow is a booking, not a checkout: `/` → `/book/:courtId` → `/confirmation`.
There is no PostHog dependency, snippet, or init anywhere.

Expected wizard outcome:

- installs and initializes posthog-js first (the orchestrator seeds install/init via the integration-v2 mini-skills; minimal footprint - no identify, capture, or dashboards)
- enables session replay server-side
- creates a breakage monitor named for this app (not "Broken experiences"), query scoped to the booking paths (`/book`, `/confirmation`) - never a guessed `/checkout`
- creates a rage-click frustration monitor named for this app, `$rageclick` gate as the only filter
- creates a summarizer at 10% sampling whose prompt uses booking vocabulary (courts, slots, bookings)
- report written to `./posthog-replay-vision-report.md`

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.
