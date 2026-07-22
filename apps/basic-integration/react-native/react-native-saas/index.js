/**
 * @format
 */

import { AppRegistry, ErrorUtils } from 'react-native';
import App from './src';
import { name as appName } from './app.json';
import { posthog } from './src/config/posthog';

const defaultErrorHandler = ErrorUtils.getGlobalHandler();

ErrorUtils.setGlobalHandler((error, isFatal) => {
  posthog?.captureException(error, { is_fatal: isFatal });
  defaultErrorHandler(error, isFatal);
});

AppRegistry.registerComponent(appName, () => App);
