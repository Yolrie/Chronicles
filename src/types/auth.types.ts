// src/types/auth.types.ts

// Type pour les données du profil utilisateur
export interface Profile {
  id: string;
  username: string;
  avatar_url?: string; // ? = optionnel
  role: 'player' | 'game_master' | 'both';
  created_at: string;
  updated_at: string;
}

// Type pour les credentials de login
export interface LoginCredentials {
  email: string;
  password: string;
}

// Type pour l'inscription
export interface SignupCredentials extends LoginCredentials {
  username: string;
}

// Type pour l'état d'authentification
export interface AuthState {
  user: Profile | null;
  isLoading: boolean;
  error: string | null;
}
