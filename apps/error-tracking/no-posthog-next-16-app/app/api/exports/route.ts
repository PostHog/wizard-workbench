import { ExportWriteError } from '@/lib/errors';

async function writeExport(batch: string): Promise<void> {
  await new Promise((resolve) => setTimeout(resolve, 50));
  if (batch.startsWith('EX-7')) {
    throw new ExportWriteError(`CSV export batch ${batch} failed to write (EX77)`);
  }
}

export async function POST(request: Request) {
  const { batch } = (await request.json()) as { batch: string };
  void writeExport(batch);
  return Response.json({ batch, status: 'started' }, { status: 202 });
}
