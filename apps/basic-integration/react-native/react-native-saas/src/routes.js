import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogProvider, PostHogErrorBoundary } from 'posthog-react-native';
import { View, Text } from 'react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

function ErrorFallback({ error }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Something went wrong. Please restart the app.</Text>
      {__DEV__ && <Text>{error?.message}</Text>}
    </View>
  );
}

export default function Routes({ initialRouteName }) {
  const routeNameRef = useRef();

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={() => {
        routeNameRef.current = NavigationService.navigationRef.current?.getCurrentRoute()?.name;
      }}
      onStateChange={() => {
        const previousRouteName = routeNameRef.current;
        const currentRouteName = NavigationService.navigationRef.current?.getCurrentRoute()?.name;

        if (previousRouteName !== currentRouteName && currentRouteName) {
          posthog.screen(currentRouteName, { previous_screen: previousRouteName });
        }

        routeNameRef.current = currentRouteName;
      }}
    >
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
          propsToCapture: ['testID'],
        }}
      >
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
    </NavigationContainer>
  );
}
