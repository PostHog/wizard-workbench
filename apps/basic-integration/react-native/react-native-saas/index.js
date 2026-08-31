/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { posthog } from './src/config/posthog';
import App from './src';
import { name as appName } from './app.json';

const defaultErrorHandler = ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler((error, isFatal) => {
  posthog?.captureException(error, { is_fatal: isFatal });
  defaultErrorHandler(error, isFatal);
});

AppRegistry.registerComponent(appName, () => App);
