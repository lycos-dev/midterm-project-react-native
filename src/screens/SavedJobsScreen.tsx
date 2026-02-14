import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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

  const renderJobItem = ({ item }: { item: Job }) => (
    <View style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={styles.jobHeader}>
        <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
        <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{item.company}</Text>
      </View>
      
      <View style={styles.jobDetails}>
        <Text style={[styles.jobSalary, { color: colors.success }]}>{item.salary}</Text>
        <Text style={[styles.jobLocation, { color: colors.textSecondary }]}>{item.location}</Text>
      </View>

      <TouchableOpacity
        style={[styles.removeButton, { backgroundColor: colors.errorLight, borderColor: colors.error }]}
        onPress={() => handleRemoveJob(item.id, item.title)}>
        <Text style={[styles.removeButtonText, { color: colors.error }]}>Remove</Text>
      </TouchableOpacity>
    </View>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyIcon}>📋</Text>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Jobs</Text>
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        Jobs you save will appear here
      </Text>
      <TouchableOpacity
        style={[styles.browseButton, { backgroundColor: colors.primary }]}
        onPress={navigateToJobFinder}>
        <Text style={styles.browseButtonText}>Browse Jobs</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      <View style={styles.content}>
        {savedJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <>
            <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
              <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Jobs</Text>
              <Text style={[styles.headerCount, { color: colors.textSecondary }]}>
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'}
              </Text>
            </View>

            <FlatList
              data={savedJobs}
              renderItem={renderJobItem}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </>
        )}

        <View style={[styles.navigationButtons, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <TouchableOpacity
            style={[styles.navButton, { backgroundColor: colors.primaryLight }]}
            onPress={navigateToJobFinder}>
            <Text style={styles.navButtonText}>Go to Job Finder</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  headerCount: {
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 15,
    fontWeight: '500',
  },
  jobDetails: {
    marginBottom: 16,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
  },
  removeButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  removeButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIcon: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  browseButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  browseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  navigationButtons: {
    padding: 16,
    borderTopWidth: 1,
  },
  navButton: {
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
});

export default SavedJobsScreen;