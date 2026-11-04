# Ledgerly

A small invoicing app: invoices, a revenue report, account settings and a
customer portal. Next.js 16 with the App Router.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start
```

- `app/invoices` — invoice list, invoice pages (PDF download, reminders, CSV
  export) and the new-invoice form (server action)
- `app/reports` — revenue report with a selectable range
- `app/settings` — preferences, including an import of settings saved by the
  old app
- `app/portal/[tenant]` — customer portal, resolved per tenant in `proxy.ts`
- `app/api` — PDF rendering, reminders, payment webhooks, CSV exports, cache
  warm-up and a tax-region lookup that runs on the edge
- `lib/` — invoice data and billing rules; `lib/posthog-server.ts` is the
  server-side PostHog client
- `instrumentation-client.ts` — PostHog product analytics in the browser
