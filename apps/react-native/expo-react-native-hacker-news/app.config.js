export default {
  expo: {
    name: "Hacker Native",
    slug: "hacker-native",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "myapp",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: "dev.akamfoad.hackernative",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      package: "dev.akamfoad.hackernative",
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      posthogApiKey: process.env.EXPO_PUBLIC_POSTHOG_API_KEY,
      posthogHost:
        process.env.EXPO_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
    },
  },
};
