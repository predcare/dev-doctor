import notifee from '@notifee/react-native';
import { register } from '@videosdk.live/react-native-sdk';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { startCallKeepListeners } from './src/services/calls/callService';
import {
  registerBackgroundNotificationHandler,
  registerBackgroundPushHandler,
} from './src/services/notifications';

registerBackgroundNotificationHandler();
registerBackgroundPushHandler();
// Answer and Decline on the call notification / CallKit, also when only the background JS is running.
startCallKeepListeners().catch(err => console.warn('[CallKeep] Listener setup failed:', err));
register();

if (Platform.OS === 'android') {
  notifee.registerForegroundService(() => new Promise(() => {}));
}

AppRegistry.registerComponent(appName, () => App);
