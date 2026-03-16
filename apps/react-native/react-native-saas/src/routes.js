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
  return (
    <NavigationContainer ref={NavigationService.navigationRef}>
      <PostHogProvider client={posthog} autocapture>
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
