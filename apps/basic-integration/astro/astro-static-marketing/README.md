# NeuralFlow AI - Astro Static Marketing Site

A production-quality Astro static site showcasing a fictional AI SaaS product. This example is designed for testing the PostHog Wizard against real-world Astro applications.

## Overview

This is a pure static (SSG) Astro site with no server-side rendering or view transitions. It represents the most common Astro use case: marketing and landing pages.

## Pages

- **/** - Landing page with hero, features overview
- **/features** - Detailed feature descriptions
- **/pricing** - Pricing tiers (Starter, Pro, Enterprise)
- **/about** - Company info and team
- **/docs** - Documentation hub

## Tech Stack

- Astro 5.x (Static output)
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

Output is in `dist/` folder, ready for static hosting.

## PostHog Testing

This app intentionally has **no PostHog installed**. It's designed to test the PostHog Wizard's ability to:

1. Detect Astro framework
2. Identify static rendering mode
3. Guide users through PostHog installation
4. Generate appropriate `posthog.astro` component
