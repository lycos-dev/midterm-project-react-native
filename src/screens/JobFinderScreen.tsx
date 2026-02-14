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
        <View style={styles.jobContent}>
          <Text style={[styles.jobTitle, { color: colors.text }]}>{item.title}</Text>
          <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{item.company}</Text>
          
          <View style={styles.jobDetails}>
            <Text style={[styles.jobDetail, { color: colors.textSecondary }]}>{item.salary}</Text>
            <Text style={[styles.jobDetail, { color: colors.textSecondary }]}>{item.location}</Text>
          </View>
        </View>

        <View style={styles.buttonRow}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.saveButton,
              { 
                backgroundColor: isSaved ? colors.primary : colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.6 : 1,
              },
            ]}
            onPress={() => handleSaveJob(item)}
            disabled={isSaved}>
            <Text style={[styles.buttonText, { color: isSaved ? colors.surface : colors.text }]}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              styles.applyButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={handleApply}>
            <Text style={[styles.buttonText, { color: colors.surface }]}>Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <View style={styles.headerTop}>
        <View>
          <Text style={[styles.headerTitle, { color: colors.text }]}>Job Finder</Text>
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.savedButton,
            { borderColor: colors.border, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={navigateToSavedJobs}>
          <Text style={[styles.savedButtonText, { color: colors.text }]}>Saved</Text>
        </Pressable>
      </View>
      
      <TextInput
        style={[styles.searchInput, { 
          backgroundColor: colors.inputBackground, 
          color: colors.text,
          borderColor: colors.border,
        }]}
        placeholder="Search jobs..."
        placeholderTextColor={colors.placeholder}
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
    </View>
  );

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
          <Text style={[styles.errorText, { color: colors.text }]}>Error: {error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryButton,
              { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
            ]}
            onPress={fetchJobs}>
            <Text style={[styles.retryButtonText, { color: colors.surface }]}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            {searchQuery ? 'No jobs found' : 'No jobs available'}
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
      {renderHeader()}
      {renderContent()}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  savedButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 6,
    borderWidth: 1,
  },
  savedButtonText: {
    fontSize: 14,
    fontWeight: '500',
  },
  searchInput: {
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 15,
    borderWidth: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
  },
  errorText: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 6,
  },
  retryButtonText: {
    fontSize: 15,
    fontWeight: '500',
  },
  emptyText: {
    fontSize: 15,
    textAlign: 'center',
  },
  listContent: {
    padding: 16,
  },
  jobCard: {
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  jobContent: {
    marginBottom: 16,
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  jobCompany: {
    fontSize: 15,
    marginBottom: 12,
  },
  jobDetails: {
    gap: 4,
  },
  jobDetail: {
    fontSize: 14,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    flex: 1,
    height: 40,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveButton: {
    borderWidth: 1,
  },
  applyButton: {
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
});

export default JobFinderScreen;