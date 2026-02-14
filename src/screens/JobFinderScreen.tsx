import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';

type JobFinderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;
};

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
}

const JobFinderScreen: React.FC<JobFinderScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { saveJob, isJobSaved } = useSavedJobs();
  const { colors } = useTheme();

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchQuery, jobs]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://empllo.com/api/v1');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      
      let jobsArray = [];
      
      if (Array.isArray(data)) {
        jobsArray = data;
      } else if (data.jobs && Array.isArray(data.jobs)) {
        jobsArray = data.jobs;
      } else if (data.data && Array.isArray(data.data)) {
        jobsArray = data.data;
      } else {
        jobsArray = Object.values(data);
      }
      
      const transformedJobs: Job[] = jobsArray.map((job: any, index: number) => {
        const title = job.title || job.job_title || job.position || 'No Title';
        const company = job.company || job.company_name || job.employer || 'Unknown Company';
        
        const stableId = `${company}-${title}-${index}`.replace(/\s+/g, '-').toLowerCase();
        
        return {
          id: stableId,
          title: title,
          company: company,
          salary: job.salary || job.salary_range || job.pay || 'Salary not specified',
          location: job.location || job.city || job.address || 'Location not specified',
        };
      });
      
      setJobs(transformedJobs);
      setFilteredJobs(transformedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    if (!searchQuery.trim()) {
      setFilteredJobs(jobs);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = jobs.filter((job) =>
      job.title.toLowerCase().includes(query)
    );
    setFilteredJobs(filtered);
  };

  const handleSaveJob = (job: Job) => {
    if (!isJobSaved(job.id)) {
      saveJob(job);
      console.log(`Job saved - ID: ${job.id}, Title: ${job.title}`);
    }
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { fromScreen: 'JobFinder' });
  };

  const navigateToSavedJobs = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SavedJobs' }],
      })
    );
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = isJobSaved(item.id);

    return (
      <View style={[styles.jobCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
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
              { 
                backgroundColor: isSaved ? colors.success : colors.inputBackground, 
                borderColor: colors.border,
                opacity: pressed ? 0.7 : 1,
              },
              !isSaved && styles.saveButton,
            ]}
            onPress={() => handleSaveJob(item)}
            disabled={isSaved}>
            <Text style={[styles.buttonText, { color: isSaved ? '#fff' : colors.text }]}>
              {isSaved ? '✓ Saved' : '🔖 Save'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              styles.applyButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleApply}>
            <Text style={[styles.buttonText, { color: '#fff' }]}>📝 Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>🔍 Find Your Dream Job</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} available
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.savedJobsButton,
            { backgroundColor: colors.primaryLight, opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={navigateToSavedJobs}>
          <Text style={styles.savedJobsButtonText}>💾 Saved Jobs</Text>
        </Pressable>
      </View>
      
      <View style={styles.searchContainer}>
        <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>🔎</Text>
        <TextInput
          style={[styles.searchInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
          placeholder="Search by job title..."
          placeholderTextColor={colors.placeholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => setSearchQuery('')}>
            <Text style={[styles.clearButton, { color: colors.textSecondary }]}>✕</Text>
          </Pressable>
        )}
      </View>
    </View>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading amazing jobs...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorEmoji}>😞</Text>
          <Text style={[styles.errorTitle, { color: colors.text }]}>Oops!</Text>
          <Text style={[styles.errorText, { color: colors.error }]}>{error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={fetchJobs}>
            <Text style={styles.retryButtonText}>🔄 Try Again</Text>
          </Pressable>
        </View>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyEmoji}>🔍</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Jobs Found</Text>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery ? `No jobs match "${searchQuery}"` : 'No jobs available right now'}
          </Text>
          {searchQuery && (
            <Pressable 
              style={({ pressed }) => [
                styles.clearSearchButton,
                { backgroundColor: colors.inputBackground, opacity: pressed ? 0.7 : 1 },
              ]}
              onPress={() => setSearchQuery('')}>
              <Text style={[styles.clearSearchButtonText, { color: colors.text }]}>Clear Search</Text>
            </Pressable>
          )}
        </View>
      );
    }

    return (
      <FlatList
        data={filteredJobs}
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
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['bottom']}>
      {renderHeader()}
      {renderContent()}
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
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    fontWeight: '500',
  },
  savedJobsButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  savedJobsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 12,
  },
  searchIcon: {
    fontSize: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
  },
  clearButton: {
    fontSize: 20,
    paddingHorizontal: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
  },
  clearSearchButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  clearSearchButtonText: {
    fontSize: 15,
    fontWeight: '600',
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
  },
  jobHeader: {
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
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
  saveButton: {
    borderWidth: 1,
  },
  applyButton: {
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '700',
  },
});

export default JobFinderScreen;