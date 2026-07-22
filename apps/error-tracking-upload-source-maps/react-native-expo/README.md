# Expo source-maps fixture

PostHog SDK installed, no source-map upload configured — run the wizard's
`upload-source-maps` against this app. Fill `POSTHOG_CLI_API_KEY` in `.env`
before testing an upload. No `android/`/`ios/` dirs on purpose: the PostHog
Expo config plugin injects the build hooks at prebuild.

## Setup

```bash
npm install
```

## Run (dev)

```bash
npx expo start        # or: npm run android / npm run ios
```

## Build Release (uploads only fire on Release native builds)

```bash
npx expo prebuild     # generates android/ and ios/

npx expo run:android --variant release
npx expo run:ios --configuration Release
```
