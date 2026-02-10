// src/services/supabase.ts

import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Récupère les variables d'environnement
const supabaseUrl = process.env.SUPABASE_URL!;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!;

// Crée le client Supabase avec stockage persistant
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage, // Sauvegarde la session localement
    autoRefreshToken: true, // Rafraîchit automatiquement le token
    persistSession: true,   // Garde l'user connecté
    detectSessionInUrl: false,
  },
});
