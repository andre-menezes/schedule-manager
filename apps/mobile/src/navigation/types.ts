import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  ResetPassword: { email: string };
};

export type HomeStackParamList = {
  Home: undefined;
  AppointmentDetail: { appointmentId: string };
  AppointmentForm: { appointmentId?: string; date?: string };
  PatientForm: { patientId?: string };
};

export type PatientsStackParamList = {
  Patients: undefined;
  PatientForm: { patientId?: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  PatientsTab: undefined;
};

// Keep for backward compatibility with existing screen imports
export type AppStackParamList = {
  Home: undefined;
  Welcome: undefined;
  // Hidden admin route - using non-obvious name
  SysConf: undefined;
  PatientList: undefined;
  PatientDetail: { patientId: string };
  PatientForm: { patientId?: string };
  AppointmentDetail: { appointmentId: string };
  AppointmentForm: { appointmentId?: string; date?: string };
};

export type RootStackParamList = AuthStackParamList & AppStackParamList;

export type AuthStackScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type AppStackScreenProps<T extends keyof AppStackParamList> =
  NativeStackScreenProps<AppStackParamList, T>;

export type HomeStackScreenProps<T extends keyof HomeStackParamList> =
  NativeStackScreenProps<HomeStackParamList, T>;

export type PatientsStackScreenProps<T extends keyof PatientsStackParamList> =
  NativeStackScreenProps<PatientsStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;
