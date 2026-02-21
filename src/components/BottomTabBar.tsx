import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';

type ActiveTab = 'JobFinder' | 'SavedJobs' | 'Settings';

type Props = {
  activeTab: ActiveTab;
  navigation: NativeStackNavigationProp<RootStackParamList, any>;
};

const BottomTabBar: React.FC<Props> = ({ activeTab, navigation }) => {
  const { colors } = useTheme();

  const navigateTo = (screen: ActiveTab) => {
    if (activeTab === screen) return;
    navigation.dispatch(
      CommonActions.reset({ index: 0, routes: [{ name: screen }] })
    );
  };

  const tabs: { key: ActiveTab; label: string; icon: string }[] = [
    { key: 'JobFinder',  label: 'Home',     icon: '⌂' },
    { key: 'SavedJobs', label: 'Saved',     icon: '♡' },
    { key: 'Settings',  label: 'Settings',  icon: '⚙' },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderTopColor: colors.border }]}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <Pressable
            key={tab.key}
            style={({ pressed }) => [styles.tab, { opacity: pressed ? 0.5 : 1 }]}
            onPress={() => navigateTo(tab.key)}>
            {isActive && (
              <View style={[styles.activeIndicator, { backgroundColor: colors.text }]} />
            )}
            <Text style={[styles.icon, { color: isActive ? colors.text : colors.textSecondary }]}>
              {tab.icon}
            </Text>
            <Text style={[
              styles.label,
              {
                color: isActive ? colors.text : colors.textSecondary,
                fontWeight: isActive ? '600' : '400',
              },
            ]}>
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    paddingBottom: 8,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 4,
    gap: 4,
  },
  icon: {
    fontSize: 22,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.2,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    width: 24,
    height: 2,
    borderRadius: 1,
  },
});

export default BottomTabBar;