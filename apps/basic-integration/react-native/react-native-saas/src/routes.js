import React, { useRef } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogErrorBoundary, PostHogProvider } from 'posthog-react-native';

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
        const previousScreen = routeNameRef.current;
        const currentScreen =
          NavigationService.navigationRef.current?.getCurrentRoute()?.name;

        if (posthog && currentScreen && currentScreen !== previousScreen) {
          posthog.screen(currentScreen, { previous_screen: previousScreen });
        }

        routeNameRef.current = currentScreen;
      }}
    >
      {posthog ? (
        <PostHogProvider client={posthog}>
          <PostHogErrorBoundary fallback={() => null}>
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
