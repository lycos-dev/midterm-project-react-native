import React from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme, colors } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar 
        barStyle={theme === 'light' ? 'dark-content' : 'light-content'} 
        backgroundColor={colors.background}
      />
      <Stack.Navigator
        initialRouteName="JobFinder"
        screenOptions={{
          headerShown: false, // NO HEADER AT ALL!
          animation: 'fade',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}>
        <Stack.Screen name="JobFinder" component={JobFinderScreen} />
        <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
        <Stack.Screen name="ApplicationForm" component={ApplicationFormScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;