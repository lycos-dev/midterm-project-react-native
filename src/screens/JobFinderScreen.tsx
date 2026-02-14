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

  const navigateToApplicationForm = () => {
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'ApplicationForm', params: { fromScreen: 'JobFinder' } }],
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
        
        <View style={styles.jobDetails}>
          <Text style={[styles.jobSalary, { color: colors.success }]}>{item.salary}</Text>
          <Text style={[styles.jobLocation, { color: colors.textSecondary }]}>{item.location}</Text>
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
            <Text style={[styles.saveButtonText, { color: isSaved ? '#fff' : colors.text }]}>
              {isSaved ? '✓ Saved' : 'Save Job'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={handleApply}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Loading jobs...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>❌ {error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={fetchJobs}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery ? 'No jobs found matching your search' : 'No jobs available'}
          </Text>
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
      <View style={styles.content}>
        <View style={[styles.searchContainer, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.inputBackground, color: colors.text }]}
            placeholder="Search jobs by title..."
            placeholderTextColor={colors.placeholder}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {renderContent()}

        <View style={[styles.navigationButtons, { backgroundColor: colors.surface, borderTopColor: colors.border }]}>
          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: colors.primaryLight, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={navigateToSavedJobs}>
            <Text style={styles.navButtonText}>Go to Saved Jobs</Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.navButton,
              { backgroundColor: colors.primaryLight, opacity: pressed ? 0.7 : 1 },
            ]}
            onPress={navigateToApplicationForm}>
            <Text style={styles.navButtonText}>Go to Application Form</Text>
          </Pressable>
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  searchInput: {
    height: 48,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
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
  errorText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
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
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 44,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 1,
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  navigationButtons: {
    padding: 16,
    borderTopWidth: 1,
    gap: 8,
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

export default JobFinderScreen;