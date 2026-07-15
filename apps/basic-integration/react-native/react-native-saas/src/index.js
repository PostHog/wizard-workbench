import React from 'react';
import { Provider } from 'react-redux';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import store from './store';
import App from './App';

export default function Root() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <App />
        <Toast />
      </SafeAreaProvider>
    </Provider>
  );
}
