import { createBrowserRouter } from "react-router";

import { Layout, LayoutErrorBoundary } from "./routes/layout";
import { Home, homeLoader } from "./routes/home";
import { Products, productsLoader } from "./routes/products";
import { ProductPage, productAction, productLoader } from "./routes/product";
import { reorderAction } from "./routes/product-reorder";
import { Reports } from "./routes/reports";
import { Suppliers } from "./routes/suppliers";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    ErrorBoundary: LayoutErrorBoundary,
    children: [
      { index: true, Component: Home, loader: homeLoader },
      { path: "products", Component: Products, loader: productsLoader },
      { path: "products/:sku", Component: ProductPage, loader: productLoader, action: productAction },
      { path: "products/:sku/reorder", action: reorderAction },
      { path: "reports", Component: Reports },
      { path: "suppliers", Component: Suppliers },
    ],
  },
]);
