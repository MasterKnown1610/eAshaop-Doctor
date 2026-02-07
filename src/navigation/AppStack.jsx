
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import DashboardScreen from '../screens/Home/DashboardScreen';
import DoctorsScreen from '../screens/Home/DoctorsScreen';
import DoctorDetailsScreen from '../screens/Home/DoctorDetailsScreen';
import ReviewSummaryScreen from '../screens/Home/ReviewSummaryScreen';
import MyAppointmentsScreen from '../screens/Home/MyAppointmentsScreen';
import CancelAppointmentScreen from '../screens/Home/CancelAppointmentScreen';
import NotificationsScreen from '../screens/Home/NotificationsScreen';
import MedicalReportsScreen from '../screens/Home/MedicalReportsScreen';
import CategoriesScreen from '../screens/Home/CategoriesScreen';
import EarningsScreen from '../screens/Home/EarningsScreen';
import SetAvailabilityScreen from '../screens/Home/SetAvailabilityScreen';
import DigitalPrescriptionScreen from '../screens/Home/DigitalPrescriptionScreen';
import PatientsScreen from '../screens/Home/PatientsScreen';
import CallScreen from '../screens/Home/CallScreen';
import ProfileDrawerContent from '../components/common/ProfileDrawerContent';
import {colors} from '../theme/colors';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Stack navigator for main screens
const MainStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen 
        name="Doctors" 
        component={DoctorsScreen} 
        options={{
          headerShown: true,
          title: 'Doctors',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="DoctorDetails" 
        component={DoctorDetailsScreen} 
        options={{
          headerShown: true,
          title: 'Doctor Details',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="ReviewSummary" 
        component={ReviewSummaryScreen} 
        options={{
          headerShown: true,
          title: 'Review Summary',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
          headerShadowVisible: false,
        }}
      />
      <Stack.Screen 
        name="MyAppointments" 
        component={MyAppointmentsScreen} 
        options={{
          headerShown: true,
          title: 'My Appointments',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="CancelAppointment" 
        component={CancelAppointmentScreen} 
        options={{
          headerShown: true,
          title: 'Cancel Appointment',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Notifications" 
        component={NotificationsScreen} 
        options={{
          headerShown: true,
          title: 'Notifications',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="MedicalReports" 
        component={MedicalReportsScreen} 
        options={{
          headerShown: true,
          title: 'Medical Reports',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Categories" 
        component={CategoriesScreen} 
        options={{
          headerShown: true,
          title: 'Categories',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="Earnings" 
        component={EarningsScreen} 
        options={{
          headerShown: true,
          title: 'Earnings',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="SetAvailability" 
        component={SetAvailabilityScreen} 
        options={{
          headerShown: true,
          title: 'Set Availability',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen 
        name="DigitalPrescription" 
        component={DigitalPrescriptionScreen} 
        options={{
          headerShown: true,
          title: 'Digital Prescription',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
      <Stack.Screen
        name="Call"
        component={CallScreen}
        options={{
          headerShown: false,
          gestureEnabled: false,
        }}
      />
      <Stack.Screen 
        name="Patients" 
        component={PatientsScreen} 
        options={{
          headerShown: true,
          title: 'Patients',
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerBackTitle: 'Back',
        }}
      />
    </Stack.Navigator>
  );
};

// Drawer navigator wrapping the main stack
const AppStack = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <ProfileDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerPosition: 'left',
        drawerType: 'front',
        drawerStyle: {
          width: '80%',
        },
        swipeEnabled: false,
      }}>
      <Drawer.Screen name="Dashboard" component={MainStack} />
    </Drawer.Navigator>
  );
};

export default AppStack;
