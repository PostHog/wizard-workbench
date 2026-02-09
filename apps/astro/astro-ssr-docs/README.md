# NeuralFlow Docs - Astro SSR Documentation Site

A production-quality server-rendered documentation site built with Astro. This example is designed for testing the PostHog Wizard against real-world Astro applications.

## Overview

This is a fully server-rendered (SSR) documentation site using `output: 'server'`. All pages are rendered on each request, enabling dynamic content like timestamps, user personalization, or CMS content.

## Key Difference from Other Variants

The `astro.config.mjs` uses server output mode:

```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'server',  // Full SSR - all pages server-rendered
  adapter: node({
    mode: 'standalone',
  }),
});
```

Each page includes a server-rendered timestamp to demonstrate SSR:

```astro
---
const renderTime = new Date().toISOString();
---

<div class="render-info">
  Server-rendered at: {renderTime}
</div>
```

## Pages

- **/** - Landing page with feature cards
- **/docs** - Introduction to NeuralFlow
- **/docs/installation** - SDK installation guide
- **/docs/quickstart** - Quick start tutorial
- **/docs/concepts** - Core concepts overview
- **/docs/workflows** - Workflow automation guide
- **/docs/automation** - Automation features
- **/docs/api** - API reference overview
- **/docs/api/authentication** - Auth documentation
- **/docs/api/endpoints** - Endpoint reference

## Tech Stack

- Astro 5.x (Server output)
- @astrojs/node adapter
- Pure CSS (no frameworks)
- No JavaScript dependencies

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The build produces a Node.js server in `dist/server/`.

## Running Production Build

```bash
node dist/server/entry.mjs
```

## PostHog Testing

This app intentionally has **no PostHog installed**. It's designed to test the PostHog Wizard's ability to:

1. Detect Astro framework
2. Identify SSR mode (output: 'server')
3. Guide users through PostHog installation
4. Suggest posthog-node for server-side tracking
5. Handle dynamic page rendering scenarios
