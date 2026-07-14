/**
 * @format
 */

import { AppRegistry } from 'react-native';
import { AppWithPostHog } from './src';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppWithPostHog);
