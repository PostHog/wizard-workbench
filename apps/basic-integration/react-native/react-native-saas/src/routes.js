import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PostHogErrorBoundary,
  PostHogProvider,
} from 'posthog-react-native';

import { isPostHogConfigured, posthog } from './config/posthog';
import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';

const Stack = createNativeStackNavigator();

function ErrorFallback() {
  return null;
}

export default function Routes({ initialRouteName }) {
  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      {isPostHogConfigured ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary fallback={ErrorFallback}>
            <Stack.Navigator
              initialRouteName={initialRouteName}
              screenOptions={{ headerShown: false }}
            >
              <Stack.Screen name="SignIn" component={SignIn} />
              <Stack.Screen name="Main" component={Main} />
            </Stack.Navigator>
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
