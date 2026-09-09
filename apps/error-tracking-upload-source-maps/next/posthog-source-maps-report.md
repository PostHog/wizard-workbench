# PostHog Source Map Upload — Setup Report

## Files changed

| File | Change |
|------|--------|
| `next.config.ts` | Wrapped config with `withPostHogConfig` from `@posthog/nextjs-config` |
| `package.json` | Added `@posthog/nextjs-config` dependency |
| `.env.local` | Updated `POSTHOG_API_KEY` and `POSTHOG_PROJECT_ID` |

## Environment variables set (`.env.local`)

| Variable | Purpose |
|----------|---------|
| `POSTHOG_API_KEY` | Personal API key for source map upload (write access) |
| `POSTHOG_PROJECT_ID` | PostHog project ID (`228144`) |
| `NEXT_PUBLIC_POSTHOG_HOST` | PostHog host (already present, used by plugin) |

**Never commit `.env.local`** — it contains your personal API key.

## Build command (uploads source maps)

```
npm run build
```

The `withPostHogConfig` wrapper in `next.config.ts` automatically injects chunk IDs and uploads source maps to PostHog during every production build.

## Run command

```
npm run start
```

## CI / Deploy setup — manual action required

No CI configuration or Dockerfile was found in this project. Wherever your production build runs (CI runner, build server, hosting platform), you must make these environment variables available as secrets **before** the `npm run build` step:

| Variable | Where to set |
|----------|-------------|
| `POSTHOG_API_KEY` | Your CI/hosting provider's secret store |
| `POSTHOG_PROJECT_ID` | Your CI/hosting provider's environment settings |
| `NEXT_PUBLIC_POSTHOG_HOST` | Your CI/hosting provider's environment settings |

**Examples by provider:**
- **Vercel**: Project Settings → Environment Variables
- **GitHub Actions**: Settings → Secrets and variables → Actions → `POSTHOG_API_KEY`, then reference with `${{ secrets.POSTHOG_API_KEY }}`
- **GitLab CI**: Settings → CI/CD → Variables
- **Netlify / Cloudflare Pages**: Site settings → Environment variables

## Test affordance

A temporary "Test PostHog Error Tracking" button was added to `app/page.tsx` and then **reverted** after testing.

## How to verify the upload

After your next production build:

1. Open the **Symbol sets** page in PostHog:
   https://us.posthog.com/project/228144/error_tracking/configuration

2. A new symbol set entry should appear after `npm run build` completes.

3. To confirm stack traces resolve correctly, trigger an error in production and check Error Tracking — stack frames should point at original source file lines, not minified bundle paths.
