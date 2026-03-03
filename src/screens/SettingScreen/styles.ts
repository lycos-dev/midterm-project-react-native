import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  nav: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
  navTitle: { fontSize: 22, fontWeight: '600', letterSpacing: -0.5 },
  content: { flex: 1, padding: 20 },
  sectionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 10,
    marginLeft: 4,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 },
  rowIcon: { fontSize: 22, width: 28, textAlign: 'center' },
  rowTitle: { fontSize: 15, fontWeight: '500', marginBottom: 2 },
  rowSubtitle: { fontSize: 13 },
  toggleHitbox: { padding: 4 },
  track: {
    width: 48,
    height: 28,
    borderRadius: 14,
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  thumb: { width: 22, height: 22, borderRadius: 11 },
});
