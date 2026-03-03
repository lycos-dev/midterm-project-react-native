import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  FlatList,
  Modal,
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
  const [jobToRemove, setJobToRemove] = useState<Job | null>(null);

  const navigateToJobFinder = () => {
    navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'JobFinder' }] }));
  };

  const handleConfirmRemove = () => {
    if (!jobToRemove) return;
    unsaveJob(jobToRemove.id);
    setJobToRemove(null);
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
            onPress={() => setJobToRemove(item)}>
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

        {/* Remove Confirmation Modal */}
        <Modal
          visible={!!jobToRemove}
          transparent
          animationType="fade"
          onRequestClose={() => setJobToRemove(null)}>
          <Pressable style={styles.modalOverlay} onPress={() => setJobToRemove(null)}>
            <Pressable style={[styles.modalCard, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={(e) => e.stopPropagation()}>

              <View style={[styles.modalIconWrap, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Feather name="trash-2" size={28} color={colors.text} />
              </View>

              <Text style={[styles.modalTitle, { color: colors.text }]}>Remove this job?</Text>
              <Text style={[styles.modalJobTitle, { color: colors.text }]} numberOfLines={2}>{jobToRemove?.title}</Text>
              <Text style={[styles.modalCompany, { color: colors.textSecondary }]} numberOfLines={1}>{jobToRemove?.company}</Text>

              <View style={styles.modalActions}>
                <Pressable
                  style={({ pressed }) => [styles.modalBtn, { backgroundColor: colors.surface, borderColor: colors.border, opacity: pressed ? 0.5 : 1 }]}
                  onPress={() => setJobToRemove(null)}>
                  <Text style={[styles.modalBtnText, { color: colors.text }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={({ pressed }) => [styles.modalBtn, styles.modalBtnPrimary, { backgroundColor: colors.text, opacity: pressed ? 0.5 : 1 }]}
                  onPress={handleConfirmRemove}>
                  <Text style={[styles.modalBtnText, { color: colors.surface }]}>Remove</Text>
                </Pressable>
              </View>

            </Pressable>
          </Pressable>
        </Modal>

        <BottomTabBar activeTab="SavedJobs" navigation={navigation} />
      </View>
    </SafeAreaView>
  );
};

export default SavedJobsScreen;