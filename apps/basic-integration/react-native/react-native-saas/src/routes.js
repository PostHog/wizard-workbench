import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  PostHogErrorBoundary,
  PostHogProvider,
} from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

function Navigator({ initialRouteName }) {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );
}

export default function Routes({ initialRouteName }) {
  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      {posthog ? (
        <PostHogProvider
          client={posthog}
          autocapture={{ captureScreens: false }}
        >
          <PostHogErrorBoundary>
            <Navigator initialRouteName={initialRouteName} />
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <Navigator initialRouteName={initialRouteName} />
      )}
    </NavigationContainer>
  );
}
