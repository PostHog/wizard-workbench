import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { usePostHog } from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  const posthog = usePostHog();
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        routeNameRef.current =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const currentRouteName =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;
        if (currentRouteName && currentRouteName !== routeNameRef.current) {
          posthog?.screen(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <Stack.Navigator
        initialRouteName={initialRouteName}
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen name="SignIn" component={SignIn} />
        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
