import type { NextRequest } from 'next/server';
import { TaxRegionError } from '@/lib/errors';

export const config = { runtime: 'edge' };

const TAX_REGIONS: Record<string, string> = { US: 'us-sales-tax', DE: 'eu-vat', GB: 'uk-vat', PL: 'eu-vat' };

export default async function handler(request: NextRequest) {
  const country = request.nextUrl.searchParams.get('country') ?? 'US';
  const region = TAX_REGIONS[country];
  if (!region) {
    throw new TaxRegionError(`No tax region for country ${country} (GX01)`);
  }
  return Response.json({ country, region });
}
