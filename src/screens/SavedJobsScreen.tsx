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
            styles.applyButton,
            { backgroundColor: colors.primary, opacity: pressed ? 0.6 : 1 },
          ]}
          onPress={handleApply}>
          <Text style={[styles.buttonText, { color: colors.surface }]}>Apply</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.removeButton,
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
      <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
        No saved jobs yet
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

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
      <Pressable
        style={({ pressed }) => [
          styles.backButton,
          { opacity: pressed ? 0.5 : 1 },
        ]}
        onPress={navigateToJobFinder}>
        <Text style={[styles.backText, { color: colors.text }]}>← Back</Text>
      </Pressable>
      
      <View style={styles.headerContent}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Saved Jobs</Text>
        {savedJobs.length > 0 && (
          <Text style={[styles.headerSubtitle, { color: colors.textSecondary }]}>
            {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'}
          </Text>
        )}
      </View>
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
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  backText: {
    fontSize: 15,
    fontWeight: '500',
  },
  headerContent: {
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: -0.5,
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
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
  applyButton: {
  },
  removeButton: {
    borderWidth: 1,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    letterSpacing: 0.2,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyText: {
    fontSize: 15,
    marginBottom: 24,
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