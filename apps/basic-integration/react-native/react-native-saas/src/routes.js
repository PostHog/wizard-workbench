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

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        routeNameRef.current =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;
        if (previousRouteName !== currentRouteName) {
          posthog.screen(currentRouteName);
        }
        routeNameRef.current = currentRouteName;
      }}
    >
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
        }}
      >
        <Stack.Navigator
          initialRouteName={initialRouteName}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="SignIn" component={SignIn} />
          <Stack.Screen name="Main" component={Main} />
        </Stack.Navigator>
      </PostHogProvider>
    </NavigationContainer>
  );
}
