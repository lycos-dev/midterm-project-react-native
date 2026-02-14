import React from 'react';
import { View, Pressable, StyleSheet, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
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
            fontWeight: '600',
            fontSize: 18,
            letterSpacing: -0.3,
          },
          headerShadowVisible: false,
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen
          name="JobFinder"
          component={JobFinderScreen}
          options={({ navigation }) => ({
            title: 'Job Finder',
            headerRight: () => (
              <View style={styles.headerRight}>
                <Pressable
                  onPress={() => {
                    navigation.dispatch(
                      CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'SavedJobs' }],
                      })
                    );
                  }}
                  style={({ pressed }) => [
                    styles.headerButton,
                    { 
                      borderColor: colors.border,
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}>
                  <Text style={[styles.headerButtonText, { color: colors.text }]}>
                    ▢ Saved Jobs
                  </Text>
                </Pressable>

                <Pressable
                  onPress={toggleTheme}
                  style={({ pressed }) => [
                    styles.themeButton,
                    { 
                      backgroundColor: colors.primary,
                      opacity: pressed ? 0.5 : 1,
                    },
                  ]}>
                  <Text style={[styles.themeIcon, { color: colors.surface }]}>
                    {theme === 'light' ? '◐' : '◑'}
                  </Text>
                </Pressable>
              </View>
            ),
          })}
        />
        <Stack.Screen
          name="SavedJobs"
          component={SavedJobsScreen}
          options={({ navigation }) => ({
            title: 'Saved Jobs',
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'JobFinder' }],
                    })
                  );
                }}
                style={({ pressed }) => [
                  styles.backButton,
                  { opacity: pressed ? 0.5 : 1 },
                ]}>
                <Text style={[styles.backButtonText, { color: colors.text }]}>
                  ← Back
                </Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={toggleTheme}
                style={({ pressed }) => [
                  styles.themeButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}>
                <Text style={[styles.themeIcon, { color: colors.surface }]}>
                  {theme === 'light' ? '◐' : '◑'}
                </Text>
              </Pressable>
            ),
          })}
        />
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationFormScreen}
          options={({ navigation }) => ({
            title: 'Application Form',
            headerLeft: () => (
              <Pressable
                onPress={() => {
                  navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'JobFinder' }],
                    })
                  );
                }}
                style={({ pressed }) => [
                  styles.backButton,
                  { opacity: pressed ? 0.5 : 1 },
                ]}>
                <Text style={[styles.backButtonText, { color: colors.text }]}>
                  Back
                </Text>
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={toggleTheme}
                style={({ pressed }) => [
                  styles.themeButton,
                  { 
                    backgroundColor: colors.primary,
                    opacity: pressed ? 0.5 : 1,
                  },
                ]}>
                <Text style={[styles.themeIcon, { color: colors.surface }]}>
                  {theme === 'light' ? '◐' : '◑'}
                </Text>
              </Pressable>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const styles = StyleSheet.create({
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  headerButtonText: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  themeButton: {
    width: 32,
    height: 32,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeIcon: {
    fontSize: 18,
    fontWeight: '600',
  },
  backButton: {
    paddingRight: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppNavigator;