import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  useNavigationContainerRef,
} from '@react-navigation/native';
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
import { DashboardTabParamList, RootStackParamList } from '../route';
import { navigationStyles } from '../styled/Navigation.styled';
import { theme } from '../styled/theme.styled';
import { LoginScreen } from '../Screens/Auth/LoginScreen';
import SplashScreen from '../Screens/SplashScreen';

// Dashboard Screens
import { AddPatientScreen } from '../Screens/DashboardScreen/AddPatientScreen';
import { AvailabilityScreen } from '../Screens/DashboardScreen/AvailabilityScreen';
import { BookAppointmentScreen } from '../Screens/DashboardScreen/BookAppointmentScreen';
import { CreateInvoiceScreen } from '../Screens/DashboardScreen/CreateInvoiceScreen';
import { DoctorAppointmentsScreen } from '../Screens/DashboardScreen/DoctorAppointmentsScreen';
import { DoctorMeetingScreen } from '../Screens/DashboardScreen/DoctorMeetingScreen';
import { DoctorProfileScreen } from '../Screens/DashboardScreen/DoctorProfileScreen';
import { EditPatientScreen } from '../Screens/DashboardScreen/EditPatientScreen';
import { HomeScreen } from '../Screens/DashboardScreen/HomeScreen';
import { InvoiceListScreen } from '../Screens/DashboardScreen/InvoiceListScreen';
import { InvoiceSettingsScreen } from '../Screens/DashboardScreen/InvoiceSettingsScreen';
import { NotificationsScreen } from '../Screens/DashboardScreen/NotificationsScreen';
import { PatientDetailsScreen } from '../Screens/DashboardScreen/PatientDetailsScreen';
import { PatientsScreen } from '../Screens/DashboardScreen/PatientsScreen';
import { PrescriptionSettingsScreen } from '../Screens/DashboardScreen/PrescriptionSettingsScreen';
import { PrescriptionViewScreen } from '../Screens/DashboardScreen/PrescriptionViewScreen';
import { RescheduleAppointmentScreen } from '../Screens/DashboardScreen/RescheduleAppointmentScreen';
import { SettingScreen } from '../Screens/DashboardScreen/SettingScreen';
import { SafeAreaView } from 'react-native-safe-area-context';

export type { DashboardTabParamList, RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<DashboardTabParamList>();

const DashboardTabNavigator: React.FC = () => {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={['bottom']}>
      <Tab.Navigator
        screenOptions={{
          tabBarStyle: navigationStyles.tabBar,
          tabBarItemStyle: navigationStyles.tabItem,
          tabBarActiveTintColor: theme.colors.primary,
          tabBarInactiveTintColor: theme.colors.textSlate,
          tabBarLabelStyle: navigationStyles.tabLabel,
        }}
        screenListeners={{
          focus: e => {
            const routeName = e.target?.split('-')[0];
            console.log(`[AppNavigator] Tab focused: ${routeName}`);
          },
        }}
      >
        <Tab.Screen
          name="Home"
          component={HomeScreen}
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
                    color={
                      focused ? theme.colors.primary : theme.colors.textSlate
                    }
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Patients"
          component={PatientsScreen}
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
                    color={
                      focused ? theme.colors.primary : theme.colors.textSlate
                    }
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Schedule"
          component={DoctorAppointmentsScreen}
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
                    color={
                      focused ? theme.colors.primary : theme.colors.textSlate
                    }
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Reports"
          component={InvoiceListScreen}
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
                    color={
                      focused ? theme.colors.primary : theme.colors.textSlate
                    }
                  />
                </View>
              </View>
            ),
          }}
        />
        <Tab.Screen
          name="Account"
          component={SettingScreen}
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
                    color={
                      focused ? theme.colors.primary : theme.colors.textSlate
                    }
                  />
                </View>
              </View>
            ),
          }}
        />
      </Tab.Navigator>
    </SafeAreaView>
  );
};

export const AppNavigator: React.FC = () => {
  const navigationRef = useNavigationContainerRef();

  return (
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{
          headerShown: false,
          animation: 'fade',
        }}
        screenListeners={{
          focus: e => {
            const routeName = e.target?.split('-')[0];
            console.log(`[AppNavigator] Stack screen focused: ${routeName}`);
          },
        }}
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainTabs" component={DashboardTabNavigator} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen
          name="PrescriptionSettings"
          component={PrescriptionSettingsScreen}
        />
        <Stack.Screen
          name="PrescriptionView"
          component={PrescriptionViewScreen}
        />
        <Stack.Screen
          name="InvoiceSettings"
          component={InvoiceSettingsScreen}
        />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen
          name="BookAppointment"
          component={BookAppointmentScreen}
        />
        <Stack.Screen
          name="DoctorAppointments"
          component={DoctorAppointmentsScreen}
        />
        <Stack.Screen
          name="RescheduleAppointment"
          component={RescheduleAppointmentScreen}
        />
        <Stack.Screen name="DoctorMeeting" component={DoctorMeetingScreen} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
        <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
