import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogProvider } from 'posthog-react-native';

import { posthog } from './config/posthog';
import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  const routeNameRef = useRef();

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
      onReady={() => {
        routeNameRef.current = NavigationService.navigationRef.current
          ?.getCurrentRoute()
          ?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = NavigationService.navigationRef.current
          ?.getCurrentRoute()
          ?.name;

        if (previousRouteName !== currentRouteName && currentRouteName) {
          posthog?.screen(currentRouteName, {
            previous_screen: previousRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      {posthog ? (
        <PostHogProvider client={posthog}>{navigator}</PostHogProvider>
      ) : (
        navigator
      )}
    </NavigationContainer>
  );
}
