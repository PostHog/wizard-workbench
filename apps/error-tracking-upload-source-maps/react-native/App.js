import React from 'react';
import { PostHogProvider } from 'posthog-react-native';
import { StyleSheet, Text, View } from 'react-native';

function App() {
  return (
    <PostHogProvider
      apiKey="phc_raG2H9V246hkNZk6K89DZGG98qQyPrKKlicifGlpOXA"
      options={{ host: 'https://internal-c.posthog.com' }}
    >
      <View style={styles.container}>
        <Text>Source map upload example (bare React Native)</Text>
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
