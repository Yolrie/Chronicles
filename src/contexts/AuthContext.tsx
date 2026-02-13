// src/contexts/AuthContext.tsx

import React, { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../services/supabase';
import { User, AuthState } from '../types/auth.types';

// Interface de ce qu'expose le Context
interface AuthContextType extends AuthState {
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// Créer le Context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Au chargement : vérifie si un user est déjà connecté
  useEffect(() => {
    checkUser();
  }, []);

  // Fonction pour vérifier la session existante
  async function checkUser() {
    try {
      setIsLoading(true);
      
      // Récupère la session Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        // Récupère le profil complet depuis la BDD
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;
        
        // Met à jour le state avec l'utilisateur
        setUser({
          id: profile.id,
          email: session.user.email!,
          username: profile.username,
          avatar_url: profile.avatar_url,
          role: profile.role,
        });
      }
    } catch (error) {
      console.error('Erreur checkUser:', error);
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction de connexion
  async function signIn(email: string, password: string) {
    try {
      setIsLoading(true);

      // Authentifie avec Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Récupère le profil
      if (data.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (profileError) throw profileError;

        setUser({
          id: profile.id,
          email: data.user.email!,
          username: profile.username,
          avatar_url: profile.avatar_url,
          role: profile.role,
        });
      }
    } catch (error: any) {
      console.error('Erreur signIn:', error.message);
      throw error; // Relance l'erreur pour que l'UI puisse l'afficher
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction d'inscription
  async function signUp(email: string, password: string, username: string) {
    try {
      setIsLoading(true);

      // 1. Crée le compte auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      // 2. Crée le profil
      if (data.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: data.user.id,
            username,
            role: 'player',
          });

        if (profileError) throw profileError;

        // 3. Récupère le profil créé
        const { data: profile, error: fetchError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        if (fetchError) throw fetchError;

        setUser({
          id: profile.id,
          email: data.user.email!,
          username: profile.username,
          avatar_url: profile.avatar_url,
          role: profile.role,
        });
      }
    } catch (error: any) {
      console.error('Erreur signUp:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Fonction de déconnexion
  async function signOut() {
    try {
      setIsLoading(true);
      await supabase.auth.signOut();
      setUser(null);
    } catch (error: any) {
      console.error('Erreur signOut:', error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }

  // Valeur partagée
  const value = {
    user,
    isLoading,
    signIn,
    signUp,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Hook custom
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth doit être utilisé dans un AuthProvider');
  }
  
  return context;
}
