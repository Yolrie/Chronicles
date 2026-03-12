/**
 * CYCLE EN V — Niveau 4 : Tests unitaires
 * Module testé : src/i18n/translations.ts + src/i18n/index.ts
 *
 * Objectif : Vérifier que le système de traduction retourne les bonnes valeurs
 *            et bascule correctement entre FR et EN.
 */

import { TRANSLATIONS } from '../../src/i18n/translations';

describe('[UNIT] Traductions — TRANSLATIONS', () => {
  describe('Français (fr)', () => {
    const fr = TRANSLATIONS.fr;

    it('contient toutes les clés de haut niveau', () => {
      expect(fr).toHaveProperty('app');
      expect(fr).toHaveProperty('auth');
      expect(fr).toHaveProperty('home');
      expect(fr).toHaveProperty('characters');
      expect(fr).toHaveProperty('campaigns');
      expect(fr).toHaveProperty('sessionLog');
      expect(fr).toHaveProperty('profile');
      expect(fr).toHaveProperty('common');
      expect(fr).toHaveProperty('nav');
      expect(fr).toHaveProperty('premium');
    });

    it('app.name vaut "Chronicles"', () => {
      expect(fr.app.name).toBe('Chronicles');
    });

    it('les fonctions de traduction dynamique fonctionnent', () => {
      expect(typeof fr.characters.deleteConfirm).toBe('function');
      expect(fr.characters.deleteConfirm('Aragorn')).toContain('Aragorn');
    });

    it('premium.features est un tableau non vide', () => {
      expect(Array.isArray(fr.premium.features)).toBe(true);
      expect(fr.premium.features.length).toBeGreaterThan(0);
    });

    it('chaque feature premium a icon, title et desc', () => {
      fr.premium.features.forEach(f => {
        expect(f).toHaveProperty('icon');
        expect(f).toHaveProperty('title');
        expect(f).toHaveProperty('desc');
        expect(typeof f.title).toBe('string');
      });
    });
  });

  describe('Anglais (en)', () => {
    const en = TRANSLATIONS.en;

    it('contient les mêmes clés de haut niveau que le français', () => {
      const frKeys = Object.keys(TRANSLATIONS.fr);
      const enKeys = Object.keys(en);
      expect(enKeys).toEqual(frKeys);
    });

    it('app.name vaut "Chronicles" (même dans les deux langues)', () => {
      expect(en.app.name).toBe('Chronicles');
    });

    it('la tagline EN est différente du FR', () => {
      expect(en.app.tagline).not.toBe(TRANSLATIONS.fr.app.tagline);
    });

    it('premium.features a le même nombre d\'entrées qu\'en FR', () => {
      expect(en.premium.features.length).toBe(TRANSLATIONS.fr.premium.features.length);
    });
  });

  describe('Structure partagée', () => {
    it('les deux locales ont les mêmes clés de nav', () => {
      const frNavKeys = Object.keys(TRANSLATIONS.fr.nav);
      const enNavKeys = Object.keys(TRANSLATIONS.en.nav);
      expect(enNavKeys).toEqual(frNavKeys);
    });

    it('les deux locales ont les mêmes clés de profile.roles', () => {
      expect(Object.keys(TRANSLATIONS.en.profile.roles))
        .toEqual(Object.keys(TRANSLATIONS.fr.profile.roles));
    });
  });
});
