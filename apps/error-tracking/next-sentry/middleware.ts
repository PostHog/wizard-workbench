import { NextResponse, type NextRequest } from "next/server";

const LEGACY_PREFIX = "/app";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Old bookmarks still point at /app/*; send them to the new routes.
  if (pathname === LEGACY_PREFIX || pathname.startsWith(`${LEGACY_PREFIX}/`)) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.slice(LEGACY_PREFIX.length) || "/";
    return NextResponse.redirect(url);
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-request-id", crypto.randomUUID());

  const response = NextResponse.next({ request: { headers: requestHeaders } });
  response.headers.set("x-frame-options", "DENY");
  return response;
}

export const config = {
  // Skip static assets and the Sentry tunnel route.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|monitoring).*)"],
};
