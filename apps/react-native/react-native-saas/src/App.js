import React from 'react';
import { useSelector } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import Routes from './routes';

export default function App() {
  const auth = useSelector(state => state.auth);

  if (!auth.authChecked) return null;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Routes initialRouteName={auth.signedIn ? 'Main' : 'SignIn'} />
    </GestureHandlerRootView>
  );
}
