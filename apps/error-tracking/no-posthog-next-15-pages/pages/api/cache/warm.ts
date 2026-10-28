import type { NextApiRequest, NextApiResponse } from 'next';
import { CacheWarmError } from '@/lib/errors';

const REGIONS = ['us-1', 'us-2', 'eu-1'];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { region } = req.body as { region: string };
  setTimeout(() => {
    if (!REGIONS.includes(region)) {
      throw new CacheWarmError(`Cache warm failed for region ${region} (CW02)`);
    }
  }, 20);
  res.status(202).json({ region, status: 'warming' });
}
