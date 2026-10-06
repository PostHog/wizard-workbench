import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogProvider } from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import { posthog } from './config/posthog';
import NavigationService from './services/navigation';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  const routeNameRef = useRef();

  function getCurrentRouteName() {
    return NavigationService.navigationRef.current?.getCurrentRoute()?.name;
  }

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        const currentRouteName = getCurrentRouteName();
        routeNameRef.current = currentRouteName;

        if (currentRouteName && posthog) {
          posthog.screen(currentRouteName);
        }
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = getCurrentRouteName();

        if (currentRouteName && previousRouteName !== currentRouteName && posthog) {
          posthog.screen(currentRouteName, {
            previous_screen: previousRouteName,
          });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      {posthog ? (
        <PostHogProvider
          client={posthog}
          autocapture={{
            captureScreens: false,
            captureTouches: true,
            propsToCapture: ['testID'],
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
