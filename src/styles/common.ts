// src/styles/common.ts

import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#0f172a', // fond sombre moderne (bleu nuit)
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#0b1120', // carte un peu plus claire
    borderWidth: 1,
    borderColor: 'rgba(148, 163, 184, 0.3)',
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 24,
  },
  actions: {
    marginTop: 12,
  },
});

export default commonStyles;
