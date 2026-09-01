/**
 * @format
 */

import {AppRegistry} from 'react-native';
import {getMessaging, setBackgroundMessageHandler} from '@react-native-firebase/messaging';
import App from './App';
import {name as appName} from './app.json';

// Register background messaging handler for when app is killed or in background
const messagingInstance = getMessaging();
setBackgroundMessageHandler(messagingInstance, async remoteMessage => {
  console.log('[FCM] Background Message Handler Received:', remoteMessage);
});

AppRegistry.registerComponent(appName, () => App);
