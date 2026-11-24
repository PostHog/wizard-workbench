# Shelfwise

Stock tracking for a small furniture-fittings wholesaler: products, stock
adjustments, supplier reorders, reports and per-customer store fronts.
React Router 8 in framework mode, server-rendered and served by
`react-router-serve`.

```bash
npm ci
npm run dev                      # http://localhost:5173
npm run build && npm start       # http://localhost:3000
```

- `app/routes/products*.tsx` — product list (CSV export, reorders) and product
  pages with the stock ledger and stock adjustments
- `app/routes/reports.tsx`, `forecast.tsx` — stock turnover by range and a
  streamed demand forecast
- `app/routes/suppliers.tsx` — suppliers and their delivery-zone map
- `app/routes/deliveries.tsx` — inbound deliveries from the carriers' tracking feed
- `app/routes/warehouse-sync.tsx` — warehouse sync status
- `app/routes/order.tsx` — recent orders, read from the browser's order cache
- `app/routes/store.tsx` — customer store fronts, resolved per tenant
- `app/routes/api.*.ts` — shelf labels and warehouse sync
- `app/lib/` — inventory data and business rules
