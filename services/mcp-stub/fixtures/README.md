# Recorded fixtures

Every file here is **recorded from production**, never hand-authored. Each one
carries a `_recorded` header saying when it was captured, from where, and how.

Refresh them with:

```bash
POSTHOG_PERSONAL_API_KEY=phx_... pnpm mcp-stub:record
```

The recorder talks to `https://mcp.posthog.com/mcp` over the same Streamable
HTTP transport the wizard uses, drives the same `exec` grammar, and writes
these files back. Read [`../record.ts`](../record.ts) for the exact commands it
runs — they are the same ones a human would type.

## The files

| File | What it holds | How it was captured |
|---|---|---|
| `tool-info.json` | `info <tool>` output for the four tools the warehouse flow uses | `exec info <tool>` |
| `tool-search.json` | the tool-name list `search` returns | `exec search external-data-sources` |
| `sources-wizard.json` | per-kind credential field schemas | `exec call external-data-sources-wizard {"source_type": "..."}` |
| `db-schema.json` | table lists per kind, and the validation errors prod returns | `exec call external-data-sources-db-schema ...` |

## Redaction

The recorder runs a redaction pass before it writes. Two things get replaced:

1. **Internal hostnames.** Prod error messages quote the request URL, which
   names an internal cluster service. The recorder rewrites that origin to
   `https://app.posthog.example/…`. The status code and the message body — the
   parts the wizard's agent reads — are kept byte-for-byte.
2. **Anything key-shaped.** Values matching a known credential prefix
   (`phx_`, `phc_`, `sk_`, `rk_`, `hf_`, `pat-`) or a field the source wizard
   marks `secret: true` are replaced with `<redacted>`.

No fixture in this directory contains a real credential. If you add a capture
that could, redact it in `record.ts` rather than in the output file, so the
next refresh does not undo the fix.

## What is recorded, and what is not

`db-schema.json` splits into two halves.

- The **errors** are verbatim prod responses. They are the load-bearing part:
  a fixture asserts that the run reports a failed source honestly, and it can
  only do that if the failure looks like a real one.
- The **table lists** are recorded per kind where prod can produce one without
  live credentials — the SaaS kinds, whose object set is fixed by the vendor's
  API. A database kind's table list is a property of the customer's database,
  so prod cannot supply one. Those entries are marked
  `"source": "synthesized"` in the file and carry a small, plainly generic set
  of tables. The recorder does not overwrite an entry it cannot capture.
