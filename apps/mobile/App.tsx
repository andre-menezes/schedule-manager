import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { RootNavigator } from './src/navigation';
import { ToastProvider } from './src/contexts';

export default function App() {
  return (
    <SafeAreaProvider>
      <ToastProvider>
        <RootNavigator />
        <StatusBar style="auto" />
      </ToastProvider>
    </SafeAreaProvider>
  );
}
