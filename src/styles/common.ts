// src/styles/common.ts
// Palette "Midnight Grimoire" — BG3-inspired dark fantasy
// Near-black stone, aged parchment, rich gold, deep crimson

import { StyleSheet } from 'react-native';

// ── Couleurs ──────────────────────────────────────────────────────────────────

export const colors = {
  // Fonds — stone-dark foundation
  ink:     '#07080A',   // Near-black stone (deepest background)
  deep:    '#0E1420',   // Dark slate (card backgrounds)
  deeper:  '#090C14',   // Nested element background
  forest:  '#1A2E1A',   // Deep forest green (special panels)

  // Parchemin — texte et surfaces claires
  parchment:     '#F2E8C6', // Aged parchment (main text + parchment bg)
  parchmentDark: '#D4C4A0', // Darker parchment
  parchmentInk:  '#2C1810', // Dark ink on parchment

  // Or — accent principal
  gold:  '#9A7B30',   // Subtle gold (borders, labels)
  gold2: '#C9A84C',   // Primary gold (active, badges, highlights)
  gold3: '#E8C870',   // Bright gold (maximum emphasis)
  amber: '#B8922A',   // Amber (secondary buttons)

  // Écarlate — action / danger
  crimson:     '#8B1A1A', // Deep crimson (danger backgrounds)
  crimson2:    '#C0392B', // Vivid crimson (danger text, main CTA)
  crimsonGlow: '#E74C3C', // Bright crimson glow

  // Fonctionnel
  success:      '#2A6B3A',
  successBright:'#4CAF6E',
  info:         '#0D1B2A',

  // Texte secondaire — bleu-gris froid (signature BG3)
  muted:   '#8BA4B8', // Muted blue-grey
  steel:   '#A8C5D8', // Steel blue secondary
  subtle:  '#4A6B80', // Very muted

  // Bordures — or subtil
  border:       'rgba(201,168,76,0.18)', // Subtle gold border
  border2:      'rgba(201,168,76,0.38)', // Visible gold border
  border3:      'rgba(201,168,76,0.60)', // Strong gold border (accent)
  borderSubtle: 'rgba(168,197,216,0.08)',// Subtle blue border

  // Utilitaires
  glass:   'rgba(7,8,10,0.94)',
  scrim:   'rgba(0,0,0,0.85)',
  overlay: 'rgba(7,8,10,0.97)',
};

// ── Typographie ────────────────────────────────────────────────────────────────

export const typography = {
  display: 'Cinzel Decorative', // Decorative display titles (logo, big headers)
  title:   'Cinzel',            // Section titles and labels (elegant serif)
  body:    undefined,           // System font for body text (omit fontFamily)
};

// ── Ombre carte ────────────────────────────────────────────────────────────────

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.5,
  shadowRadius: 12,
  elevation: 6,
};

const goldGlow = {
  shadowColor: colors.gold2,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.28,
  shadowRadius: 10,
  elevation: 5,
};

// ── Styles communs ─────────────────────────────────────────────────────────────

export const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },

  headerTitle: {
    fontFamily: typography.title,
    fontSize: 16,
    fontWeight: '700',
    color: colors.parchment,
    letterSpacing: 0.8,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.muted,
    marginTop: 4,
  },

  // ── Cartes ─────────────────────────────────────────────────────────────────

  card: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
  },

  // Stone card — even darker variant
  stoneCard: {
    backgroundColor: '#07080A',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
  },

  // Parchment panel — cream background for notes/journal areas
  parchmentPanel: {
    backgroundColor: colors.parchment,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B7350',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#3C2800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },

  // Carte parchemin — pour notes, journaux, histoires (alias)
  parchmentCard: {
    backgroundColor: '#F2E8C6',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B7350',
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
  },

  // ── Portrait frame ─────────────────────────────────────────────────────────
  // Base for character/campaign portrait placeholders
  portraitFrame: {
    backgroundColor: colors.deep,
    borderWidth: 1.5,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  // ── Champs ─────────────────────────────────────────────────────────────────

  fieldLabel: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 1.4,
    marginBottom: 7,
  },
  fieldWrap: {
    marginBottom: 16,
  },
  input: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 14,
    paddingVertical: 12,
    color: colors.parchment,
    fontSize: 15,
    backgroundColor: 'rgba(9,12,20,0.9)',
  },

  // ── Boutons ────────────────────────────────────────────────────────────────

  // Crimson — main action
  primaryCta: {
    backgroundColor: colors.crimson,
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.5)',
    ...cardShadow,
  },
  primaryCtaText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: '#F2E8C6',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  // Gold — premium/foundational action
  goldCta: {
    borderRadius: 8,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gold2,
    borderWidth: 1,
    borderColor: colors.gold3,
    ...goldGlow,
  },
  goldCtaText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: '#090C14',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  // Ghost — secondary action
  ghostButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(201,168,76,0.04)',
  },
  ghostButtonText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold2,
    letterSpacing: 1.2,
    textTransform: 'uppercase',
    fontWeight: '600',
  },

  // Danger
  dangerButton: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.35)',
    paddingVertical: 10,
    paddingHorizontal: 14,
    backgroundColor: 'rgba(139,26,26,0.12)',
  },
  dangerButtonText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: '#E07070',
    letterSpacing: 1.0,
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
    letterSpacing: 1.0,
    textTransform: 'uppercase',
    fontWeight: '700',
    overflow: 'hidden',
  },
  badgeGold: {
    backgroundColor: 'rgba(201,168,76,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(201,168,76,0.45)',
    color: colors.gold2,
  },
  badgeCrimson: {
    backgroundColor: 'rgba(139,26,26,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.4)',
    color: '#E07070',
  },
  badgeGreen: {
    backgroundColor: 'rgba(42,107,58,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(78,175,110,0.4)',
    color: '#4CAF6E',
  },
  badgePurple: {
    backgroundColor: 'rgba(80,30,120,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(140,80,200,0.4)',
    color: '#A070E0',
  },

  // ── Typographie ────────────────────────────────────────────────────────────

  // Section title — BG3 style — use with `◆ TITLE ◆` text
  sectionTitle: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  bodyText: {
    fontSize: 14,
    color: colors.parchment,
    lineHeight: 22,
  },
  mutedText: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },
});
