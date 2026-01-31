import type { NativeStackScreenProps } from '@react-navigation/native-stack';

export type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

export type AppStackParamList = {
  Home: undefined;
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
