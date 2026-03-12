/**
 * CYCLE EN V — Niveau 3 : Tests d'intégration
 * Module testé : src/stores/authStore.ts
 *
 * Objectif : Vérifier que le store d'authentification gère correctement
 *            les états session / loading / error et les appels Supabase.
 */

jest.mock('../../src/lib/supabase', () => require('../../__mocks__/supabase'));

import { supabase } from '../../__mocks__/supabase';

beforeEach(() => jest.clearAllMocks());

describe('[INTEGRATION] authStore — initialize', () => {
  it('met loading à false si aucune session', async () => {
    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: null },
    });
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValueOnce({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    const { useAuthStore } = await import('../../src/stores/authStore');
    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().loading).toBe(false);
    expect(useAuthStore.getState().session).toBeNull();
  });

  it('charge le profil si une session est active', async () => {
    const fakeSession = { user: { id: 'user-1' }, access_token: 'tok' };

    (supabase.auth.getSession as jest.Mock).mockResolvedValueOnce({
      data: { session: fakeSession },
    });
    (supabase.auth.onAuthStateChange as jest.Mock).mockReturnValueOnce({
      data: { subscription: { unsubscribe: jest.fn() } },
    });

    // Mock de la requête profil
    const profileData = {
      id: 'user-1', username: 'aragorn', role: 'player',
      created_at: '2026-01-01', updated_at: '2026-01-01',
    };
    const mockFrom = {
      select: jest.fn().mockReturnThis(),
      eq:     jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({ data: profileData, error: null }),
    };
    (supabase.from as jest.Mock).mockReturnValueOnce(mockFrom);

    const { useAuthStore } = await import('../../src/stores/authStore');
    await useAuthStore.getState().initialize();

    expect(useAuthStore.getState().loading).toBe(false);
  });
});

describe('[INTEGRATION] authStore — clearError', () => {
  it('remet error à null', async () => {
    const { useAuthStore } = await import('../../src/stores/authStore');
    useAuthStore.setState({ error: 'something went wrong' });
    useAuthStore.getState().clearError();
    expect(useAuthStore.getState().error).toBeNull();
  });
});
