/**
 * CYCLE EN V — Niveau 4 : Tests unitaires
 * Module testé : src/types/index.ts
 *
 * Objectif : Valider les structures de données (interfaces TypeScript)
 *            en vérifiant que les objets conformes sont acceptés et que
 *            les champs obligatoires sont bien présents.
 *
 * Note : Ces tests fonctionnent à l'exécution (pas seulement à la compilation)
 *        grâce à des assertions sur des objets JS plain.
 */

import type { Character, Campaign, Profile, SessionLog } from '../../src/types';

function isValidCharacter(obj: unknown): obj is Character {
  const c = obj as Character;
  return (
    typeof c.id === 'string' &&
    typeof c.user_id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.level === 'number'
  );
}

function isValidCampaign(obj: unknown): obj is Campaign {
  const c = obj as Campaign;
  return (
    typeof c.id === 'string' &&
    typeof c.game_master_id === 'string' &&
    typeof c.name === 'string' &&
    typeof c.invite_code === 'string' &&
    typeof c.is_active === 'boolean'
  );
}

describe('[UNIT] Types — Character', () => {
  const validChar: Character = {
    id:         'uuid-1',
    user_id:    'user-uuid',
    name:       'Aragorn',
    level:      5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
  };

  it('valide un personnage minimal', () => {
    expect(isValidCharacter(validChar)).toBe(true);
  });

  it('accepte un campaign_id optionnel', () => {
    const withCampaign: Character = { ...validChar, campaign_id: 'camp-uuid' };
    expect(withCampaign.campaign_id).toBe('camp-uuid');
  });

  it('accepte des data_json optionnels', () => {
    const withData: Character = {
      ...validChar,
      data_json: {
        stats: { strength: 18, dexterity: 14, constitution: 16, intelligence: 10, wisdom: 12, charisma: 8 },
        hp_max: 45,
        hp_current: 32,
      },
    };
    expect(withData.data_json?.stats?.strength).toBe(18);
  });

  it('rejette un objet sans name', () => {
    const noName = { id: 'x', user_id: 'u', level: 1, created_at: '', updated_at: '' };
    expect(isValidCharacter(noName)).toBe(false);
  });
});

describe('[UNIT] Types — Campaign', () => {
  const validCamp: Campaign = {
    id:             'camp-uuid',
    game_master_id: 'gm-uuid',
    name:           'La Crypte Oubliée',
    invite_code:    'ABCD1234',
    is_active:      true,
    created_at:     '2026-01-01T00:00:00Z',
    updated_at:     '2026-01-01T00:00:00Z',
  };

  it('valide une campagne minimale', () => {
    expect(isValidCampaign(validCamp)).toBe(true);
  });

  it('accepte rules_json optionnel', () => {
    const withRules: Campaign = {
      ...validCamp,
      rules_json: { allowed_races: ['Humain', 'Elfe'], stat_method: 'standard_array' },
    };
    expect(withRules.rules_json).toBeDefined();
  });

  it('my_role peut être "game_master" ou "player"', () => {
    const asGM: Campaign = { ...validCamp, my_role: 'game_master' };
    const asPlayer: Campaign = { ...validCamp, my_role: 'player' };
    expect(asGM.my_role).toBe('game_master');
    expect(asPlayer.my_role).toBe('player');
  });
});

describe('[UNIT] Types — SessionLog status', () => {
  it('les statuts valides sont pending, approved, rejected', () => {
    const statuses: SessionLog['status'][] = ['pending', 'approved', 'rejected'];
    statuses.forEach(s => expect(typeof s).toBe('string'));
  });
});
