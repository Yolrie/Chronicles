// src/stores/authStore.ts

import { create } from 'zustand';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

interface AuthState {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  /** Vrai uniquement pendant l'initialisation de l'app — NE PAS utiliser pour les mutations */
  loading: boolean;
  /** Vrai pendant updateProfile / uploadAvatar */
  saving: boolean;
  error: string | null;

  initialize: () => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, username: string, role: Profile['role']) => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<Pick<Profile, 'username' | 'avatar_url' | 'role'>>) => Promise<boolean>;
  uploadAvatar: (localUri: string) => Promise<string | null>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  session: null,
  user:    null,
  profile: null,
  loading: true,
  saving:  false,
  error:   null,

  initialize: async () => {
    set({ loading: true });
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single();
        set({ session, user: session.user, profile, loading: false });
      } else {
        set({ loading: false });
      }
    } catch {
      set({ loading: false });
    }

    supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session) {
        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', session.user.id).single();
        set({ session, user: session.user, profile });
      } else {
        set({ session: null, user: null, profile: null });
      }
    });
  },

  signIn: async (email, password) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) { set({ loading: false, error: error.message }); throw error; }
      set({ loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  signUp: async (email, password, username, role) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase.auth.signUp({
        email, password,
        options: { data: { username, role } },
      });
      if (error) { set({ loading: false, error: error.message }); throw error; }
      set({ loading: false });
    } catch (err) {
      set({ loading: false });
      throw err;
    }
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ session: null, user: null, profile: null });
  },

  // ── Mise à jour profil ──────────────────────────────────────────────────────
  // Utilise `saving` (pas `loading`) pour ne PAS faire disparaître la navigation
  updateProfile: async (updates) => {
    const { user } = get();
    if (!user) return false;
    set({ saving: true, error: null });
    try {
      const { data, error } = await supabase
        .from('profiles')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', user.id)
        .select()
        .single();
      if (error) {
        set({ saving: false, error: error.message });
        return false;
      }
      set({ profile: data, saving: false });
      return true;
    } catch (err: unknown) {
      set({ saving: false, error: err instanceof Error ? err.message : 'Erreur inconnue' });
      return false;
    }
  },

  // ── Upload photo de profil ──────────────────────────────────────────────────
  uploadAvatar: async (localUri) => {
    const { user } = get();
    if (!user) return null;
    set({ saving: true, error: null });
    try {
      // Lit le fichier local comme ArrayBuffer (compatible iOS + Android)
      const response = await fetch(localUri);
      const arrayBuffer = await response.arrayBuffer();
      const ext = localUri.split('.').pop()?.toLowerCase().split('?')[0] ?? 'jpg';
      const mimeType = ext === 'jpg' ? 'image/jpeg' : `image/${ext}`;
      const path = `avatars/${user.id}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(path, arrayBuffer, { upsert: true, contentType: mimeType });

      if (uploadError) {
        set({ saving: false, error: uploadError.message });
        return null;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(path);

      // Cache-busting
      const urlWithBust = `${publicUrl}?t=${Date.now()}`;
      const ok = await get().updateProfile({ avatar_url: urlWithBust });
      set({ saving: !ok });
      return ok ? urlWithBust : null;
    } catch (err: unknown) {
      set({ saving: false, error: err instanceof Error ? err.message : 'Erreur upload' });
      return null;
    }
  },

  clearError: () => set({ error: null }),
}));
