# Court Booking (Vite + React Router 7)

A padel court booking app with no analytics at all. Test app for `wizard replay-vision`.

What this app exercises:

- **No PostHog anywhere** - no SDK dependency, no snippet. The orchestrator has to seed the install and init tasks (via the integration-v2 mini-skills) before replay and scanners.
- **The completion flow is a booking, not a checkout**: `/` → `/book/:courtId` → `/confirmation`. The Broken experiences scanner must scope to the paths this app actually uses instead of guessing `/checkout`.

## Getting started

```bash
pnpm install
pnpm dev
```

Open http://localhost:5173.
