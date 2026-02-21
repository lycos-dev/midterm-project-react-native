import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useTheme } from '../context/ThemeContext';
import BottomTabBar from '../components/BottomTabBar';

type SettingsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {/* NAV */}
        <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.navTitle, { color: colors.text }]}>Settings</Text>
        </View>

        {/* SETTINGS LIST */}
        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>

          <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowIcon, { color: colors.text }]}>
                {theme === 'dark' ? '☾' : '☼'}
              </Text>
              <View>
                <Text style={[styles.rowTitle, { color: colors.text }]}>
                  {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
                </Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  {theme === 'dark' ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>
            <Switch
              value={theme === 'dark'}
              onValueChange={toggleTheme}
              trackColor={{ false: colors.border, true: colors.text }}
              thumbColor={colors.background}
            />
          </View>
        </View>

        <BottomTabBar activeTab="Settings" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  nav: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    flex: 1,
  },
  rowIcon: {
    fontSize: 22,
    width: 28,
    textAlign: 'center',
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 2,
  },
  rowSubtitle: {
    fontSize: 13,
  },
});

export default SettingsScreen;