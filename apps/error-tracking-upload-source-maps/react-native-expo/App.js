import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { Button, StyleSheet, Text, View } from 'react-native';
import NativeCrashTest from './modules/native-crash-test';

export default function App() {
  return (
    <PostHogProvider
      apiKey="phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA"
      options={{ host: 'https://internal-c.posthog.com' }}
    >
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
        {/* Crashes the app natively (not a JS error). Only shows up in PostHog
            error tracking when native crash autocapture is enabled; the crash
            report uploads on the NEXT app launch. */}
        <Button title="Trigger native crash" onPress={() => NativeCrashTest.crash()} />
        <StatusBar style="auto" />
      </View>
    </PostHogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
