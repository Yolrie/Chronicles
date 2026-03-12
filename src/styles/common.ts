// src/styles/common.ts
// Palette "Grimoire & Parchemin" — tons chauds, lisible, sans effet néon

import { StyleSheet } from 'react-native';

export const colors = {
  // Fonds
  ink:     '#0e0c09',   // noir très chaud
  deep:    '#181310',   // fond de carte
  surface: '#201a12',   // surface légèrement levée
  overlay: '#251e14',   // modale / overlay

  // Textes
  parchment: '#e5d9b8', // ivoire principal — plus doux que blanc pur
  parch2:    '#c8bb90', // ivoire secondaire
  muted:     '#7d6e52', // gris-brun (labels, descriptions)
  subtle:    '#4a3e2c', // très atténué

  // Or / ambre — accentuation principale
  gold:  '#b8922a',  // or foncé (labels, liens)
  gold2: '#d4a840',  // or moyen (badges, valeurs)
  gold3: '#7a5e1a',  // or sombre (titres de section)
  amber: '#c87820',  // ambre chaud (CTA secondaire)

  // Rouge/brique — action principale, danger
  crimson:  '#7a1828', // rouge sombre
  crimson2: '#9e2c3c', // rouge moyen (CTA principal) — moins saturé qu'avant
  rust:     '#8a3820', // brique (variante)

  // Fonctionnel
  success: '#4a7a55', // vert désaturé
  info:    '#3a5a78', // bleu désaturé
  steel:   '#7a8490', // gris-acier

  // Bordures
  border:       'rgba(180,140,60,0.16)',  // très subtile
  border2:      'rgba(180,140,60,0.32)',  // visible
  borderSubtle: 'rgba(255,255,255,0.05)', // séparateur quasi invisible

  // Utilitaires
  glass: 'rgba(14,12,9,0.88)',
  scrim: 'rgba(0,0,0,0.72)',
};

export const typography = {
  display: 'Cinzel Decorative',
  title:   'Cinzel',
  body:    'EB Garamond',
};

// Élévation légère pour Android (shadow iOS incluse)
const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.28,
  shadowRadius: 6,
  elevation: 3,
};

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerTitle: {
    fontFamily: typography.title,
    fontSize: 17,
    fontWeight: '700',
    color: colors.parchment,
    letterSpacing: 0.6,
  },
  headerSubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  // ── Carte ──────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
  },

  // ── Champs ─────────────────────────────────────────────────────────────────
  fieldLabel: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  fieldWrap: {
    marginBottom: 14,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 13,
    paddingVertical: 11,
    color: colors.parchment,
    fontFamily: typography.body,
    fontSize: 15,
    backgroundColor: 'rgba(255,255,255,0.03)',
  },

  // ── Boutons ────────────────────────────────────────────────────────────────
  primaryCta: {
    backgroundColor: colors.crimson2,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
  },
  primaryCtaText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: '#f5e0e0',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  goldCta: {
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.amber,
    elevation: 2,
  },
  goldCtaText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: '#1a0e00',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  ghostButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 11,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  ghostButtonText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold,
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  dangerButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(158,44,60,0.4)',
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(120,24,40,0.12)',
  },
  dangerButtonText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: '#d07070',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // ── Badges ─────────────────────────────────────────────────────────────────
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 999,
    fontFamily: typography.title,
    fontSize: 9,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '700',
    overflow: 'hidden',
  },
  badgeGold: {
    backgroundColor: 'rgba(180,140,60,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(180,140,60,0.35)',
    color: colors.gold2,
  },
  badgeCrimson: {
    backgroundColor: 'rgba(120,24,40,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(158,44,60,0.38)',
    color: '#c87070',
  },
  badgeGreen: {
    backgroundColor: 'rgba(20,80,40,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(50,140,80,0.38)',
    color: '#68b080',
  },
  badgePurple: {
    backgroundColor: 'rgba(70,20,100,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(120,60,170,0.38)',
    color: '#9070c0',
  },

  // ── Typographie ────────────────────────────────────────────────────────────
  sectionTitle: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold3,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 8,
  },
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
