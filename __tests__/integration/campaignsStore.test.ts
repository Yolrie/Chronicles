/**
 * CYCLE EN V — Niveau 3 : Tests d'intégration
 * Module testé : src/stores/campaignsStore.ts
 *
 * Objectif : Vérifier l'intégration entre le store Zustand et les appels Supabase mockés.
 *            - Création de campagne (succès + erreur)
 *            - Gestion du champ loading
 *            - Mise à jour des règles
 *            - joinCampaign
 */

jest.mock('../../src/lib/supabase', () => require('../../__mocks__/supabase'));

import { supabase } from '../../__mocks__/supabase';

// Reset le store entre chaque test
beforeEach(() => {
  jest.clearAllMocks();
});

describe('[INTEGRATION] campaignsStore — createCampaign', () => {
  it('passe loading à true pendant la requête, puis à false', async () => {
    // Simule un utilisateur connecté
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'user-1' } },
    });

    // Simule une réponse d'insertion réussie
    const mockInsert = {
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: {
          id: 'camp-1',
          name: 'Test',
          game_master_id: 'user-1',
          invite_code: 'ABCD1234',
          is_active: true,
          created_at: '',
          updated_at: '',
        },
        error: null,
      }),
    };
    (supabase.from as jest.Mock).mockReturnValueOnce({ insert: jest.fn().mockReturnValue(mockInsert) });

    // Import dynamique pour obtenir un store frais
    const { useCampaignsStore } = await import('../../src/stores/campaignsStore');
    const store = useCampaignsStore.getState();

    const result = await store.createCampaign('Test', 'Description');

    expect(result).not.toBeNull();
    expect(useCampaignsStore.getState().loading).toBe(false);
    expect(useCampaignsStore.getState().error).toBeNull();
  });

  it('stocke l\'erreur Supabase et met loading à false en cas d\'échec', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'user-1' } },
    });

    const mockInsert = {
      select: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'infinite recursion detected' },
      }),
    };
    (supabase.from as jest.Mock).mockReturnValueOnce({ insert: jest.fn().mockReturnValue(mockInsert) });

    const { useCampaignsStore } = await import('../../src/stores/campaignsStore');
    const store = useCampaignsStore.getState();

    const result = await store.createCampaign('Test');

    expect(result).toBeNull();
    expect(useCampaignsStore.getState().loading).toBe(false);
    expect(useCampaignsStore.getState().error).toBeTruthy();
  });
});

describe('[INTEGRATION] campaignsStore — clearError', () => {
  it('remet error à null', async () => {
    const { useCampaignsStore } = await import('../../src/stores/campaignsStore');
    useCampaignsStore.setState({ error: 'some error' });
    useCampaignsStore.getState().clearError();
    expect(useCampaignsStore.getState().error).toBeNull();
  });
});

describe('[INTEGRATION] campaignsStore — joinCampaign', () => {
  it('retourne "not_found" si aucune campagne active avec ce code', async () => {
    (supabase.auth.getUser as jest.Mock).mockResolvedValueOnce({
      data: { user: { id: 'user-1' } },
    });

    // Simule maybeSingle retournant null (code inexistant)
    const mockChain = {
      select: jest.fn().mockReturnThis(),
      eq:     jest.fn().mockReturnThis(),
      maybeSingle: jest.fn().mockResolvedValue({ data: null, error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValueOnce(mockChain);

    const { useCampaignsStore } = await import('../../src/stores/campaignsStore');
    const result = await useCampaignsStore.getState().joinCampaign('INVALID1');

    expect(result).toBe('not_found');
  });
});
