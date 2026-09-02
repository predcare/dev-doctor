import React from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BackdropLoader from './src/components/commons/BackdropLoader/BackdropLoader';
import EventListener from './src/components/commons/EventListener/EventListener';
import GlobalPopupAlert from './src/components/commons/PopupAlert/GlobalPopupAlert';
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
        <Toast position="top" />
        <GlobalPopupAlert />
        <BackdropLoader />
        <EventListener />
      </SafeAreaProvider>
    </ReactQueryProvider>
  );
}

export default App;
