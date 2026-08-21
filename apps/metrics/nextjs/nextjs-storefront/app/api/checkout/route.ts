import { NextResponse } from 'next/server';

const PAYMENT_URL = 'https://httpbin.org/status/200';

let orderCount = 0;

export async function POST(req: Request) {
  const payload = await req.json();
  orderCount += 1;
  try {
    await fetch(PAYMENT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: orderCount, ...payload }),
    });
  } catch {
    return NextResponse.json(
      { id: orderCount, status: 'payment-unreachable' },
      { status: 502 },
    );
  }
  return NextResponse.json({ id: orderCount, status: 'paid' });
}
