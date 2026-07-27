# Flutter source-maps fixture

Flutter app with the PostHog SDK installed and no symbol upload configured —
run the wizard's `upload-source-maps` against it.

All three platforms are scaffolded (`web/`, `android/`, `ios/`), because Flutter
has a separate upload path per platform:

| Platform | Artifact | Uploader |
|---|---|---|
| web | dart2js source maps | `posthog-cli sourcemap process` |
| android | R8 `mapping.txt` | `com.posthog.android` Gradle plugin |
| ios | dSYMs | Xcode Run Script build phase |

`captureNativeExceptions` is on in `lib/main.dart` — without it the native SDKs
capture no crashes and the Android/iOS uploads have nothing to symbolicate.

## Setup

```bash
flutter pub get
```

## Run (dev)

```bash
flutter run -d chrome     # web
flutter run               # device / emulator
```

## Builds (these are what upload)

```bash
flutter build web --source-maps   # -> build/web (main.dart.js + .js.map)
flutter build apk --release       # -> build/app/outputs/mapping/release/mapping.txt
flutter build ipa                 # -> dSYMs, uploaded by the Xcode build phase
```

Flutter always shrinks release builds, so `mapping.txt` appears without any
`isMinifyEnabled` in `android/app/build.gradle.kts` — leave that block alone.

Serve the web build to trigger a test error against the real artifact:

```bash
python3 -m http.server 8000 --directory build/web
```
