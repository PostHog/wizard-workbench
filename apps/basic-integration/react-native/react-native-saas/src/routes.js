import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogErrorBoundary, PostHogProvider } from 'posthog-react-native';

import { posthog } from './config/posthog';
import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';

const Stack = createNativeStackNavigator();

function AppNavigator({ initialRouteName }) {
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

function AppErrorFallback() {
  return null;
}

export default function Routes({ initialRouteName }) {
  const routeNameRef = useRef();

  function captureCurrentScreen() {
    const currentRouteName = NavigationService.navigationRef.getCurrentRoute()?.name;

    if (currentRouteName && routeNameRef.current !== currentRouteName) {
      posthog?.screen(currentRouteName, {
        previous_screen: routeNameRef.current,
      });
      routeNameRef.current = currentRouteName;
    }
  }

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={captureCurrentScreen}
      onStateChange={captureCurrentScreen}
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
          <PostHogErrorBoundary fallback={AppErrorFallback}>
            <AppNavigator initialRouteName={initialRouteName} />
          </PostHogErrorBoundary>
        </PostHogProvider>
      ) : (
        <AppNavigator initialRouteName={initialRouteName} />
      )}
    </NavigationContainer>
  );
}
