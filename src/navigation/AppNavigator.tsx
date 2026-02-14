import React from 'react';
import { Pressable, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import JobFinderScreen from '../screens/JobFinderScreen';
import SavedJobsScreen from '../screens/SavedJobsScreen';
import ApplicationFormScreen from '../screens/ApplicationFormScreen';
import { useTheme } from '../context/ThemeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme, colors, toggleTheme } = useTheme();

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="JobFinder"
        screenOptions={{
          animation: 'slide_from_right',
          headerStyle: {
            backgroundColor: colors.surface,
          },
          headerTintColor: colors.text,
          headerTitleStyle: {
            fontWeight: '700',
          },
          headerRight: () => (
            <Pressable 
              onPress={toggleTheme} 
              style={({ pressed }) => [
                styles.themeButton,
                { opacity: pressed ? 0.5 : 1 },
              ]}>
              <Text style={[styles.themeIcon, { color: colors.text }]}>
                {theme === 'light' ? '🌙' : '☀️'}
              </Text>
            </Pressable>
          ),
        }}>
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

const styles = StyleSheet.create({
  themeButton: {
    marginRight: 8,
    padding: 8,
  },
  themeIcon: {
    fontSize: 24,
  },
});

export default AppNavigator;