import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialIcons } from '@expo/vector-icons';
import {
  HomeScreen,
  WelcomeScreen,
  PatientFormScreen,
  AppointmentDetailScreen,
  AppointmentFormScreen,
} from '../screens';

import { colors } from '../theme/colors';
import type { MainTabParamList, HomeStackParamList, PatientsStackParamList } from './types';

const Tab = createBottomTabNavigator<MainTabParamList>();
const HomeStack = createNativeStackNavigator<HomeStackParamList>();
const PatientsStack = createNativeStackNavigator<PatientsStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="Home" component={HomeScreen} />
      <HomeStack.Screen name="AppointmentDetail" component={AppointmentDetailScreen} />
      <HomeStack.Screen name="AppointmentForm" component={AppointmentFormScreen} />
      <HomeStack.Screen name="PatientForm" component={PatientFormScreen} />
    </HomeStack.Navigator>
  );
}

function PatientsStackNavigator() {
  return (
    <PatientsStack.Navigator screenOptions={{ headerShown: false }}>
      <PatientsStack.Screen name="Patients" component={WelcomeScreen} />
      <PatientsStack.Screen name="PatientForm" component={PatientFormScreen} />
    </PatientsStack.Navigator>
  );
}

export function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          borderTopColor: colors.border,
          backgroundColor: colors.white,
          elevation: 8,
          shadowColor: colors.black,
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.06,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '500',
          marginBottom: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeStackNavigator}
        options={{
          tabBarLabel: 'Agenda',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="calendar-today" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="PatientsTab"
        component={PatientsStackNavigator}
        options={{
          tabBarLabel: 'Pacientes',
          tabBarIcon: ({ color, size }) => (
            <MaterialIcons name="people" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
