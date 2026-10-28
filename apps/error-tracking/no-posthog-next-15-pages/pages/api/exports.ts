import type { NextApiRequest, NextApiResponse } from 'next';
import { ExportWriteError } from '@/lib/errors';

async function writeExport(batch: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (batch.startsWith('EX-7')) {
    throw new ExportWriteError(`CSV export batch ${batch} failed to write (EX77)`);
  }
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { batch } = req.body as { batch: string };
  void writeExport(batch);
  res.status(202).json({ batch, status: 'started' });
}
