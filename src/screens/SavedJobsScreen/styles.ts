import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
  },
  navTitle: {
    fontSize: 22,
    fontWeight: '600',
    letterSpacing: -0.5,
  },
  subtitle: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  subtitleText: { fontSize: 13 },
  list: { padding: 20 },
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
  primaryAction: { borderWidth: 0 },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyIconWrap: {
    width: 88,
    height: 88,
    borderRadius: 44,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  emptyTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  emptyMessage: { fontSize: 15, marginBottom: 32, textAlign: 'center' },
  browseButton: { paddingVertical: 12, paddingHorizontal: 28, borderRadius: 6 },
  browseButtonText: { fontSize: 15, fontWeight: '500' },
});
