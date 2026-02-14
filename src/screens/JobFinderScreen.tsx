import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useSavedJobs } from '../context/SavedJobsContext';

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { saveJob, isJobSaved } = useSavedJobs();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('https://empllo.com/api/v1');
      
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      
      const data = await response.json();
      
      // Check if data has a jobs array or similar structure
      let jobsArray = [];
      
      if (Array.isArray(data)) {
        jobsArray = data;
      } else if (data.jobs && Array.isArray(data.jobs)) {
        jobsArray = data.jobs;
      } else if (data.data && Array.isArray(data.data)) {
        jobsArray = data.data;
      } else {
        // If it's an object with job listings as properties
        jobsArray = Object.values(data);
      }
      
      // Transform API data and assign unique IDs
      const transformedJobs: Job[] = jobsArray.map((job: any) => ({
        id: uuid.v4() as string,
        title: job.title || job.job_title || job.position || 'No Title',
        company: job.company || job.company_name || job.employer || 'Unknown Company',
        salary: job.salary || job.salary_range || job.pay || 'Salary not specified',
        location: job.location || job.city || job.address || 'Location not specified',
      }));
      
      setJobs(transformedJobs);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveJob = (job: Job) => {
    if (!isJobSaved(job.id)) {
      saveJob(job);
      console.log(`Job saved - ID: ${job.id}, Title: ${job.title}`);
    }
  };

  const handleApply = (jobId: string, jobTitle: string) => {
    console.log(`Apply pressed - ID: ${jobId}, Title: ${jobTitle}`);
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
        routes: [{ name: 'ApplicationForm' }],
      })
    );
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = isJobSaved(item.id);

    return (
      <View style={styles.jobCard}>
        <View style={styles.jobHeader}>
          <Text style={styles.jobTitle}>{item.title}</Text>
          <Text style={styles.jobCompany}>{item.company}</Text>
        </View>
        
        <View style={styles.jobDetails}>
          <Text style={styles.jobSalary}>{item.salary}</Text>
          <Text style={styles.jobLocation}>{item.location}</Text>
        </View>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.saveButton,
              isSaved && styles.savedButton,
            ]}
            onPress={() => handleSaveJob(item)}
            disabled={isSaved}>
            <Text
              style={[
                styles.saveButtonText,
                isSaved && styles.savedButtonText,
              ]}>
              {isSaved ? '✓ Saved' : 'Save Job'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, styles.applyButton]}
            onPress={() => handleApply(item.id, item.title)}>
            <Text style={styles.applyButtonText}>Apply</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#3B82F6" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>❌ {error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchJobs}>
            <Text style={styles.retryButtonText}>Retry</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (jobs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No jobs found</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={jobs}
        renderItem={renderJobItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.content}>
        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search jobs..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Job List / Loading / Error */}
        {renderContent()}

        {/* Navigation Buttons */}
        <View style={styles.navigationButtons}>
          <TouchableOpacity
            style={styles.navButton}
            onPress={navigateToSavedJobs}>
            <Text style={styles.navButtonText}>Go to Saved Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={navigateToApplicationForm}>
            <Text style={styles.navButtonText}>Go to Application Form</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FA',
  },
  content: {
    flex: 1,
  },
  searchContainer: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  searchInput: {
    height: 48,
    backgroundColor: '#F5F7FA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#333',
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
    color: '#6B7280',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
    textAlign: 'center',
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#3B82F6',
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
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  jobHeader: {
    marginBottom: 12,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 4,
  },
  jobCompany: {
    fontSize: 15,
    color: '#6B7280',
    fontWeight: '500',
  },
  jobDetails: {
    marginBottom: 16,
  },
  jobSalary: {
    fontSize: 16,
    fontWeight: '600',
    color: '#10B981',
    marginBottom: 4,
  },
  jobLocation: {
    fontSize: 14,
    color: '#9CA3AF',
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
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  savedButton: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  applyButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
  },
  savedButtonText: {
    color: '#fff',
  },
  applyButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  navigationButtons: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    gap: 8,
  },
  navButton: {
    backgroundColor: '#6366F1',
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