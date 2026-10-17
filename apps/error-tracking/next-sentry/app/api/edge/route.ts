import { NextResponse, type NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const region = request.headers.get("x-vercel-ip-country") ?? "unknown";

  if (request.nextUrl.searchParams.has("fail")) {
    throw new Error(`Edge health check failed for region ${region}`);
  }

  return NextResponse.json({ ok: true, region, at: new Date().toISOString() });
}
