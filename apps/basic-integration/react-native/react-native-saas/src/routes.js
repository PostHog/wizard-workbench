import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogErrorBoundary, PostHogProvider } from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

function ErrorFallback() {
  return (
    <View>
      <Text>Something went wrong. Please restart the app.</Text>
    </View>
  );
}

export default function Routes({ initialRouteName }) {
  const routeNameRef = React.useRef();

  function handleNavigationReady() {
    routeNameRef.current = NavigationService.navigationRef.current?.getCurrentRoute()?.name;
  }

  function handleNavigationStateChange() {
    const previousScreen = routeNameRef.current;
    const currentScreen = NavigationService.navigationRef.current?.getCurrentRoute()?.name;

    if (currentScreen && currentScreen !== previousScreen) {
      posthog?.screen(currentScreen, { previous_screen: previousScreen });
    }

    routeNameRef.current = currentScreen;
  }

  return (
    <NavigationContainer
      ref={NavigationService.navigationRef}
      onReady={handleNavigationReady}
      onStateChange={handleNavigationStateChange}
    >
      {posthog ? (
        <PostHogProvider client={posthog}>
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
