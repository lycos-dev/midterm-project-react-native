import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { CommonActions } from '@react-navigation/native';

type JobFinderScreenProps = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;
};

// Dummy job data
const DUMMY_JOBS = [
  {
    id: '1',
    title: 'Senior React Native Developer',
    company: 'Tech Solutions Inc.',
    salary: '$90,000 - $120,000',
    location: 'Remote',
  },
  {
    id: '2',
    title: 'Frontend Engineer',
    company: 'StartupHub',
    salary: '$70,000 - $95,000',
    location: 'San Francisco, CA',
  },
  {
    id: '3',
    title: 'Full Stack Developer',
    company: 'Digital Dynamics',
    salary: '$85,000 - $110,000',
    location: 'New York, NY',
  },
  {
    id: '4',
    title: 'Mobile App Developer',
    company: 'AppWorks Studio',
    salary: '$75,000 - $100,000',
    location: 'Austin, TX',
  },
  {
    id: '5',
    title: 'UI/UX Designer',
    company: 'Creative Labs',
    salary: '$65,000 - $85,000',
    location: 'Los Angeles, CA',
  },
  {
    id: '6',
    title: 'Backend Developer',
    company: 'Cloud Services Co.',
    salary: '$80,000 - $105,000',
    location: 'Seattle, WA',
  },
  {
    id: '7',
    title: 'DevOps Engineer',
    company: 'Infrastructure Tech',
    salary: '$95,000 - $125,000',
    location: 'Remote',
  },
  {
    id: '8',
    title: 'Product Manager',
    company: 'Innovation Corp',
    salary: '$100,000 - $130,000',
    location: 'Boston, MA',
  },
];

const JobFinderScreen: React.FC<JobFinderScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSaveJob = (jobId: string, jobTitle: string) => {
    console.log(`Save Job pressed - ID: ${jobId}, Title: ${jobTitle}`);
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

  const renderJobItem = ({ item }: { item: typeof DUMMY_JOBS[0] }) => (
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
          style={[styles.actionButton, styles.saveButton]}
          onPress={() => handleSaveJob(item.id, item.title)}>
          <Text style={styles.saveButtonText}>Save Job</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButton, styles.applyButton]}
          onPress={() => handleApply(item.id, item.title)}>
          <Text style={styles.applyButtonText}>Apply</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

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

        {/* Job List */}
        <FlatList
          data={DUMMY_JOBS}
          renderItem={renderJobItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />

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
  applyButton: {
    backgroundColor: '#3B82F6',
  },
  saveButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#374151',
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