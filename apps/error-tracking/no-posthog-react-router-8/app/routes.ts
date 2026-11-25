import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("products", "routes/products.tsx"),
  route("products/:sku", "routes/product.tsx"),
  route("products/:sku/reorder", "routes/product-reorder.ts"),
  route("reports", "routes/reports.tsx"),
  route("reports/forecast", "routes/forecast.tsx"),
  route("suppliers", "routes/suppliers.tsx"),
  route("deliveries", "routes/deliveries.tsx"),
  route("warehouse-sync", "routes/warehouse-sync.tsx"),
  route("orders/:id", "routes/order.tsx"),
  route("stores/:tenant", "routes/store.tsx"),
  route("api/products/:sku/label", "routes/api.label.ts"),
  route("api/sync", "routes/api.sync.ts"),
] satisfies RouteConfig;
