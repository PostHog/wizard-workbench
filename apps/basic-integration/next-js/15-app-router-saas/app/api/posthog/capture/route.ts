import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // This endpoint intentionally does not send events server-side; it proxies client-side events
    // to the PostHog ingest endpoint via the browser. We respond 200 to confirm receipt.
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Failed to parse posthog capture request', err);
    return NextResponse.json({ ok: false }, { status: 400 });
  }
}
