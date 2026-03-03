import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/types';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useTheme } from '../../context/ThemeContext';
import { useJobs } from '../../hooks/useJobs';
import { Job } from '../../types/Job';
import BottomTabBar from '../../components/BottomTabBar';
import JobCard from '../../components/JobCard';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'JobFinder'>;
};

const JobFinderScreen: React.FC<Props> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { jobs, loading, error, refetch } = useJobs();
  const { saveJob, isJobSaved } = useSavedJobs();
  const { colors } = useTheme();

  const filteredJobs = searchQuery.trim()
    ? jobs.filter((j) => j.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : jobs;

  const handleSaveJob = (job: Job) => {
    if (isJobSaved(job.id)) return;
    Alert.alert('Save Job', `Save "${job.title}" at ${job.company}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Save', onPress: () => saveJob(job) },
    ]);
  };

  const handleApply = () => navigation.navigate('ApplicationForm', { fromScreen: 'JobFinder' });

  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = isJobSaved(item.id);
    return (
      <JobCard
        job={item}
        colors={colors}
        actions={
          <>
            <Pressable
              style={({ pressed }) => [
                styles.actionBtn,
                { backgroundColor: colors.surface, borderColor: colors.border, opacity: isSaved ? 0.5 : pressed ? 0.5 : 1 },
              ]}
              onPress={() => handleSaveJob(item)}
              disabled={isSaved}>
              {isSaved && <Feather name="bookmark" size={13} color={colors.text} />}
              <Text style={[styles.actionText, { color: colors.text }]}>{isSaved ? 'Saved' : 'Save'}</Text>
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
          </>
        }
      />
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
            style={({ pressed }) => [styles.retryBtn, { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 }]}
            onPress={refetch}>
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
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={[styles.navTitle, { color: colors.text }]}>Job Finder</Text>
          </View>
        </TouchableWithoutFeedback>

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

export default JobFinderScreen;
