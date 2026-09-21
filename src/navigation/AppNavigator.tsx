import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import useNotificationListeners from '../hooks/commons/useNotificationListeners';
import { DashboardTabParamList, RootStackParamList } from '../route';
import LoginScreen from '../Screens/Auth/LoginScreen';
import PolicyAcceptanceScreen from '../Screens/Auth/PolicyAcceptanceScreen';
import ComingSoonScreen from '../Screens/ComingSoonScreen';
import AddPatientScreen from '../Screens/DashboardScreen/AddPatientScreen';
import { AppointmentsScreen } from '../Screens/DashboardScreen/AppointmentsScreen';
import AvailabilityScreen from '../Screens/DashboardScreen/AvailabilityScreen';
import BookAppointmentScreen from '../Screens/DashboardScreen/BookAppointmentScreen';
import CreateInvoiceScreen from '../Screens/DashboardScreen/CreateInvoiceScreen';
import CreatePrescriptionScreen from '../Screens/DashboardScreen/CreatePrescriptionScreen';
import DoctorMeetingScreen from '../Screens/DashboardScreen/DoctorMeetingScreen';
import DoctorProfileScreen from '../Screens/DashboardScreen/DoctorProfileScreen';
import EditPatientScreen from '../Screens/DashboardScreen/EditPatientScreen';
import HomeScreen from '../Screens/DashboardScreen/HomeScreen';
import InvoiceListScreen from '../Screens/DashboardScreen/InvoiceListScreen';
import InvoiceSettingsScreen from '../Screens/DashboardScreen/InvoiceSettingsScreen';
import NotificationsScreen from '../Screens/DashboardScreen/NotificationsScreen';
import PatientDetailsScreen from '../Screens/DashboardScreen/PatientDetailsScreen';
import PatientsScreen from '../Screens/DashboardScreen/PatientsScreen';
import PrescriptionListScreen from '../Screens/DashboardScreen/PrescriptionListScreen';
import PrescriptionSettingsScreen from '../Screens/DashboardScreen/PrescriptionSettingsScreen';
import PrescriptionViewScreen from '../Screens/DashboardScreen/PrescriptionViewScreen';
import RescheduleAppointmentScreen from '../Screens/DashboardScreen/RescheduleAppointmentScreen';
import SettingScreen from '../Screens/DashboardScreen/SettingScreen';
import SplashScreen from '../Screens/SplashScreen';
import { navigationRef } from './navigationRef';

export type { DashboardTabParamList, RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();

const ReportsTabScreen = () => (
  <ComingSoonScreen
    title="Analytics & Reports"
    description="View clinical insights, diagnostic trends, and patient health analytics."
    showBottomBar={true}
    activeBottomTab="Reports"
  />
);

export const AppNavigator: React.FC = () => {
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
        <Stack.Screen name="PolicyAcceptance" component={PolicyAcceptanceScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Patients" component={PatientsScreen} />
        <Stack.Screen name="Schedule" component={AppointmentsScreen} />
        <Stack.Screen name="Reports" component={ReportsTabScreen} />
        <Stack.Screen name="Account" component={SettingScreen} />
        {/* Legacy alias support */}
        <Stack.Screen name="MainTabs" component={HomeScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="DoctorProfile" component={DoctorProfileScreen} />
        <Stack.Screen name="PrescriptionSettings" component={PrescriptionSettingsScreen} />
        <Stack.Screen name="PrescriptionView" component={PrescriptionViewScreen} />
        <Stack.Screen name="InvoiceSettings" component={InvoiceSettingsScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="DoctorAppointments" component={AppointmentsScreen} />
        <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointmentScreen} />
        <Stack.Screen name="DoctorMeeting" component={DoctorMeetingScreen} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
        <Stack.Screen name="InvoiceList" component={InvoiceListScreen} />
        <Stack.Screen name="CreateInvoice" component={CreateInvoiceScreen} />
        <Stack.Screen name="CreatePrescription" component={CreatePrescriptionScreen} />
        <Stack.Screen name="PrescriptionList" component={PrescriptionListScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
