import { StatusBar } from 'expo-status-bar';
import { PostHogProvider } from 'posthog-react-native';
import { StyleSheet, Text, View } from 'react-native';

export default function App() {
  return (
    <PostHogProvider
      apiKey="phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA"
      options={{ host: 'https://internal-c.posthog.com' }}
    >
      <View style={styles.container}>
        <Text>Open up App.js to start working on your app!</Text>
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
