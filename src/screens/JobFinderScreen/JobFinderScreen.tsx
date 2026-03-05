import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Pressable,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Animated,
  Modal,
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
  const [jobToSave, setJobToSave] = useState<Job | null>(null);
  const [toastMessage, setToastMessage] = useState('');
  const toastOpacity = useRef(new Animated.Value(0)).current;
  const toastAnimation = useRef<Animated.CompositeAnimation | null>(null);

  const { jobs, loading, error, refetch } = useJobs();
  const { saveJob, isJobSaved, isJobApplied } = useSavedJobs();
  const { colors } = useTheme();

  const filteredJobs = searchQuery.trim()
    ? jobs.filter((j) => j.title.toLowerCase().includes(searchQuery.toLowerCase()))
    : jobs;

  const showToast = (message: string) => {
    if (toastAnimation.current) {
      toastAnimation.current.stop();
    }
    toastOpacity.setValue(0);
    setToastMessage(message);

    toastAnimation.current = Animated.sequence([
      Animated.timing(toastOpacity, { toValue: 1, duration: 200, useNativeDriver: true }),
      Animated.delay(1800),
      Animated.timing(toastOpacity, { toValue: 0, duration: 300, useNativeDriver: true }),
    ]);

    toastAnimation.current.start(() => {
      toastAnimation.current = null;
    });
  };

  const handleSavePress = (job: Job) => {
    if (isJobSaved(job.id)) return;
    setJobToSave(job);
  };

  const handleConfirmSave = () => {
    if (!jobToSave) return;
    saveJob(jobToSave);
    const title = jobToSave.title.length > 30
      ? jobToSave.title.slice(0, 30).trimEnd() + '…'
      : jobToSave.title;
    setJobToSave(null);
    showToast(`"${title}" saved`);
  };

  const handleCancelSave = () => setJobToSave(null);

  const handleApply = (job: Job) => {
    navigation.navigate('ApplicationForm', { 
      fromScreen: 'JobFinder',
      jobId: job.id 
    });
  };

  const renderJobItem = ({ item }: { item: Job }) => {
    const isSaved = isJobSaved(item.id);
    const isApplied = isJobApplied(item.id);
    
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
              onPress={() => handleSavePress(item)}
              disabled={isSaved}>
              {isSaved && <Feather name="bookmark" size={13} color={colors.text} />}
              <Text style={[styles.actionText, { color: colors.text }]}>{isSaved ? 'Saved' : 'Save'}</Text>
            </Pressable>
            <Pressable
              disabled={isApplied}
              style={({ pressed }) => [
                styles.actionBtn,
                styles.primaryAction,
                { 
                  backgroundColor: isApplied ? '#28a745' : colors.text,
                  opacity: isApplied ? 1 : (pressed ? 0.5 : 1),
                },
              ]}
              onPress={() => handleApply(item)}>
              {isApplied && <Feather name="check-circle" size={13} color="#FFFFFF" />}
              <Text style={[styles.actionText, { color: isApplied ? '#FFFFFF' : colors.surface }]}>
                {isApplied ? 'Applied' : 'Apply'}
              </Text>
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

        <Modal
          visible={!!jobToSave}
          transparent
          animationType="fade"
          onRequestClose={handleCancelSave}>
          <Pressable style={styles.modalOverlay} onPress={handleCancelSave}>
            <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={(e) => e.stopPropagation()}>
              <View style={[styles.modalIconWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Feather name="bookmark" size={28} color={colors.text} />
              </View>
              <Text style={[styles.modalTitle, { color: colors.text }]}>Save this job?</Text>
              <Text style={[styles.modalJobTitle, { color: colors.text }]} numberOfLines={2}>{jobToSave?.title}</Text>
              <Text style={[styles.modalCompany, { color: colors.textSecondary }]} numberOfLines={1}>{jobToSave?.company}</Text>
              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.modalBtn, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.5 : 1 }]}
                  onPress={handleCancelSave}>
                  <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 }]}
                  onPress={handleConfirmSave}>
                  <Text style={[styles.modalBtnText, { color: colors.surface }]}>Save</Text>
                </Pressable>
              </View>
            </Pressable>
          </Pressable>
        </Modal>

        <Animated.View
          pointerEvents="none"
          style={[styles.toast, { backgroundColor: colors.text, opacity: toastOpacity }]}>
          <Feather name="bookmark" size={14} color={colors.surface} />
          <Text style={[styles.toastText, { color: colors.surface }]} numberOfLines={1}>{toastMessage}</Text>
        </Animated.View>

        <BottomTabBar activeTab="JobFinder" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default JobFinderScreen;