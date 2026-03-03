import React from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { RootStackParamList } from "./types";
import { useTheme } from "../context/ThemeContext";
import JobFinderScreen from "../screens/JobFinderScreen/JobFinderScreen";
import SavedJobsScreen from "../screens/SavedJobsScreen/SavedJobsScreen";
import SettingsScreen from "../screens/SettingsScreen/SettingsScreen";
import ApplicationFormScreen from "../screens/ApplicationFormScreen/ApplicationFormScreen";

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  const { theme, colors } = useTheme();

  return (
    <NavigationContainer>
      <StatusBar
        barStyle={theme === "light" ? "dark-content" : "light-content"}
        backgroundColor={colors.background}
      />
      <Stack.Navigator
        initialRouteName="JobFinder"
        screenOptions={{
          headerShown: false,
          animation: "fade",
          contentStyle: { backgroundColor: colors.background },
        }}
      >
        <Stack.Screen name="JobFinder" component={JobFinderScreen} />
        <Stack.Screen name="SavedJobs" component={SavedJobsScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
        <Stack.Screen
          name="ApplicationForm"
          component={ApplicationFormScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
