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
        // Store the initial route name
        routeNameRef.current =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        // Track screen views manually for React Navigation v7
        const previousRouteName = routeNameRef.current;
        const currentRouteName =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName && currentRouteName) {
          // Capture screen view event
          posthog.screen(currentRouteName, {
            previous_screen: previousRouteName,
          });
        }

        // Update the stored route name
        routeNameRef.current = currentRouteName;
      }}
    >
      {/*
        PostHogProvider is placed INSIDE NavigationContainer for React Navigation v7.

        For React Navigation v7, we disable automatic screen capture and handle it
        manually via onStateChange above. Touch event autocapture is still enabled.

        @see https://posthog.com/docs/libraries/react-native#with-react-navigationnative-and-autocapture
      */}
      <PostHogProvider
        client={posthog}
        autocapture={{
          // Disable automatic screen capture for React Navigation v7
          // We handle screen tracking manually via NavigationContainer.onStateChange
          captureScreens: false,
          // Enable touch event autocapture
          captureTouches: true,
          // Limit which props are captured for touch events
          propsToCapture: ['testID'],
          // Maximum number of elements captured in touch event hierarchy
          maxElementsCaptured: 20,
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
