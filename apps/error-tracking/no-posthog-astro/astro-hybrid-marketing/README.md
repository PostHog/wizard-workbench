# NeuralFlow AI - Astro Hybrid Marketing Site

A production-quality Astro hybrid site with static marketing pages and server-rendered API routes. This example is designed for testing the PostHog Wizard against real-world Astro applications.

## Overview

This site uses Astro 5's hybrid rendering: static pages by default with opt-in server rendering for specific routes. The contact form API route uses `export const prerender = false` to run on the server.

## Key Difference from Static Variant

The `astro.config.mjs` includes a Node adapter:

```javascript
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

export default defineConfig({
  output: 'static',  // Default static, opt-in to SSR per route
  adapter: node({
    mode: 'standalone',
  }),
});
```

And the API route has `prerender = false`:

```typescript
// src/pages/api/contact.ts
export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Server-side logic
};
```

## Pages

- **/** - Landing page with hero, features overview (static)
- **/features** - Detailed feature descriptions (static)
- **/pricing** - Pricing tiers (static)
- **/about** - Company info and team (static)
- **/contact** - Contact form with server-side API (static page, SSR API)
- **/api/contact** - POST endpoint for form submissions (SSR)

## Tech Stack

- Astro 5.x (Hybrid output)
- @astrojs/node adapter
- Pure CSS (no frameworks)
- Vanilla JavaScript for form handling

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## PostHog Testing

This app intentionally has **no PostHog installed**. It's designed to test the PostHog Wizard's ability to:

1. Detect Astro framework
2. Identify hybrid mode (adapter present + static output)
3. Guide users through PostHog installation
4. Suggest posthog-node for server-side tracking in API routes
