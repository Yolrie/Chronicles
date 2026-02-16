// src/services/supabase.ts

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

// Récupère les variables depuis la config Expo
const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseAnonKey = Constants.expoConfig?.extra?.supabaseAnonKey;

// Vérifie que les variables existent
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Les variables SUPABASE_URL et SUPABASE_ANON_KEY doivent être définies dans le fichier .env'
  );
}

// Crée le client Supabase
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
