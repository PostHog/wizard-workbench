# posthog-migrate

A playground app showing how bloated a multi-vendor observability stack gets, and why you should use PostHog instead.

## The Vendor Stack

This app wires up **three** separate vendors into a single page:

| Vendor | Product | Cost |
|--------|---------|------|
| [LaunchDarkly](https://launchdarkly.com) | Feature flags | $8.33/mo+ |
| [Amplitude](https://amplitude.com) | Product analytics | $49/mo+ |
| [Braintrust](https://braintrust.dev) | LLM analytics | $50/mo+ |

**Total: $107.33/mo minimum**, plus ~250KB of JavaScript SDKs.

## The Alternative

[PostHog](https://posthog.com) replaces all three with one SDK (~45KB), one dashboard, and a free tier up to 1M events/mo.

## Quick Start

```bash
pnpm install
cp .env.example .env.local
# Fill in your API keys (all optional, app degrades gracefully)
pnpm dev
```

## Environment Variables

```bash
# LaunchDarkly (feature flags)
NEXT_PUBLIC_LAUNCHDARKLY_CLIENT_ID=

# Amplitude (product analytics)
NEXT_PUBLIC_AMPLITUDE_API_KEY=

# Braintrust + OpenAI (LLM analytics)
BRAINTRUST_API_KEY=
PROJECT_NAME=posthog-migrate
BRAINTRUST_PROJECT_NAME=posthog-migrate
OPENAI_API_KEY=
```

Every vendor SDK degrades gracefully when its keys are missing.

## Tech Stack

- [Next.js 16](https://nextjs.org) with Turbopack
- [Vercel AI SDK](https://ai-sdk.dev) for LLM calls
- [Tailwind CSS v4](https://tailwindcss.com) + [@ras-sh/ui](https://www.npmjs.com/package/@ras-sh/ui)

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start Next.js dev server |
| `pnpm build` | Production build |
| `pnpm lint` | Run oxlint |
| `pnpm format` | Run oxfmt |
| `pnpm fix` | Auto-fix lint + format |
| `pnpm check-types` | TypeScript type checking |

## License

MIT
