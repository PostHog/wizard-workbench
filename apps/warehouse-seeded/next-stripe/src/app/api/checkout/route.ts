import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { toLineItems, type CartLine } from '@/lib/cart';

export async function POST(request: Request) {
  const { lines } = (await request.json()) as { lines: CartLine[] };
  const items = toLineItems(lines);

  if (items.length === 0) {
    return NextResponse.json({ error: 'empty cart' }, { status: 400 });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    line_items: items,
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/thanks`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/cart`,
  });

  return NextResponse.json({ url: session.url });
}
