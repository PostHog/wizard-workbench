import { isRouteErrorResponse, NavLink, Outlet, useRouteError } from "react-router";

function Header() {
  return (
    <header>
      <strong>Shelfwise</strong>
      <NavLink to="/">Dashboard</NavLink>
      <NavLink to="/products">Products</NavLink>
      <NavLink to="/reports">Reports</NavLink>
      <NavLink to="/suppliers">Suppliers</NavLink>
    </header>
  );
}

export function Layout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}

export function LayoutErrorBoundary() {
  const error = useRouteError();
  let message = "Something went wrong";
  let details = "An unexpected error occurred. Please try again.";
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "Not found" : `Error ${error.status}`;
    details = typeof error.data === "string" ? error.data : error.statusText || details;
  }
  return (
    <>
      <Header />
      <main>
        <h1>{message}</h1>
        <p className="error">{details}</p>
      </main>
    </>
  );
}
