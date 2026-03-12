/**
 * CYCLE EN V — Niveau 3 : Tests de composants
 * Composant testé : src/screens/PremiumScreen.tsx
 *
 * Objectif : Vérifier que l'écran Premium affiche correctement toutes les
 *            fonctionnalités listées et ne montre ni prix ni date.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import { TRANSLATIONS } from '../../src/i18n/translations';

// Mock useI18n pour retourner les traductions FR
jest.mock('../../src/i18n', () => ({
  useI18n: () => ({ t: TRANSLATIONS.fr, locale: 'fr', setLocale: jest.fn() }),
}));

// Mocks nécessaires pour React Navigation et SafeAreaView
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({ navigate: jest.fn(), goBack: jest.fn() }),
}));
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaView: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import PremiumScreen from '../../src/screens/PremiumScreen';

describe('[COMPONENT] PremiumScreen', () => {
  it('affiche le titre de l\'écran', () => {
    render(<PremiumScreen />);
    expect(screen.getByText('Chronicles Premium')).toBeTruthy();
  });

  it('affiche la mention "En cours de développement"', () => {
    render(<PremiumScreen />);
    const inDevElements = screen.getAllByText('En cours de développement');
    expect(inDevElements.length).toBeGreaterThan(0);
  });

  it('affiche toutes les fonctionnalités listées en FR', () => {
    render(<PremiumScreen />);
    TRANSLATIONS.fr.premium.features.forEach(f => {
      expect(screen.getByText(f.title)).toBeTruthy();
    });
  });

  it('NE contient pas de prix (€, $, prix, gratuit)', () => {
    render(<PremiumScreen />);
    // Vérifie qu'aucun nœud texte ne contient un symbole monétaire
    const allText = screen.toJSON();
    const json = JSON.stringify(allText);
    expect(json).not.toMatch(/€|\$|prix|gratuit|abonnement|\d+[.,]\d{2}/i);
  });

  it('NE contient pas de date précise (Q1, 2026, janvier, etc.)', () => {
    render(<PremiumScreen />);
    const json = JSON.stringify(screen.toJSON());
    expect(json).not.toMatch(/202[0-9]|Q[1-4]\s|janvier|février|mars|avril|mai|juin|juillet|août|septembre|octobre|novembre|décembre/i);
  });

  it('affiche la description de l\'app', () => {
    render(<PremiumScreen />);
    expect(screen.getByText(TRANSLATIONS.fr.premium.description)).toBeTruthy();
  });
});
