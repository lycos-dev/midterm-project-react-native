import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';
import uuid from 'react-native-uuid';
import { useSavedJobs } from '../context/SavedJobsContext';
import { useTheme } from '../context/ThemeContext';
import { Feather } from '@expo/vector-icons';
import BottomTabBar from '../components/BottomTabBar';

type JobFinderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;
};

interface Job {
  id: string;
  title: string;
  company: string;
  salary: string;
  location: string;
  logo?: string;
}

const JobFinderScreen: React.FC<JobFinderScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { saveJob, isJobSaved, savedJobs } = useSavedJobs();
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
        const company = job.companyName || job.company || job.company_name || job.employer || 'Unknown Company';
        
        const stableId = `${company}-${title}-${index}`.replace(/\s+/g, '-').toLowerCase();
        
        // Extract salary with proper handling of minSalary, maxSalary, and currency
        let salaryText = 'Negotiable';
        if (job.minSalary && job.maxSalary && job.currency) {
          salaryText = `${job.currency} ${job.minSalary.toLocaleString()} - ${job.maxSalary.toLocaleString()}`;
        } else if (job.minSalary && job.currency) {
          salaryText = `${job.currency} ${job.minSalary.toLocaleString()}`;
        } else if (job.salary || job.salary_range || job.pay) {
          salaryText = job.salary || job.salary_range || job.pay;
        }
        
        // Extract location from locations array
        let locationText = 'Location not specified';
        if (job.locations && Array.isArray(job.locations) && job.locations.length > 0) {
          locationText = job.locations.join(', ');
        } else if (job.location || job.city || job.address) {
          locationText = job.location || job.city || job.address;
        }
        
        return {
          id: stableId,
          title: title,
          company: company,
          salary: salaryText,
          location: locationText,
          logo: job.companyLogo || job.logo || job.company_logo || job.image || undefined,
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
      Alert.alert(
        'Save Job',
        `Save "${job.title}" at ${job.company}?`,
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Save',
            onPress: () => {
              saveJob(job);
              console.log(`Job saved - ID: ${job.id}, Title: ${job.title}`);
            },
          },
        ]
      );
    }
  };

  const handleApply = () => {
    navigation.navigate('ApplicationForm', { fromScreen: 'JobFinder' });
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = isJobSaved(item.id);

    return (
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
              { 
                backgroundColor: colors.surface,
                borderColor: colors.border,
                opacity: isSaved ? 0.5 : (pressed ? 0.5 : 1),
              },
            ]}
            onPress={() => handleSaveJob(item)}
            disabled={isSaved}>
            {isSaved && <Feather name="bookmark" size={13} color={colors.text} />}
            <Text style={[styles.actionText, { color: colors.text }]}>
              {isSaved ? 'Saved' : 'Save'}
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.primaryAction,
              { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={handleApply}>
            <Text style={[styles.actionText, { color: colors.surface }]}>Apply</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderContent = () => {
    if (loading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={colors.text} />
          <Text style={[styles.statusText, { color: colors.textSecondary }]}>Loading jobs...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>Error</Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>{error}</Text>
          <Pressable 
            style={({ pressed }) => [
              styles.retryBtn,
              { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={fetchJobs}>
            <Text style={[styles.retryText, { color: colors.surface }]}>Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (filteredJobs.length === 0) {
      return (
        <View style={styles.centerContainer}>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>No Jobs Found</Text>
          <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
            {searchQuery ? `No results for "${searchQuery}"` : 'No jobs available'}
          </Text>
        </View>
      );
    }

    return (
        <FlatList
          data={filteredJobs}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        {/* NAV */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={[styles.navTitle, { color: colors.text }]}>Job Finder</Text>
          </View>
        </TouchableWithoutFeedback>

        {/* SEARCH */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.searchSection, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <View style={[styles.searchBox, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <Text style={[styles.searchIcon, { color: colors.textSecondary }]}>⌕</Text>
              <TextInput
                style={[styles.searchInput, { color: colors.text }]}
                placeholder="Search jobs..."
                placeholderTextColor={colors.placeholder}
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Text style={[styles.resultCount, { color: colors.textSecondary }]}>
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'}
            </Text>
          </View>
        </TouchableWithoutFeedback>

        {renderContent()}

        <BottomTabBar activeTab="JobFinder" navigation={navigation} />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  // SEARCH
  searchSection: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 44,
    borderRadius: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
  },
  resultCount: {
    fontSize: 13,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  statusText: {
    marginTop: 16,
    fontSize: 15,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 15,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryBtn: {
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 6,
  },
  retryText: {
    fontSize: 15,
    fontWeight: '500',
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
});

export default JobFinderScreen;