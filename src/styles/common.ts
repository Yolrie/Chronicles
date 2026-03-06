// src/styles/common.ts

import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#020617',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#020617',
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    shadowColor: '#000',
    shadowOpacity: 0.35,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 14 },
    elevation: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#e5e7eb',
    marginBottom: 8,
    textAlign: 'left',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'left',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    color: '#9ca3af',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 16,
    marginBottom: 6,
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    marginBottom: 12,
  },
  pillText: {
    fontSize: 11,
    color: '#38bdf8',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(52, 211, 153, 0.12)',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#22c55e',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 12,
  },
  statCard: {
    flex: 1,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.35)',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#020617',
  },
  statLabel: {
    fontSize: 11,
    color: '#9ca3af',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
  },
  actions: {
    marginTop: 20,
    gap: 8,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  input: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#e5e7eb',
    marginBottom: 12,
    backgroundColor: '#020617',
  },
});

export default commonStyles;
