# Desk workspace (pnpm monorepo)

A two-package pnpm workspace. `apps/web` is a Next.js dashboard that reads a
reporting replica through `DATABASE_URL`. `apps/api` is an Express service that
calls the Stripe REST API directly over `fetch`.

Test fixture for `wizard warehouse` — the env-key-parity case.

## The regression it guards

Neither source appears in a `package.json`. There is **no `pg`**, **no
`stripe`**, and **no `.env` at the repository root**. Both signals live only in
nested env files:

- `apps/web/.env.local` → `DATABASE_URL` → `Postgres`
- `apps/api/.env` → `STRIPE_SECRET_KEY` → `Stripe`

That makes this app the only one in the category that fails if the detector
stops walking nested directories, or stops reading `.env.local` alongside
`.env`. Both packages carry a plausible reason for the missing dependency, so
the file layout is not a trick: the web app gets its driver from the runtime,
and the API service speaks HTTP.

The second half of the case is the **reported signal**. The detected source
carries a `matchedSignal` string that the wizard puts in the agent's prompt,
and the agent trusts it as a file path. A signal that names the real file
(`apps/api/.env`) lets the agent confirm the key. A signal that names a file
which does not exist sends the agent looking for a root `.env` that was never
written. This app is where that difference shows up.

The detector walks 3 levels below the app root, so every manifest and env file
here sits within that limit — `apps/web` is 2 levels down.

## What must be detected

| Kind | File | Key |
|---|---|---|
| `Postgres` | `apps/web/.env.local` | `DATABASE_URL` |
| `Stripe` | `apps/api/.env` | `STRIPE_SECRET_KEY` |

`forbidKinds` covers `Supabase` — a nested Postgres connection string is where
a matcher is most likely to guess Supabase — plus `MySQL` and `Hubspot`.

## Getting started

```bash
pnpm install
pnpm dev
```
