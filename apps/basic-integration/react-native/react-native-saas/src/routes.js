import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostHogProvider } from 'posthog-react-native';

import Main from './pages/Main';
import SignIn from './pages/SignIn';
import NavigationService from './services/navigation';
import { posthog } from './config/posthog';

const Stack = createNativeStackNavigator();

export default function Routes({ initialRouteName }) {
  const routeNameRef = React.useRef();
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
        routeNameRef.current =
          NavigationService.navigationRef.getCurrentRoute()?.name;
        if (routeNameRef.current) {
          posthog?.screen(routeNameRef.current);
        }
      }}
      onStateChange={() => {
        const routeName =
          NavigationService.navigationRef.getCurrentRoute()?.name;
        if (routeName && routeName !== routeNameRef.current) {
          posthog?.screen(routeName);
        }
        routeNameRef.current = routeName;
      }}
    >
      {posthog ? (
        <PostHogProvider
          client={posthog}
          autocapture={{ captureScreens: false, captureTouches: true }}
        >
          {navigator}
        </PostHogProvider>
      ) : (
        navigator
      )}
    </NavigationContainer>
  );
}
