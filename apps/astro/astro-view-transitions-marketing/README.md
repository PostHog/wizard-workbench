# NeuralFlow AI - Astro View Transitions Marketing Site

A production-quality Astro site using View Transitions (ClientRouter) for smooth page navigation. This example is designed for testing the PostHog Wizard against real-world Astro applications.

## Overview

This site uses Astro's View Transitions API for SPA-like navigation while maintaining static generation. It represents a common pattern for marketing sites that want smooth transitions without a full SPA.

## Key Difference from Static Variant

The `Layout.astro` includes `<ViewTransitions />` from `astro:transitions`:

```astro
---
import { ViewTransitions } from 'astro:transitions';
---

<html>
  <head>
    <ViewTransitions />
  </head>
  ...
</html>
```

## Pages

- **/** - Landing page with hero, features overview
- **/features** - Detailed feature descriptions
- **/pricing** - Pricing tiers (Starter, Pro, Enterprise)
- **/about** - Company info and team
- **/docs** - Documentation hub

## Tech Stack

- Astro 5.x (Static output with View Transitions)
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

## PostHog Testing

This app intentionally has **no PostHog installed**. It's designed to test the PostHog Wizard's ability to:

1. Detect Astro framework
2. Identify View Transitions mode (by detecting `ViewTransitions` import)
3. Generate PostHog component with `__posthog_initialized` guard
4. Configure `capture_pageview: 'history_change'` for soft navigation
