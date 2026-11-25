import { createBrowserRouter } from "react-router";

import { Layout, LayoutErrorBoundary } from "./routes/layout";
import { Home, homeLoader } from "./routes/home";
import { Products, productsLoader } from "./routes/products";
import { ProductErrorBoundary, ProductPage, productAction, productLoader } from "./routes/product";
import { reorderAction } from "./routes/product-reorder";
import { Reports } from "./routes/reports";
import { Suppliers, SuppliersErrorBoundary } from "./routes/suppliers";
import { Deliveries, deliveriesLoader } from "./routes/deliveries";
import { WarehouseSync, warehouseSyncLoader } from "./routes/warehouse-sync";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: LayoutErrorBoundary,
    children: [
      { index: true, Component: Home, loader: homeLoader },
      { path: "products", Component: Products, loader: productsLoader },
      {
        path: "products/:sku",
        Component: ProductPage,
        ErrorBoundary: ProductErrorBoundary,
        loader: productLoader,
        action: productAction,
      },
      { path: "products/:sku/reorder", action: reorderAction },
      { path: "reports", Component: Reports },
      { path: "suppliers", Component: Suppliers, ErrorBoundary: SuppliersErrorBoundary },
      { path: "deliveries", Component: Deliveries, loader: deliveriesLoader },
      { path: "warehouse-sync", Component: WarehouseSync, loader: warehouseSyncLoader },
    ],
  },
]);
