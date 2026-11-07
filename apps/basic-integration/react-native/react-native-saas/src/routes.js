import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogProvider } from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  const routeNameRef = useRef();

  function captureScreenView() {
    const currentRouteName =
      NavigationService.navigationRef.current?.getCurrentRoute()?.name;
    const previousRouteName = routeNameRef.current;

    if (currentRouteName && currentRouteName !== previousRouteName && posthog) {
      try {
        posthog.screen(currentRouteName, { previous_screen: previousRouteName });
      } catch (error) {
        if (__DEV__) {
          console.error('PostHog could not capture the screen view', error);
        }
      }
    }

    routeNameRef.current = currentRouteName;
  }

  const navigator = (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="Main" component={Main} />
    </Stack.Navigator>
  );

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={captureScreenView}
      onStateChange={captureScreenView}
    >
      {posthog ? (
        <PostHogProvider client={posthog}>{navigator}</PostHogProvider>
      ) : (
        navigator
      )}
    </NavigationContainer>
  );
}
