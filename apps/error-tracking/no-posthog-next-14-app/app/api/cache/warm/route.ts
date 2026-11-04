import { CacheWarmError } from '@/lib/errors';

const REGIONS = ['us-1', 'us-2', 'eu-1'];

export async function POST(request: Request) {
  const { region } = (await request.json()) as { region: string };
  setTimeout(() => {
    if (!REGIONS.includes(region)) {
      throw new CacheWarmError(`Cache warm failed for region ${region} (CW02)`);
    }
  }, 20);
  return Response.json({ region, status: 'warming' }, { status: 202 });
}
