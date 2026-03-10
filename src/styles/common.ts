// src/styles/common.ts

import { StyleSheet } from 'react-native';

export const colors = {
  ink: '#0b0806',
  deep: '#120e0a',
  parchment: '#f0e6c8',
  parch2: '#d4c89a',
  gold: '#c9983a',
  gold2: '#e8c060',
  gold3: '#7a5a1e',
  crimson: '#8b1a2a',
  crimson2: '#c42840',
  steel: '#9aa4b0',
  muted: '#6a5a40',
  border: 'rgba(201,152,58,0.22)',
  border2: 'rgba(201,152,58,0.45)',
  glass: 'rgba(18,14,10,0.85)',
};

export const typography = {
  display: 'Cinzel Decorative',
  title: 'Cinzel',
  body: 'EB Garamond',
};

export const commonStyles = StyleSheet.create({
  // Écran de base
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  // Header générique simple (si tu veux)
  headerTitle: {
    fontFamily: typography.title,
    fontSize: 18,
    fontWeight: '700',
    color: colors.parchment,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: '#9ca3af',
    marginTop: 4,
  },

  // Cartes "verre / parchemin sombre"
  card: {
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
  },

  // Label de champ
  fieldLabel: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 6,
  },

  // Wrapper de champ
  fieldWrap: {
    marginBottom: 14,
  },

  // Input texte
  input: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: colors.parchment,
    fontFamily: typography.body,
    fontSize: 15,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  // CTA principal (rouge)
  primaryCta: {
    backgroundColor: colors.crimson2,
    borderRadius: 7,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryCtaText: {
    fontFamily: typography.title,
    fontSize: 12,
    color: '#fce8e8',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // CTA gold
  goldCta: {
    borderRadius: 7,
    paddingVertical: 13,
    paddingHorizontal: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold2,
  },
  goldCtaText: {
    fontFamily: typography.title,
    fontSize: 12,
    color: '#1a0e00',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  // Bouton "ghost" (bordure or)
  ghostButton: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 10,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostButtonText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Bouton danger (petit)
  dangerButton: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(196,40,64,0.35)',
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: 'rgba(139,26,42,0.15)',
  },
  dangerButtonText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: '#e07070',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Badges
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 999,
    fontFamily: typography.title,
    fontSize: 9,
    letterSpacing: 1,
    textTransform: 'uppercase',
    fontWeight: '700',
    overflow: 'hidden',
  },
  badgeGold: {
    backgroundColor: 'rgba(201,152,58,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.4)',
    color: colors.gold2,
  },
  badgeCrimson: {
    backgroundColor: 'rgba(139,26,42,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(196,40,64,0.4)',
    color: '#e07070',
  },
  badgeGreen: {
    backgroundColor: 'rgba(20,80,40,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(50,160,80,0.4)',
    color: '#70c090',
  },
  badgePurple: {
    backgroundColor: 'rgba(80,20,120,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(140,70,200,0.4)',
    color: '#b080e0',
  },

  // Titre de section
  sectionTitle: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold3,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 8,
  },

  // Texte descriptif
  bodyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.parchment,
  },

  mutedText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
  },
});
