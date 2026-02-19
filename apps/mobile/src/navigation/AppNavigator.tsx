import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  WelcomeScreen,
  AdminPanelScreen,
  PatientFormScreen,
  AppointmentDetailScreen,
  AppointmentFormScreen,
} from '../screens';
import { useAuthStore } from '../stores/auth-store';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const { isAdmin } = useAuthStore();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {isAdmin ? (
        <Stack.Screen name="SysConf" component={AdminPanelScreen} />
      ) : (
        <Stack.Screen name="Home" component={HomeScreen} />
      )}
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="PatientForm" component={PatientFormScreen} />
      <Stack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <Stack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
    </Stack.Navigator>
  );
}
