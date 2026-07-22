# Bare React Native source-maps fixture

PostHog SDK installed, no source-map upload configured — run the wizard's
`upload-source-maps` against this app. Fill `POSTHOG_CLI_API_KEY` in `.env`
before testing an upload.

## Setup

```bash
npm install
cd ios && pod install && cd ..   # iOS only
```

## Run (dev)

```bash
npm run android
npm run ios
```

## Build Release (uploads only fire on Release)

```bash
# Android
npx react-native run-android --mode release
# or just the APK: cd android && ./gradlew assembleRelease

# iOS
npx react-native run-ios --mode Release
# or Xcode: Edit Scheme ▸ Run ▸ Build Configuration ▸ Release, then Run
```
