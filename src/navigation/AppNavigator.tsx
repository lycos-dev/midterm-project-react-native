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
          animation: 'fade',
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
          headerBackVisible: false,
          headerBackTitleVisible: false,
        }}>
        <Stack.Screen
          name="JobFinder"
          component={JobFinderScreen}
          options={({ navigation }) => ({
            title: 'Job Finder',
            headerLeft: () => null,
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
                  style={[
                    styles.headerButton,
                    { borderColor: colors.border },
                  ]}>
                  {({ pressed }) => (
                    <Text style={[styles.headerButtonText, { 
                      color: colors.text,
                      opacity: pressed ? 0.5 : 1,
                    }]}>
                      ▢ Saved Jobs
                    </Text>
                  )}
                </Pressable>

                <Pressable
                  onPress={toggleTheme}
                  style={[
                    styles.themeButton,
                    { backgroundColor: colors.surface, borderColor: colors.border },
                  ]}>
                  {({ pressed }) => (
                    <View style={[styles.themeContent, { opacity: pressed ? 0.5 : 1 }]}>
                      <View style={[
                        styles.themeIndicator,
                        { 
                          backgroundColor: theme === 'light' ? colors.text : colors.text,
                          transform: [{ translateX: theme === 'light' ? 0 : 12 }],
                        },
                      ]} />
                      <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
                        {theme === 'light' ? 'L' : 'D'}
                      </Text>
                    </View>
                  )}
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
                style={styles.backButtonContainer}>
                {({ pressed }) => (
                  <Text style={[styles.backButtonText, { 
                    color: colors.text,
                    opacity: pressed ? 0.5 : 1,
                  }]}>
                    ← Back
                  </Text>
                )}
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={toggleTheme}
                style={[
                  styles.themeButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                {({ pressed }) => (
                  <View style={[styles.themeContent, { opacity: pressed ? 0.5 : 1 }]}>
                    <View style={[
                      styles.themeIndicator,
                      { 
                        backgroundColor: theme === 'light' ? colors.text : colors.text,
                        transform: [{ translateX: theme === 'light' ? 0 : 12 }],
                      },
                    ]} />
                    <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
                      {theme === 'light' ? 'L' : 'D'}
                    </Text>
                  </View>
                )}
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
                style={styles.backButtonContainer}>
                {({ pressed }) => (
                  <Text style={[styles.backButtonText, { 
                    color: colors.text,
                    opacity: pressed ? 0.5 : 1,
                  }]}>
                    Back
                  </Text>
                )}
              </Pressable>
            ),
            headerRight: () => (
              <Pressable
                onPress={toggleTheme}
                style={[
                  styles.themeButton,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}>
                {({ pressed }) => (
                  <View style={[styles.themeContent, { opacity: pressed ? 0.5 : 1 }]}>
                    <View style={[
                      styles.themeIndicator,
                      { 
                        backgroundColor: theme === 'light' ? colors.text : colors.text,
                        transform: [{ translateX: theme === 'light' ? 0 : 12 }],
                      },
                    ]} />
                    <Text style={[styles.themeLabel, { color: colors.textSecondary }]}>
                      {theme === 'light' ? 'L' : 'D'}
                    </Text>
                  </View>
                )}
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
    width: 56,
    height: 32,
    borderRadius: 6,
    borderWidth: 1,
    justifyContent: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  themeContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative',
  },
  themeIndicator: {
    width: 24,
    height: 24,
    borderRadius: 4,
    position: 'absolute',
    left: 0,
  },
  themeLabel: {
    fontSize: 11,
    fontWeight: '600',
    position: 'absolute',
    right: 6,
  },
  backButtonContainer: {
    paddingRight: 12,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
});

export default AppNavigator;