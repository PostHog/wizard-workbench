# Ledgerly

A small invoicing app: invoices, a revenue report, account settings and a
customer portal. Next.js 14 with the App Router.

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
- `app/portal/[tenant]` — customer portal, resolved per tenant in `middleware.ts`
- `app/api` — PDF rendering, reminders, CSV exports, cache warm-up and a tax-region lookup that runs on the edge
- `lib/` — invoice data and billing rules
