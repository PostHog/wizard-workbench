# React Native SaaS

A team and project management app with authentication, team switching, and member management.

## Prerequisites

- Node.js >= 20
- Xcode (for iOS)
- Android Studio (for Android)
- CocoaPods (`gem install cocoapods`)

## Setup

```sh
npm install
```

### iOS

Install CocoaPods dependencies:

```sh
cd ios
pod install
cd ..
```

### Android

No additional setup needed beyond `npm install`.

## Run

```sh
# Android
npm run android

# iOS
npm run ios
```

## Troubleshooting

### Metro can't resolve modules (e.g. `Unable to resolve module`)

Clear the Metro cache and restart:

```sh
npx react-native start --reset-cache
```

If that doesn't work, do a clean reinstall:

```sh
rm -rf node_modules
npm install
npx react-native start --reset-cache
```

### iOS build fails with Xcode error code 65

Clean Xcode derived data and reinstall pods:

```sh
rm -rf ~/Library/Developer/Xcode/DerivedData/ReactNativeSaas-*
cd ios
pod install
cd ..
npm run ios
```

If it still fails, open `ios/ReactNativeSaas.xcworkspace` in Xcode to see the actual build error.

### Android `.cxx` build artifacts

The `.cxx` directory under `android/app/` contains CMake build artifacts. These are gitignored and should not be committed.
