# Hacker Native 🆈 ⚛️

A Hacker News client for reading HN content!

<img width="400px" src="https://github.com/user-attachments/assets/db67fc81-b2fa-4c7c-9f92-f093cb4e1e9f" />

Found some [Design Inspiration]( https://dribbble.com/shots/21381309-Mobile-News-Site-Redesign-Hacker-News#) on Dribbble!

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Requirements

- Node.js 20.19.4 or higher
- npm or yarn
- Xcode 16.1+ (for iOS development)
- Android Studio (for Android development)

## Getting Started

### 1. Install dependencies

```bash
npm install --legacy-peer-deps
```

> Note: `--legacy-peer-deps` is required due to some packages not yet declaring React 19 peer dependency support.

### 2. Start the development server

```bash
npm start
```

This will start the Expo development server. You can then:

- Press `i` to open in iOS Simulator
- Press `a` to open in Android Emulator
- Press `w` to open in web browser
- Scan the QR code with Expo Go app on your device

### Running on specific platforms

```bash
# iOS Simulator
npm run ios

# iOS Device
npm run ios:device

# Android Emulator
npm run android

# Android Device
npm run android:device

# Web
npm run web
```

### Development builds

For a full native development build (required for native modules):

```bash
npx expo run:ios
# or
npx expo run:android
```

## Tech Stack

- **Expo SDK 54** with React Native 0.81
- **Expo Router 6** for file-based routing
- **React Query** for data fetching and caching
- **React Native Reanimated 4** for animations
- **Lucide Icons** for iconography

## Features

- [X] Show List of Posts
  - [X] Show link, comment and upvote count
  - [X] Restore scroll position when navigating to details and get back to list screen
  - [X] Filter home list to show between:
    - [X] topstories.json
    - [X] besttories.json
    - [X] asktories.json
    - [X] showtories.json
- [X] Show post details
  - [X] Post Details
  - [X] Post Comments
- [X] Show comment details
  - [X] Comment Details
- [X] User account
  - [X] Show User details
  - [X] Navigate user Posts, Polls or Comments
- [ ] Enhance text rendering (Code blocks (pre>code), blockquote, list, inline code (code))
