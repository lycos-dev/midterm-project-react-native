import React, { useRef, useEffect } from 'react';
import { View, Text, Pressable, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '../../navigation/types';
import { useTheme } from '../../context/ThemeContext';
import BottomTabBar from '../../components/BottomTabBar';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'Settings'>;
};

const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { colors, theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';
  const translateX = useRef(new Animated.Value(isDark ? 22 : 0)).current;

  useEffect(() => {
    Animated.timing(translateX, {
      toValue: isDark ? 22 : 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  }, [isDark]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
          <Text style={[styles.navTitle, { color: colors.text }]}>Settings</Text>
        </View>

        <View style={styles.content}>
          <Text style={[styles.sectionLabel, { color: colors.textSecondary }]}>Appearance</Text>

          <View style={[styles.row, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Text style={[styles.rowIcon, { color: colors.text }]}>{isDark ? '☾' : '☼'}</Text>
              <View>
                <Text style={[styles.rowTitle, { color: colors.text }]}>{isDark ? 'Dark Mode' : 'Light Mode'}</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textSecondary }]}>
                  {isDark ? 'Switch to light theme' : 'Switch to dark theme'}
                </Text>
              </View>
            </View>

            <Pressable onPress={toggleTheme} style={styles.toggleHitbox}>
              <View style={[styles.track, { backgroundColor: isDark ? colors.text : colors.border }]}>
                <Animated.View
                  style={[styles.thumb, { backgroundColor: colors.background, transform: [{ translateX }] }]}
                />
              </View>
            </Pressable>
          </View>
        </View>

        <BottomTabBar activeTab="Settings" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default SettingsScreen;
