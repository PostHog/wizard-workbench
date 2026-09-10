import { readFile } from 'node:fs/promises';

const LINK_PATTERN = /\[[^\]]*\]\((https?:\/\/[^)\s]+)\)/g;

/** Pull every absolute http(s) link out of one markdown file. */
export async function linksIn(file) {
  const text = await readFile(file, 'utf8');
  return [...text.matchAll(LINK_PATTERN)].map((match) => match[1]);
}

/**
 * HEAD each link, falling back to GET for the servers that reject HEAD.
 * Runs `concurrency` requests at a time so a large docs tree does not open a
 * socket per link.
 */
export async function check(links, { concurrency, timeoutMs }) {
  const queue = [...new Set(links)];
  const broken = [];

  async function worker() {
    let url;
    while ((url = queue.shift())) {
      const status = await probe(url, timeoutMs);
      if (status >= 400) broken.push({ url, status });
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, queue.length) }, worker),
  );
  return broken;
}

async function probe(url, timeoutMs) {
  const signal = AbortSignal.timeout(timeoutMs);
  try {
    const head = await fetch(url, { method: 'HEAD', signal });
    if (head.status !== 405) return head.status;
    const get = await fetch(url, { method: 'GET', signal });
    return get.status;
  } catch {
    return 599;
  }
}
