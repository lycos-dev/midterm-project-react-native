import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
  Alert,
  Image,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';
import BottomTabBar from '../components/BottomTabBar';

type SavedJobsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>;
};

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  logo?: string;
}

const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({ navigation }) => {
  const { savedJobs, unsaveJob } = useSavedJobs();
  const { colors } = useTheme();

  const navigateToJobFinder = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'JobFinder' }],
      })
    );
  };

  const handleRemoveJob = (jobId: string, jobTitle: string, jobCompany: string) => {
    Alert.alert(
      'Remove Job',
      `Remove "${jobTitle}" at ${jobCompany}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            unsaveJob(jobId);
            console.log(`Job removed - ID: ${jobId}, Title: ${jobTitle}`);
          },
        },
      ]
    );
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { fromScreen: 'SavedJobs' });
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.jobHeader}>
        {/* Logo */}
        <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {item.logo ? (
            <Image
              source={{ uri: item.logo }}
              style={styles.logo}
              resizeMode="contain"
            />
          ) : (
            <Text style={[styles.logoPlaceholder, { color: colors.textSecondary }]}>
              {item.company.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>

        {/* Job Info */}
        <View style={styles.jobHeaderContent}>
          <View style={styles.jobHeaderLeft}>
            <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
            <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{item.company}</Text>
          </View>
        </View>
      </View>

      <View style={styles.jobInfo}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Salary</Text>
          <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{item.salary}</Text>
        </View>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
          <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            styles.primaryAction,
            { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={handleApply}>
          <Text style={[styles.actionText, { color: colors.surface }]}>Apply</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionBtn,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.5 : 1 },
          ]}
          onPress={() => handleRemoveJob(item.id, item.title, item.company)}>
          <Feather name="trash-2" size={13} color={colors.text} />
          <Text style={[styles.actionText, { color: colors.text }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconWrap, { borderColor: colors.border }]}>
        <Feather name="bookmark" size={36} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Jobs</Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        Jobs you save will appear here
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.browseButton,
          { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
        ]}
        onPress={navigateToJobFinder}>
        <Text style={[styles.browseButtonText, { color: colors.surface }]}>Browse Jobs</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {/* NAV */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={[styles.navTitle, { color: colors.text }]}>Saved Jobs</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* SUBTITLE */}
        {savedJobs.length > 0 && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.subtitle, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
              <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}
        
        {savedJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={savedJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <BottomTabBar activeTab="SavedJobs" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // NAV
  nav: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  // SUBTITLE
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  subtitleText: {
    fontSize: 13,
  },
  list: {
    padding: 20,
  },
  jobCard: {
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
  },
  logoContainer: {
    width: 56,
    height: 56,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  logoPlaceholder: {
    fontSize: 24,
    fontWeight: '600',
  },
  jobHeaderContent: {
    flex: 1,
    justifyContent: 'center',
  },
  jobHeaderLeft: {
    flex: 1,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  jobCompany: {
    fontSize: 15,
  },
  jobInfo: {
    marginBottom: 16,
    gap: 10,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    height: 44,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
  },
  primaryAction: {
    borderWidth: 0,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    marginBottom: 32,
    textAlign: 'center',
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default SavedJobsScreen;