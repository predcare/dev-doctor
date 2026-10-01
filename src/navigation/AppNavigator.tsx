import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../Features/Auth/LoginScreen';
import PolicyAcceptanceScreen from '../Features/Auth/PolicyAcceptanceScreen';
import HomeScreen from '../Features/Dashboard/HomeScreen/HomeScreen';
import Patients from '../Features/Dashboard/Patients/Patients';
import SettingScreen from '../Features/Dashboard/SettingScreen/SettingScreen';
import SplashScreen from '../Features/SplashScreen/SplashScreen';
import { DashboardTabParamList, RootStackParamList } from '../route';
import { navigationRef } from './navigationRef';

export type { DashboardTabParamList, RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();


export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="PolicyAcceptance" component={PolicyAcceptanceScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Account" component={SettingScreen} />
        <Stack.Screen name="Patients" component={Patients} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
