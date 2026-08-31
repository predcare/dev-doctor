import { StatusBar, useColorScheme } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import BackdropLoader from './src/components/commons/BackdropLoader/BackdropLoader';
import AppNavigator from './src/navigations/AppNavigator';

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Toast position="top" />
      <AppNavigator />
      <BackdropLoader />
    </SafeAreaProvider>
  );
}

export default App;
