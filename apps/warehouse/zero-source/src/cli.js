#!/usr/bin/env node
import { Command } from 'commander';

import { check, linksIn } from './crawl.js';

const program = new Command()
  .name('linkcheck')
  .description('Report broken links in markdown files')
  .argument('<files...>', 'markdown files to check')
  .option('-c, --concurrency <n>', 'parallel requests', process.env.CONCURRENCY ?? '8')
  .option('-t, --timeout <ms>', 'per-request timeout', process.env.REQUEST_TIMEOUT_MS ?? '5000');

program.action(async (files, options) => {
  const links = (await Promise.all(files.map(linksIn))).flat();
  const broken = await check(links, {
    concurrency: Number(options.concurrency),
    timeoutMs: Number(options.timeout),
  });

  for (const { url, status } of broken) {
    console.error(`${status}  ${url}`);
  }
  process.exit(broken.length > 0 ? 1 : 0);
});

program.parse();
