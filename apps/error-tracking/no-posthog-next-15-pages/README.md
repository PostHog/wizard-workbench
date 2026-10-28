# Ledgerly

A small invoicing app: invoices, a revenue report and a customer portal.
Next.js 15 with the Pages Router.

```bash
npm ci
npm run dev        # http://localhost:3000
npm run build && npm start
```

- `pages/invoices/[id].tsx` — invoice pages (server-rendered), with PDF
  download, reminders and CSV export
- `pages/reports.tsx` — revenue report with a selectable range
- `pages/portal/[tenant].tsx` — customer portal, resolved per tenant in
  `middleware.ts`
- `pages/api` — PDF rendering, reminders, CSV exports, cache warm-up and a
  tax-region lookup that runs on the edge
- `lib/` — invoice data and billing rules
