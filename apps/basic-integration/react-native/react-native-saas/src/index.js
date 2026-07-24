import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import { PostHogProvider } from 'posthog-react-native';
import Config from 'react-native-config';

import store from './store';
import App from './App';

export default function Root() {
  return (
    <PostHogProvider
      apiKey={Config.POSTHOG_API_KEY}
      options={{ host: Config.POSTHOG_HOST }}
    >
      <Provider store={store}>
        <SafeAreaProvider>
          <App />
          <Toast />
        </SafeAreaProvider>
      </Provider>
    </PostHogProvider>
  );
}
