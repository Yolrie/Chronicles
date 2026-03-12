/**
 * CYCLE EN V — Niveau 3 : Tests de composants
 * Composant testé : src/components/ImagePlaceholder.tsx
 *
 * Objectif : Vérifier l'affichage conditionnel selon qu'une URI est fournie ou non.
 */

import React from 'react';
import { render, screen } from '@testing-library/react-native';
import ImagePlaceholder from '../../src/components/ImagePlaceholder';

describe('[COMPONENT] ImagePlaceholder', () => {
  it('affiche le label par défaut si aucun uri n\'est fourni', () => {
    render(<ImagePlaceholder />);
    expect(screen.getByText('Image à venir')).toBeTruthy();
  });

  it('affiche un label personnalisé', () => {
    render(<ImagePlaceholder label="Photo de profil" />);
    expect(screen.getByText('Photo de profil')).toBeTruthy();
  });

  it('affiche une Image (pas le placeholder) quand un uri est fourni', () => {
    const { UNSAFE_getByType } = render(
      <ImagePlaceholder uri="https://example.com/img.jpg" />
    );
    const { Image } = require('react-native');
    // Si un uri est fourni, le composant React Native Image doit être présent
    expect(() => UNSAFE_getByType(Image)).not.toThrow();
  });

  it('n\'affiche pas le texte placeholder quand un uri est fourni', () => {
    render(<ImagePlaceholder uri="https://example.com/img.jpg" />);
    expect(screen.queryByText('Image à venir')).toBeNull();
  });
});
