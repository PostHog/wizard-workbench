# PostHog source map upload setup

## Changes made

- `package.json`
- `package-lock.json`
- `tsconfig.json`
- `.env`

The TypeScript build now emits external source maps with embedded source content. The production build then runs PostHog CLI processing against `dist`, injecting chunk IDs and uploading the matching source maps.

## Commands

Production build and upload:

```sh
npm run build
```

Expanded build/upload command:

```sh
tsc && posthog-cli --dotenv-file .env sourcemap process --directory ./dist --release-name node-raw
```

Run the built application:

```sh
npm run start
```

## Environment keys

The following keys are configured in the gitignored `.env` file:

- `POSTHOG_CLI_API_KEY`
- `POSTHOG_CLI_PROJECT_ID`
- `POSTHOG_CLI_HOST`

No secret values are included in this report.

## CI/CD follow-up

No Dockerfile or CI/CD configuration exists in this project, so no deployment pipeline could be traced or edited. Wherever `npm run build` runs in production, provide these environment variables through that platform's secret store:

- `POSTHOG_CLI_API_KEY`
- `POSTHOG_CLI_PROJECT_ID`
- `POSTHOG_CLI_HOST`

Do not create a `.env` file in CI or commit the personal API key. The build command keeps `--dotenv-file .env`; real CI environment variables take precedence, and a missing dotenv file is skipped with a warning.

## Verification

A temporary direct `captureException` test was added, exercised through the production build/run flow, and reverted. The permanent source-map configuration remains.

1. Run `npm run build` for every production release.
2. Confirm a new upload appears on the [PostHog Symbol sets page](https://us.posthog.com/project/228144/error_tracking/configuration).
3. Trigger a captured production exception and confirm its stack trace resolves to original TypeScript source rather than generated JavaScript paths.
