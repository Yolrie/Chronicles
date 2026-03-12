// src/stores/charactersStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Character, CharacterData } from '../types';

type CharacterInput = {
  name: string;
  race?: string;
  class?: string;
  background?: string;
  level?: number;
  game_system_id?: string;
  campaign_id?: string;
  data_json?: CharacterData;
};

interface CharactersState {
  characters: Character[];
  loading: boolean;
  error: string | null;

  fetchCharacters: () => Promise<void>;
  fetchCampaignCharacters: (campaignId: string) => Promise<Character[]>;
  createCharacter: (input: CharacterInput) => Promise<Character | null>;
  updateCharacter: (id: string, updates: Partial<CharacterInput>) => Promise<void>;
  deleteCharacter: (id: string) => Promise<void>;
  getCharacter: (id: string) => Character | undefined;
  clearError: () => void;
}

export const useCharactersStore = create<CharactersState>((set, get) => ({
  characters: [],
  loading: false,
  error: null,

  fetchCharacters: async () => {
    set({ loading: true, error: null });
    const { data, error } = await supabase
      .from('characters')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) { set({ loading: false, error: error.message }); return; }
    set({ characters: data ?? [], loading: false });
  },

  fetchCampaignCharacters: async (campaignId) => {
    const { data } = await supabase
      .from('characters')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    return data ?? [];
  },

  createCharacter: async (input) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    set({ loading: true, error: null });

    const { data, error } = await supabase
      .from('characters')
      .insert({
        ...input,
        user_id: user.id,
        level: input.level ?? 1,
        campaign_id: input.campaign_id ?? null,
      })
      .select()
      .single();

    if (error) { set({ loading: false, error: error.message }); return null; }
    set(state => ({ characters: [data, ...state.characters], loading: false }));
    return data;
  },

  updateCharacter: async (id, updates) => {
    set({ error: null });
    const { data, error } = await supabase
      .from('characters')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) { set({ error: error.message }); return; }
    set(state => ({ characters: state.characters.map(c => c.id === id ? data : c) }));
  },

  deleteCharacter: async (id) => {
    set({ error: null });
    const { error } = await supabase.from('characters').delete().eq('id', id);
    if (error) { set({ error: error.message }); return; }
    set(state => ({ characters: state.characters.filter(c => c.id !== id) }));
  },

  getCharacter: (id) => get().characters.find(c => c.id === id),
  clearError: () => set({ error: null }),
}));
