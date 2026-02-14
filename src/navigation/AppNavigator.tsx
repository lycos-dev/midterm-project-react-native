import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="JobFinder">
        <Stack.Screen
          name="JobFinder"
          component={JobFinderScreen}
          options={{ title: 'Job Finder' }}
        />
        <Stack.Screen
          name="SavedJobs"
          component={SavedJobsScreen}
          options={{ title: 'Saved Jobs' }}
        />
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationFormScreen}
          options={{ title: 'Application Form' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
