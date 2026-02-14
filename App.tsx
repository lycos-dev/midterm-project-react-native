import React from 'react';
import { StatusBar } from 'expo-status-bar';
import AppNavigator from './src/navigation/AppNavigator';
import { SavedJobsProvider } from './src/context/SavedJobsContext';

export default function App() {
  return (
    <SavedJobsProvider>
      <AppNavigator />
      <StatusBar style="auto" />
    </SavedJobsProvider>
  );
}