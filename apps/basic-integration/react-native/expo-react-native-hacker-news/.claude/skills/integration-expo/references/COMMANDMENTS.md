# Framework rules

Follow these when integrating PostHog into this framework.

- posthog-react-native is the React Native SDK package name (same as bare RN)
- Use expo-constants with app.config.js extras for POSTHOG_PROJECT_TOKEN and POSTHOG_HOST (NOT react-native-config)
- Access config via `Constants.expoConfig?.extra?.posthogProjectToken` in your posthog.ts config file
- For expo-router, wrap PostHogProvider in app/_layout.tsx and manually track screens with `posthog.screen(pathname, params)` in a useEffect
- posthog-react-native is the React Native SDK package name
- Use react-native-config to load POSTHOG_PROJECT_TOKEN and POSTHOG_HOST from .env (variables are embedded at build time, not runtime)
- react-native-svg is a required peer dependency of posthog-react-native (used by the surveys feature) and must be installed alongside it
- Place PostHogProvider INSIDE NavigationContainer for React Navigation v7 compatibility
- Remember that source code is available in the node_modules directory
- Check package.json for type checking or build scripts to validate changes
