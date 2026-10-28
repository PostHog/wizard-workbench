import { TaxRegionError } from '@/lib/errors';

export const runtime = 'edge';

const TAX_REGIONS: Record<string, string> = { US: 'us-sales-tax', DE: 'eu-vat', GB: 'uk-vat', PL: 'eu-vat' };

export async function GET(request: Request) {
  const country = new URL(request.url).searchParams.get('country') ?? 'US';
  const region = TAX_REGIONS[country];
  if (!region) {
    throw new TaxRegionError(`No tax region for country ${country} (GX01)`);
  }
  return Response.json({ country, region });
}
