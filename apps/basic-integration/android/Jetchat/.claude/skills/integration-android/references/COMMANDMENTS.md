# Framework rules

Follow these when integrating PostHog into this framework.

- Adapt dependency configuration to the appropriate build.gradle(.kts) file according to the project gradle version
- Call `PostHogAndroid.setup()` only once in the Application class's `onCreate()` method, so it's initialized as early as possible and only once.
- Initialize PostHog in the Application class's `onCreate()` method
- Ensure every activity has a `android:label` to accurately track screen views.
