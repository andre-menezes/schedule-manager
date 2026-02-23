import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AdminPanelScreen } from '../screens';
import { useAuthStore } from '../stores/auth-store';
import { MainTabNavigator } from './MainTabNavigator';
import type { AppStackParamList } from './types';

const Stack = createNativeStackNavigator<AppStackParamList>();

export function AppNavigator() {
  const { isAdmin } = useAuthStore();

  if (isAdmin) {
    return (
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="SysConf" component={AdminPanelScreen} />
      </Stack.Navigator>
    );
  }

  return <MainTabNavigator />;
}
