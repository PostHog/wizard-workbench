import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import {
  PostHogErrorBoundary,
  PostHogProvider,
} from 'posthog-react-native';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary>
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
