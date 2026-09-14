# Expo error-tracking fixture

The PostHog SDK is installed. Exception capture and symbol upload are not
configured. Run `wizard error-tracking` against this app.

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
