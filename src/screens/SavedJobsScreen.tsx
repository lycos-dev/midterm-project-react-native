import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';

type SavedJobsScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>;
};

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
}

const SavedJobsScreen: React.FC<SavedJobsScreenProps> = ({ navigation }) => {
  const { savedJobs, unsaveJob } = useSavedJobs();
  const { colors, theme, toggleTheme } = useTheme();

  const navigateToJobFinder = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'JobFinder' }],
      })
    );
  };

  const handleRemoveJob = (jobId: string, jobTitle: string) => {
    unsaveJob(jobId);
    console.log(`Job removed - ID: ${jobId}, Title: ${jobTitle}`);
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { fromScreen: 'SavedJobs' });
  };

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.cardHeader}>
        <View style={styles.jobContent}>
          <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{item.company}</Text>
        </View>
        <View style={[styles.savedBadge, { backgroundColor: colors.muted }]}>
          <Text style={[styles.savedBadgeText, { color: colors.surface }]}>✓</Text>
        </View>
      </View>
      
      <View style={[styles.divider, { backgroundColor: colors.border }]} />
      
      <View style={styles.jobDetails}>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Salary</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{item.salary}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={[styles.detailLabel, { color: colors.textSecondary }]}>Location</Text>
          <Text style={[styles.detailValue, { color: colors.text }]}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={handleApply}>
          <Text style={[styles.buttonText, { color: colors.surface }]}>Apply</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryButton,
            { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={() => handleRemoveJob(item.id, item.title)}>
          <Text style={[styles.buttonText, { color: colors.text }]}>Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIcon, { borderColor: colors.border }]}>
        <Text style={[styles.emptyIconText, { color: colors.textSecondary }]}>▢</Text>
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Jobs</Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        Jobs you save will appear here
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.browseButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
        ]}
        onPress={navigateToJobFinder}>
        <Text style={[styles.browseButtonText, { color: colors.surface }]}>Browse Jobs</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* CUSTOM NAVIGATION BAR */}
      <View style={[styles.navbar, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
        <View style={styles.navLeft}>
          <Pressable
            onPress={navigateToJobFinder}
            style={({ pressed }) => [
              styles.backButton,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.6 : 1 }
            ]}>
            <Text style={[styles.backButtonText, { color: colors.text }]}>← Back</Text>
          </Pressable>
          <Text style={[styles.navTitle, { color: colors.text }]}>Saved Jobs</Text>
        </View>
        <Pressable
          onPress={toggleTheme}
          style={({ pressed }) => [
            styles.themeButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 }
          ]}>
          <Text style={[styles.themeButtonText, { color: colors.surface }]}>
            {theme === 'light' ? 'L' : 'D'}
          </Text>
        </Pressable>
      </View>

      {/* SUBTITLE */}
      {savedJobs.length > 0 && (
        <View style={[styles.subtitle, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
          </Text>
        </View>
      )}
      
      {savedJobs.length === 0 ? (
        renderEmptyState()
      ) : (
        <FlatList
          data={savedJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          removeClippedSubviews={true}
          maxToRenderPerBatch={10}
          updateCellsBatchingPeriod={50}
          initialNumToRender={10}
          windowSize={10}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  // NAVIGATION BAR
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  navLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  navTitle: {
    fontSize: 20,
    fontWeight: '600',
    letterSpacing: -0.3,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
  },
  backButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  themeButton: {
    width: 36,
    height: 36,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '700',
  },
  // SUBTITLE
  subtitle: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  subtitleText: {
    fontSize: 13,
    letterSpacing: 0.2,
  },
  listContent: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  jobContent: {
    flex: 1,
    paddingRight: 12,
  },
  jobTitle: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.2,
    lineHeight: 22,
  },
  jobCompany: {
    fontSize: 14,
    letterSpacing: 0.1,
  },
  savedBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  savedBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  divider: {
    height: 1,
    marginBottom: 12,
  },
  jobDetails: {
    gap: 8,
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '500',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
  },
  button: {
    flex: 1,
    height: 42,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryButton: {
  },
  secondaryButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyIconText: {
    fontSize: 32,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    marginBottom: 32,
    textAlign: 'center',
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  browseButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
});

export default SavedJobsScreen;