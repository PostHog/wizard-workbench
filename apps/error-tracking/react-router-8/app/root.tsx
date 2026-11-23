import {
  isRouteErrorResponse,
  Links,
  Meta,
  NavLink,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import { usePostHog } from "@posthog/react";

import type { Route } from "./+types/root";
import "./app.css";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <header>
          <strong>Shelfwise</strong>
          <NavLink to="/">Dashboard</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/reports">Reports</NavLink>
          <NavLink to="/suppliers">Suppliers</NavLink>
        </header>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const posthog = usePostHog();
  posthog?.captureException(error);

  let message = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Not found" : `Error ${error.status}`;
    details = typeof error.data === "string" ? error.data : error.statusText || details;
  } else if (import.meta.env.DEV && error instanceof Error) {
    details = error.message;
  }

  return (
    <main>
      <h1>{message}</h1>
      <p className="error">{details}</p>
    </main>
  );
}
