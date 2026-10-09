import notifee from '@notifee/react-native';
import { register } from '@videosdk.live/react-native-sdk';
import { AppRegistry, Platform } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

register();

if (Platform.OS === 'android') {
  notifee.registerForegroundService(() => new Promise(() => {}));
}

AppRegistry.registerComponent(appName, () => App);
