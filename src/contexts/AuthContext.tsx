// src/contexts/AuthContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ApiUser, login, register } from '../services/api';

export interface AuthUser {
  id: number;
  email: string;
  username: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const STORAGE_KEY = '@hsc_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au démarrage, essayer de recharger l'utilisateur depuis le stockage local
  useEffect(() => {
    loadStoredUser();
  }, []);

  async function loadStoredUser() {
    try {
      setIsLoading(true);
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        const parsed: AuthUser = JSON.parse(json);
        setUser(parsed);
      }
    } catch (e) {
      console.warn('Erreur chargement utilisateur local', e);
    } finally {
      setIsLoading(false);
    }
  }

  async function persistUser(u: AuthUser | null) {
    if (u) {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      await AsyncStorage.removeItem(STORAGE_KEY);
    }
  }

  // Connexion
  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);
      const apiUser: ApiUser = await login(email, password);
      const authUser: AuthUser = {
        id: apiUser.id,
        email: apiUser.email,
        username: apiUser.username,
      };
      setUser(authUser);
      await persistUser(authUser);
    } catch (error: any) {
      console.error('Erreur signIn:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Inscription
  async function signUp(email: string, password: string, username: string) {
    try {
      setIsLoading(true);
      const apiUser: ApiUser = await register(email, password, username);
      const authUser: AuthUser = {
        id: apiUser.id,
        email: apiUser.email,
        username: apiUser.username,
      };
      setUser(authUser);
      await persistUser(authUser);
    } catch (error: any) {
      console.error('Erreur signUp:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Déconnexion
  async function signOut() {
    try {
      setIsLoading(true);
      setUser(null);
      await persistUser(null);
    } catch (error) {
      console.error('Erreur signOut:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  return ctx;
}
