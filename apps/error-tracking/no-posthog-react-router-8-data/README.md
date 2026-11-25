# Shelfwise (web)

Stock tracking for a small furniture-fittings wholesaler: products, stock
adjustments, supplier reorders, reports and a supplier map. A single-page app
on React Router 8 in data mode (`createBrowserRouter`), built with Vite. The
inventory data lives in the browser for now (`src/lib/inventory.ts`).

```bash
npm ci
npm run dev                         # http://localhost:5173
npm run build && npm run preview    # http://localhost:4173
```

- `src/router.tsx` — the route table, loaders and actions
- `src/routes/` — dashboard (warehouse sync), products (CSV export, reorders),
  product pages with stock adjustments, reports, suppliers, inbound deliveries
  and the warehouse sync status
- `src/lib/` — inventory data and business rules
