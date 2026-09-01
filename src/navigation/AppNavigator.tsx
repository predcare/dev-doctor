import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { View } from 'react-native';
import {
  HomeIcon,
  PatientsIcon,
  ReportsIcon,
  ScheduleIcon,
  SettingsIcon,
} from '../components/ui/icons';
import useNotificationListeners from '../hooks/commons/useNotificationListeners';
import { DashboardTabParamList, RootStackParamList } from '../route';
import LoginScreen from '../Screens/Auth/LoginScreen';
import ComingSoonScreen from '../Screens/ComingSoonScreen';
import AddPatientScreen from '../Screens/DashboardScreen/AddPatientScreen';
import AvailabilityScreen from '../Screens/DashboardScreen/AvailabilityScreen';
import BookAppointmentScreen from '../Screens/DashboardScreen/BookAppointmentScreen';
import CreateInvoiceScreen from '../Screens/DashboardScreen/CreateInvoiceScreen';
import DoctorAppointmentsScreen from '../Screens/DashboardScreen/DoctorAppointmentsScreen';
import DoctorMeetingScreen from '../Screens/DashboardScreen/DoctorMeetingScreen';
import DoctorProfileScreen from '../Screens/DashboardScreen/DoctorProfileScreen';
import EditPatientScreen from '../Screens/DashboardScreen/EditPatientScreen';
import HomeScreen from '../Screens/DashboardScreen/HomeScreen';
import InvoiceListScreen from '../Screens/DashboardScreen/InvoiceListScreen';
import InvoiceSettingsScreen from '../Screens/DashboardScreen/InvoiceSettingsScreen';
import NotificationsScreen from '../Screens/DashboardScreen/NotificationsScreen';
import PatientDetailsScreen from '../Screens/DashboardScreen/PatientDetailsScreen';
import PatientsScreen from '../Screens/DashboardScreen/PatientsScreen';
import PrescriptionSettingsScreen from '../Screens/DashboardScreen/PrescriptionSettingsScreen';
import PrescriptionViewScreen from '../Screens/DashboardScreen/PrescriptionViewScreen';
import RescheduleAppointmentScreen from '../Screens/DashboardScreen/RescheduleAppointmentScreen';
import SettingScreen from '../Screens/DashboardScreen/SettingScreen';
import SplashScreen from '../Screens/SplashScreen';
import { navigationStyles } from '../styled/Navigation.styled';
import { theme } from '../styled/theme.styled';
import withScreenFocus from './withScreenFocus';

export type { DashboardTabParamList, RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<DashboardTabParamList>();

const ReportsTabScreen = () => (
  <ComingSoonScreen
    title="Analytics & Reports"
    description="View clinical insights, diagnostic trends, and patient health analytics."
  />
);

const FocusedHomeScreen = withScreenFocus(HomeScreen);
const FocusedPatientsScreen = withScreenFocus(PatientsScreen);
const FocusedScheduleScreen = withScreenFocus(DoctorAppointmentsScreen);
const FocusedReportsScreen = withScreenFocus(ReportsTabScreen);
const FocusedSettingScreen = withScreenFocus(SettingScreen);

const DashboardTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarStyle: navigationStyles.tabBar,
        tabBarItemStyle: navigationStyles.tabItem,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSlate,
        tabBarLabelStyle: navigationStyles.tabLabel,
      }}
    >
      <Tab.Screen
        name="Home"
        component={FocusedHomeScreen}
        options={{
          headerShown: false,
          title: 'Home',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View
                style={
                  focused
                    ? navigationStyles.activeIndicatorDot
                    : navigationStyles.inactiveIndicatorDot
                }
              />
              <View
                style={
                  focused
                    ? navigationStyles.activeIconContainer
                    : navigationStyles.inactiveIconContainer
                }
              >
                <HomeIcon
                  size={20}
                  color={focused ? theme.colors.primary : theme.colors.textSlate}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Patients"
        component={FocusedPatientsScreen}
        options={{
          headerShown: false,
          title: 'Patients',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View
                style={
                  focused
                    ? navigationStyles.activeIndicatorDot
                    : navigationStyles.inactiveIndicatorDot
                }
              />
              <View
                style={
                  focused
                    ? navigationStyles.activeIconContainer
                    : navigationStyles.inactiveIconContainer
                }
              >
                <PatientsIcon
                  size={20}
                  color={focused ? theme.colors.primary : theme.colors.textSlate}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Schedule"
        component={FocusedScheduleScreen}
        options={{
          headerShown: false,
          title: 'Schedule',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View
                style={
                  focused
                    ? navigationStyles.activeIndicatorDot
                    : navigationStyles.inactiveIndicatorDot
                }
              />
              <View
                style={
                  focused
                    ? navigationStyles.activeIconContainer
                    : navigationStyles.inactiveIconContainer
                }
              >
                <ScheduleIcon
                  size={20}
                  color={focused ? theme.colors.primary : theme.colors.textSlate}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Reports"
        component={FocusedReportsScreen}
        options={{
          headerShown: false,
          title: 'Reports',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View
                style={
                  focused
                    ? navigationStyles.activeIndicatorDot
                    : navigationStyles.inactiveIndicatorDot
                }
              />
              <View
                style={
                  focused
                    ? navigationStyles.activeIconContainer
                    : navigationStyles.inactiveIconContainer
                }
              >
                <ReportsIcon
                  size={20}
                  color={focused ? theme.colors.primary : theme.colors.textSlate}
                />
              </View>
            </View>
          ),
        }}
      />
      <Tab.Screen
        name="Account"
        component={FocusedSettingScreen}
        options={{
          headerShown: false,
          title: 'Account',
          tabBarIcon: ({ focused }) => (
            <View style={{ alignItems: 'center' }}>
              <View
                style={
                  focused
                    ? navigationStyles.activeIndicatorDot
                    : navigationStyles.inactiveIndicatorDot
                }
              />
              <View
                style={
                  focused
                    ? navigationStyles.activeIconContainer
                    : navigationStyles.inactiveIconContainer
                }
              >
                <SettingsIcon
                  size={20}
                  color={focused ? theme.colors.primary : theme.colors.textSlate}
                />
              </View>
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export const AppNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef();
  useNotificationListeners(navigationRef);
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
        <Stack.Screen name="MainTabs" component={DashboardTabNavigator} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="PrescriptionSettings" component={PrescriptionSettingsScreen} />
        <Stack.Screen name="PrescriptionView" component={PrescriptionViewScreen} />
        <Stack.Screen name="InvoiceSettings" component={InvoiceSettingsScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="DoctorAppointments" component={DoctorAppointmentsScreen} />
        <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointmentScreen} />
        <Stack.Screen name="DoctorMeeting" component={DoctorMeetingScreen} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
        <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
