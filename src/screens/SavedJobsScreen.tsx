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
  const { colors } = useTheme();

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
      <View style={styles.savedBadge}>
        <Text style={styles.savedBadgeText}>💾 SAVED</Text>
      </View>
      
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{item.company}</Text>
      </View>
      
      <View style={styles.jobInfo}>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>💰 Salary:</Text>
          <Text style={[styles.jobSalary, { color: colors.success }]}>{item.salary}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>📍 Location:</Text>
          <Text style={[styles.jobLocation, { color: colors.textSecondary }]}>{item.location}</Text>
        </View>
      </View>

      <View style={styles.buttonRow}>
        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.applyButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={handleApply}>
          <Text style={[styles.buttonText, { color: '#fff' }]}>📝 Apply Now</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.actionButton,
            styles.removeButton,
            { backgroundColor: colors.errorLight, borderColor: colors.error, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => handleRemoveJob(item.id, item.title)}>
          <Text style={[styles.buttonText, { color: colors.error }]}>🗑️ Remove</Text>
        </Pressable>
      </View>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyEmoji}>📂</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Jobs Yet</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Start exploring jobs and save the ones you like!
      </Text>
      <Pressable
        style={({ pressed }) => [
          styles.browseButton,
          { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
        ]}
        onPress={navigateToJobFinder}>
        <Text style={styles.browseButtonText}>🔍 Browse Jobs</Text>
      </Pressable>
    </View>
  );

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.5 : 1 },
        ]}
        onPress={navigateToJobFinder}>
        <Text style={[styles.backIcon, { color: colors.primary }]}>←</Text>
        <Text style={[styles.backText, { color: colors.primary }]}>Back to Job Finder</Text>
      </Pressable>
      
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>💾 My Saved Jobs</Text>
        {savedJobs.length > 0 && (
          <View style={[styles.countBadge, { backgroundColor: colors.success }]}>
            <Text style={styles.countText}>{savedJobs.length}</Text>
          </View>
        )}
      </View>
      
      {savedJobs.length > 0 && (
        <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
          You have {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
        </Text>
      )}
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {renderHeader()}
      
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
  headerContainer: {
    paddingTop: 16,
    paddingBottom: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backIcon: {
    fontSize: 24,
    marginRight: 8,
    fontWeight: '700',
  },
  backText: {
    fontSize: 16,
    fontWeight: '600',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    marginRight: 12,
  },
  countBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  countText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    position: 'relative',
  },
  savedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savedBadgeText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '700',
  },
  jobHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
    paddingRight: 80,
  },
  jobTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 6,
  },
  jobCompany: {
    fontSize: 16,
    fontWeight: '500',
  },
  jobInfo: {
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginRight: 8,
    minWidth: 100,
  },
  jobSalary: {
    fontSize: 15,
    fontWeight: '700',
    flex: 1,
  },
  jobLocation: {
    fontSize: 14,
    flex: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  applyButton: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  removeButton: {
    borderWidth: 2,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 24,
  },
  browseButton: {
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default SavedJobsScreen;