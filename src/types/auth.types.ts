// src/types/auth.types.ts

export interface User {
  id: string;
  email: string;
  username: string;
  avatar_url?: string;
  role: 'player' | 'game_master' | 'both';
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
}
