# Support desk (Next.js, five sources)

A Next.js 15 support desk. One inbound-ticket request touches four systems:
Hugging Face classifies the text, HubSpot resolves the account owner, Stripe
resolves the plan for SLA, and Postgres stores the row. Supabase holds the
customer-facing auth users and the attachments bucket.

Test fixture for `wizard warehouse` — the stress case.

## The regressions it guards

Every source here is deliberate. Each one breaks a different part of the flow:

- **Postgres and Supabase together.** Supabase *is* Postgres, and its credential
  fields are the same six. The run must offer both as separate sources and must
  not fold one into the other or ask the same six questions twice under one
  subject.
- **Hugging Face — the label-vs-kind trap.** The registry label is
  `Hugging Face`, the `kind` is `HuggingFace`. PostHog rejects the label. The
  create payload must carry `source_type: "HuggingFace"`. It sits in
  `attemptedFailOk` because the stub can reject it: a rejected create must be
  reported honestly in the report, not dropped.
- **HubSpot — deep-link only.** HubSpot is OAuth, so there is no safe terminal
  credential path. The run must hand over a pre-filled new-source URL and must
  **not** open an ask batch for it.
- **Ask batching and subjects.** Four in-CLI sources means four credential
  sets. `askMaxBatchesPerSubject` carries the contract: one source's questions
  go out together, not one at a time. `askMaxPerBatch` bounds how many
  questions one screen may carry. A run that asks one question per batch is as
  wrong as one that asks twenty at once.

  `askBatches` is only a sanity bound on the total, set at two per in-CLI
  source. Do not tighten it. The model does not group five sources the same way
  twice — two consecutive runs of this app opened 8 batches and then 4 — so a
  tight total fails honest runs at random. Count per subject instead.

## What must be detected

| Kind | Signal on `main` |
|---|---|
| `Postgres` | `pg` in `package.json`, `DATABASE_URL` in `.env.local` |
| `Supabase` | `@supabase/supabase-js` in `package.json` |
| `Stripe` | `stripe` in `package.json` |
| `Hubspot` | `@hubspot/api-client` in `package.json` |
| `HuggingFace` | `@huggingface/inference` in `package.json` |

All five detect on the wizard's `main`, so all five are in `minKinds` and
`optionalKinds` is empty. Move a kind to `optionalKinds` when it only detects
on an unmerged branch — an optional kind is reported and never fails the run.

`forbidKinds` covers the nearest false positives: `DATABASE_URL` is ambiguous
enough that MySQL is a plausible mis-detect, and a five-source project is where
an over-eager matcher shows up first.

## Getting started

```bash
npm install
npm run dev
```

`POST /api/tickets` takes `{ subject, body, email, stripeCustomerId }`.
