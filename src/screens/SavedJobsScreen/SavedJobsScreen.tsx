import React from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CommonActions } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

import { RootStackParamList } from '../../navigation/types';
import { useSavedJobs } from '../../context/SavedJobsContext';
import { useTheme } from '../../context/ThemeContext';
import { Job } from '../../types/Job';
import BottomTabBar from '../../components/BottomTabBar';
import JobCard from '../../components/JobCard';
import { styles } from './styles';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'SavedJobs'>;
};

const SavedJobsScreen: React.FC<Props> = ({ navigation }) => {
  const { savedJobs, unsaveJob } = useSavedJobs();
  const { colors } = useTheme();

  const navigateToJobFinder = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'JobFinder' }] }));
  };

  const handleRemoveJob = (job: Job) => {
    Alert.alert('Remove Job', `Remove "${job.title}" at ${job.company}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => unsaveJob(job.id) },
    ]);
  };

  const handleApply = () => navigation.navigate('ApplicationForm', { fromScreen: 'SavedJobs' });

  const renderJobItem = ({ item }: { item: Job }) => (
    <JobCard
      job={item}
      colors={colors}
      actions={
        <>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              styles.primaryAction,
              { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={handleApply}>
            <Text style={[styles.actionText, { color: colors.surface }]}>Apply</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [
              styles.actionBtn,
              { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.5 : 1 },
            ]}
            onPress={() => handleRemoveJob(item)}>
            <Feather name="trash-2" size={13} color={colors.text} />
            <Text style={[styles.actionText, { color: colors.text }]}>Remove</Text>
          </Pressable>
        </>
      }
    />
  );

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <View style={[styles.emptyIconWrap, { borderColor: colors.border }]}>
        <Feather name="bookmark" size={36} color={colors.textSecondary} />
      </View>
      <Text style={[styles.emptyTitle, { color: colors.text }]}>No Saved Jobs</Text>
      <Text style={[styles.emptyMessage, { color: colors.textSecondary }]}>
        Jobs you save will appear here
      </Text>
      <Pressable
        style={({ pressed }) => [styles.browseButton, { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 }]}
        onPress={navigateToJobFinder}>
        <Text style={[styles.browseButtonText, { color: colors.surface }]}>Browse Jobs</Text>
      </Pressable>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      <View style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.nav, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
            <Text style={[styles.navTitle, { color: colors.text }]}>Saved Jobs</Text>
          </View>
        </TouchableWithoutFeedback>

        {savedJobs.length > 0 && (
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.subtitle, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
              <Text style={[styles.subtitleText, { color: colors.textSecondary }]}>
                {savedJobs.length} {savedJobs.length === 1 ? 'job' : 'jobs'} saved
              </Text>
            </View>
          </TouchableWithoutFeedback>
        )}

        {savedJobs.length === 0 ? (
          renderEmptyState()
        ) : (
          <FlatList
            data={savedJobs}
            renderItem={renderJobItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}

        <BottomTabBar activeTab="SavedJobs" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default SavedJobsScreen;
