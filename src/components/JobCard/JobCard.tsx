import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { ThemeColors } from '../../constants/theme';
import { Job } from '../../types/Job';

interface Props {
  job: Job;
  colors: ThemeColors;
}

const JobCardHeader: React.FC<Props> = ({ job, colors }) => (
  <View style={styles.jobHeader}>
    <View style={[styles.logoContainer, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      {job.logo ? (
        <Image source={{ uri: job.logo }} style={styles.logo} resizeMode="contain" />
      ) : (
        <Text style={[styles.logoPlaceholder, { color: colors.textSecondary }]}>
          {job.company.charAt(0).toUpperCase()}
        </Text>
      )}
    </View>
    <View style={styles.jobHeaderContent}>
      <Text style={[styles.jobTitle, { color: colors.text }]}>{job.title}</Text>
      <Text style={[styles.jobCompany, { color: colors.textSecondary }]}>{job.company}</Text>
    </View>
  </View>
);

const JobCardInfo: React.FC<Props> = ({ job, colors }) => (
  <View style={styles.jobInfo}>
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Salary</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{job.salary}</Text>
    </View>
    <View style={styles.infoItem}>
      <Text style={[styles.infoLabel, { color: colors.textSecondary }]}>Location</Text>
      <Text style={[styles.infoValue, { color: colors.text }]} numberOfLines={1}>{job.location}</Text>
    </View>
  </View>
);

interface JobCardProps {
  job: Job;
  colors: ThemeColors;
  actions: React.ReactNode;
}

const JobCard: React.FC<JobCardProps> = ({ job, colors, actions }) => (
  <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
    <JobCardHeader job={job} colors={colors} />
    <JobCardInfo job={job} colors={colors} />
    <View style={styles.actions}>{actions}</View>
  </View>
);

export const styles = StyleSheet.create({
  card: {
    borderRadius: 6,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
  },
  jobHeader: {
    flexDirection: 'row',
    marginBottom: 16,
    gap: 12,
    alignItems: 'center',
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
});

export default JobCard;
