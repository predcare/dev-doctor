import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import LoginScreen from '../Features/Auth/LoginScreen';
import PolicyAcceptanceScreen from '../Features/Auth/PolicyAcceptanceScreen';
import ComingSoonScreen from '../Features/ComingSoonScreen';
import AppointmentDetailsScreen from '../Features/Dashboard/AppointmentScreen/AppointmentDetailsScreen';
import AppointmentsScreen from '../Features/Dashboard/AppointmentScreen/AppointmentScreen';
import BookAppointmentScreen from '../Features/Dashboard/AppointmentScreen/BookAppointmentScreen';
import RescheduleAppointmentScreen from '../Features/Dashboard/AppointmentScreen/RescheduleAppointmentScreen';
import AvailabilityScreen from '../Features/Dashboard/Availability/AvailabilityScreen';
import HomeScreen from '../Features/Dashboard/HomeScreen/HomeScreen';
import NotificationScreen from '../Features/Dashboard/NotificationScreen/NotificationScreen';
import AddPatientScreen from '../Features/Dashboard/PatientScreen/AddPatientScreen';
import EditPatientScreen from '../Features/Dashboard/PatientScreen/EditPatientScreen';
import PatientDetailsScreen from '../Features/Dashboard/PatientScreen/PatientDetailsScreen';
import PatinetScreen from '../Features/Dashboard/PatientScreen/PatientScreen';
import { ProfileScreen } from '../Features/Dashboard/ProfileScreen/ProfileScreen';
import SettingScreen from '../Features/Dashboard/SettingScreen/SettingScreen';
import SplashScreen from '../Features/SplashScreen/SplashScreen';
import { DashboardTabParamList, RootStackParamList } from '../route';
import { navigationRef } from './navigationRef';
import PrescritionScreen from '../Features/Dashboard/PrescriptionScreen/PrescritionScreen';
import ViewPrescriptionScreen from '../Features/Dashboard/PrescriptionScreen/ViewPrescriptionScreen';
import CreatePrescriptionScreen from '../Features/Dashboard/PrescriptionScreen/CreatePrescriptionScreen';
import InvoicesScreen from '../Features/Dashboard/InvoicesScreen/InvoicesScreen';
import DoctorMeetingScreen from '../Features/Dashboard/MeetingScreen/DoctorMeetingScreen';

export type { DashboardTabParamList, RootStackParamList };

const Stack = createNativeStackNavigator<RootStackParamList>();

const ReportsTabScreen = () => (
  <ComingSoonScreen
    title="Analytics & Reports"
    description="Your analytics and reports will appear here."
    showBottomBar={true}
    activeBottomTab="Reports"
  />
);

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
        <Stack.Screen name="Patients" component={PatinetScreen} />
        <Stack.Screen name="Profile" component={ProfileScreen} />
        <Stack.Screen name="Reports" component={ReportsTabScreen} />
        <Stack.Screen name="Availability" component={AvailabilityScreen} />
        <Stack.Screen name="Notifications" component={NotificationScreen} />
        <Stack.Screen name="PatientDetails" component={PatientDetailsScreen} />
        <Stack.Screen name="EditPatient" component={EditPatientScreen} />
        <Stack.Screen name="AddPatient" component={AddPatientScreen} />
        <Stack.Screen name="Appointments" component={AppointmentsScreen} />
        <Stack.Screen name="AppointmentDetails" component={AppointmentDetailsScreen} />
        <Stack.Screen name="BookAppointment" component={BookAppointmentScreen} />
        <Stack.Screen name="RescheduleAppointment" component={RescheduleAppointmentScreen} />
        <Stack.Screen name="Prescription" component={PrescritionScreen} />
        <Stack.Screen name="ViewPrescription" component={ViewPrescriptionScreen} />
        <Stack.Screen name="CreatePrescription" component={CreatePrescriptionScreen} />
        <Stack.Screen name="Invoices" component={InvoicesScreen} />
        <Stack.Screen name="DoctorMeeting" component={DoctorMeetingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
