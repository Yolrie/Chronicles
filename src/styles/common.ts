// src/styles/common.ts
// Palette "Midnight Grimoire" — BG3-inspired dark fantasy
// Deep forest greens, midnight blues, aged parchment, rich gold

import { StyleSheet } from 'react-native';

// ── Couleurs ──────────────────────────────────────────────────────────────────

export const colors = {
  // Fonds — Midnight blue foundation
  ink:     '#0D1B2A',   // Fond principal — midnight blue
  deep:    '#0E1F2E',   // Fond des cartes
  deeper:  '#0A1520',   // Fond des éléments imbriqués
  forest:  '#1A2E1A',   // Vert forêt profonde (panneaux spéciaux)
  forestCard: '#192815',// Carte couleur forêt

  // Parchemin — texte et surfaces claires
  parchment:     '#F2E8C6', // Parchemin âgé — texte principal + bg parchemin
  parchmentDark: '#D4C4A0', // Parchemin sombre
  parchmentInk:  '#2C1810', // Encre foncée sur parchemin

  // Or — accent principal
  gold:  '#9A7B30',   // Or sombre (bordures subtiles, labels)
  gold2: '#C9A84C',   // Or principal (actifs, badges, highlights)
  gold3: '#E8C870',   // Or brillant (emphase maximale)
  amber: '#B8922A',   // Ambre (boutons secondaires)

  // Écarlate — action / danger
  crimson:  '#8B1A1A', // Crimson profond (BG danger)
  crimson2: '#C0392B', // Crimson vif (textes danger, CTA principal)
  crimsonGlow: '#E74C3C', // Crimson brillant

  // Fonctionnel
  success: '#2A6B3A',
  successBright: '#4CAF6E',
  info:    '#1B4A6B',

  // Texte secondaire — bleu-gris froid (signature BG3)
  muted:   '#7A9BB5', // Bleu-gris atténué
  steel:   '#A8C5D8', // Bleu-acier secondaire
  subtle:  '#4A6B80', // Très atténué

  // Bordures — or subtil
  border:       'rgba(201,168,76,0.2)',  // Bordure or subtile
  border2:      'rgba(201,168,76,0.42)', // Bordure or visible
  border3:      'rgba(201,168,76,0.65)', // Bordure or forte (accent)
  borderSubtle: 'rgba(168,197,216,0.1)', // Bordure bleue subtile

  // Utilitaires
  glass: 'rgba(13,27,42,0.92)',
  scrim: 'rgba(0,0,0,0.8)',
  overlay: 'rgba(13,27,42,0.95)',
};

// ── Typographie ────────────────────────────────────────────────────────────────

export const typography = {
  display: 'Cinzel Decorative',  // Titres décoratifs (écran d'accueil, logo)
  title:   'Cinzel',             // Titres et labels (serif élégant)
  body:    'EB Garamond',        // Corps de texte
};

// ── Ombre carte ────────────────────────────────────────────────────────────────

const cardShadow = {
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.4,
  shadowRadius: 10,
  elevation: 5,
};

const goldGlow = {
  shadowColor: colors.gold2,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 4,
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
    fontFamily: typography.body,
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

  // Carte parchemin — pour notes, journaux, histoires
  parchmentCard: {
    backgroundColor: '#F2E8C6',
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#8B7350',
    padding: 16,
    marginBottom: 12,
    ...cardShadow,
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
    fontFamily: typography.body,
    fontSize: 15,
    backgroundColor: 'rgba(14,31,46,0.8)',
  },

  // ── Boutons ────────────────────────────────────────────────────────────────

  // Crimson — action principale (créer héros, confirmer)
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

  // Or — action premium / fondation
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
    color: '#0A1520',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '700',
  },

  // Fantôme — action secondaire
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

  // Titre de section avec style BG3 — utiliser avec `◆ TITRE` dans le texte
  sectionTitle: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 1.8,
    marginBottom: 10,
  },
  bodyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.parchment,
    lineHeight: 22,
  },
  mutedText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 20,
  },
});
