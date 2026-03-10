// src/styles/common.ts

import { StyleSheet } from 'react-native';

const commonStyles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#f5ecdd', // fond parchemin clair
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
  },

  // Conteneur principal (carte / panneau)
  card: {
    width: '100%',
    maxWidth: 520,
    borderRadius: 20,
    paddingVertical: 24,
    paddingHorizontal: 20,
    backgroundColor: '#fdf7ec',
    borderWidth: 1,
    borderColor: '#d3c1a3',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 8,
  },

  // Typographie globale inspirée du visuel
  title: {
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#1f2933', // noir/gris très foncé
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#4b5563',
    marginBottom: 16,
  },
  sectionHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9b1c1f', // rouge D&D atténué
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 6,
  },

  // Badges / pill
  pill: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    backgroundColor: '#ede2d0',
    marginBottom: 10,
  },
  pillText: {
    fontSize: 11,
    color: '#7c2d12',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#fee2e2',
    borderWidth: 1,
    borderColor: '#fecaca',
    marginBottom: 12,
  },
  badgeText: {
    fontSize: 12,
    color: '#991b1b',
  },

  // Stats en haut de Home
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e5d4b8',
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#faf0dd',
  },
  statLabel: {
    fontSize: 11,
    color: '#6b7280',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2933',
  },

  // Formulaire (login, fiche perso)
  input: {
    width: '100%',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#d1c1a5',
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: '#111827',
    marginBottom: 12,
    backgroundColor: '#fffaf0',
  },

  actions: {
    marginTop: 20,
    gap: 10,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: 10,
  },

  // Cartes personnages, style “carte papier”
  characterCard: {
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    backgroundColor: '#fffaf0',
    borderWidth: 1,
    borderColor: '#ddc9a9',
    marginBottom: 10,
  },
  characterHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  characterInitials: {
    width: 34,
    height: 34,
    borderRadius: 999,
    backgroundColor: '#e5d4b8',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  characterInitialsText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4b2e1a',
  },
  characterNameBlock: {
    flex: 1,
  },
  characterName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1f2933',
  },
  characterMetaLine: {
    fontSize: 11,
    color: '#6b7280',
  },
  characterFooterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    justifyContent: 'space-between',
  },
  characterTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    flex: 1,
  },
  characterTag: {
    fontSize: 11,
    color: '#6b7280',
    marginRight: 8,
  },
  characterActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Boutons type lien (Modifier / Supprimer)
  linkButton: {
    paddingVertical: 4,
    paddingHorizontal: 4,
  },
  linkButtonText: {
    fontSize: 12,
    color: '#b91c1c',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },

  // CTA principal rouge
  primaryCta: {
    width: '100%',
    borderRadius: 999,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#b91c1c',
  },
  primaryCtaText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fef2f2',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});

export default commonStyles;
