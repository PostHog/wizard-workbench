import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
import { Button, NativeModules, StyleSheet, Text, View } from 'react-native';

function App() {
  return (
    <PostHogProvider
      apiKey="phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA"
      options={{ host: 'https://internal-c.posthog.com' }}
    >
      <View style={styles.container}>
        <Text>Source map upload example (bare React Native)</Text>
        {/* Crashes the app natively (not a JS error). Only shows up in PostHog
            error tracking when native crash autocapture is enabled; the crash
            report uploads on the NEXT app launch. */}
        <Button
          title="Trigger native crash"
          onPress={() => NativeModules.NativeCrashTest.crash()}
        />
      </View>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;
