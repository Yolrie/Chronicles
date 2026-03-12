// __mocks__/supabase.ts
// Mock du client Supabase pour les tests unitaires

export const mockSupabaseData: Record<string, unknown> = {};

const buildChain = (data: unknown = null, error: unknown = null) => ({
  data,
  error,
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  delete: jest.fn().mockReturnThis(),
  upsert: jest.fn().mockReturnThis(),
  eq:     jest.fn().mockReturnThis(),
  neq:    jest.fn().mockReturnThis(),
  in:     jest.fn().mockReturnThis(),
  order:  jest.fn().mockReturnThis(),
  limit:  jest.fn().mockReturnThis(),
  single: jest.fn().mockResolvedValue({ data, error }),
  maybeSingle: jest.fn().mockResolvedValue({ data, error }),
  then: jest.fn((cb: (v: { data: unknown; error: unknown }) => void) => cb({ data, error })),
});

export const supabase = {
  auth: {
    getSession:       jest.fn().mockResolvedValue({ data: { session: null } }),
    getUser:          jest.fn().mockResolvedValue({ data: { user: null } }),
    signInWithPassword: jest.fn().mockResolvedValue({ data: {}, error: null }),
    signUp:           jest.fn().mockResolvedValue({ data: {}, error: null }),
    signOut:          jest.fn().mockResolvedValue({ error: null }),
    onAuthStateChange: jest.fn().mockReturnValue({ data: { subscription: { unsubscribe: jest.fn() } } }),
  },
  from: jest.fn().mockReturnValue(buildChain()),
};
