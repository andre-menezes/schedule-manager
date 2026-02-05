import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  HomeScreen,
  WelcomeScreen,
  AdminPanelScreen,
  PatientFormScreen,
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
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
      )}
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          headerShown: true,
          title: 'Agenda do Dia',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }}
      />
      <Stack.Screen name="PatientForm" component={PatientFormScreen} />
    </Stack.Navigator>
  );
}
