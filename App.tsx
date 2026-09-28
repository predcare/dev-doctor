import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BackdropLoader from './src/components/commons/BackdropLoader/BackdropLoader';
import EventListener from './src/components/commons/EventListener/EventListener';
import { GlobalIncomingCallBanner } from './src/components/commons/IncomingCallBanner';
import GlobalPopupAlert from './src/components/commons/PopupAlert/GlobalPopupAlert';
import SocketListeners from './src/components/commons/Sockets/SocketListeners';
import SocketProvider from './src/components/commons/Sockets/SocketProvider';
import GlobalToast from './src/components/commons/Toast/GlobalToast';
import GlobalMeetingManager from './src/components/Modules/DoctorMeeting/GlobalMeetingManager';
import ReactQueryProvider from './src/components/providers/ReactQueryProvider';
import AppNavigator from './src/navigation/AppNavigator';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <ReactQueryProvider>
      <SafeAreaProvider>
        <AppNavigator />
        <GlobalMeetingManager />
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <GlobalToast />
        <GlobalPopupAlert />
        <GlobalIncomingCallBanner />
        <BackdropLoader />
        <EventListener />
        <SocketProvider />
        <SocketListeners />
      </SafeAreaProvider>
    </ReactQueryProvider>
  );
}

export default App;
