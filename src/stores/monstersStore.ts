// src/stores/monstersStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface Adversary {
  id:               string;
  campaign_id:      string;
  created_by:       string;
  name:             string;
  type:             'monster' | 'npc' | 'boss' | 'minion' | 'elite';
  challenge_rating?: string;
  hp_max?:          number;
  ac?:              number;
  speed?:           number;
  description?:     string;
  abilities?:       Record<string, number>;
  actions?:         { name: string; description: string; damage?: string }[];
  loot?:            string;
  is_template:      boolean;
  image_url?:       string;
  status:           'active' | 'defeated' | 'escaped' | 'captured';
  created_at:       string;
  updated_at:       string;
}

interface MonstersState {
  adversaries: Adversary[];
  loading:     boolean;
  error:       string | null;

  fetchAdversaries: (campaignId: string) => Promise<void>;
  createAdversary:  (data: Partial<Adversary> & { campaign_id: string; name: string }) => Promise<Adversary | null>;
  updateAdversary:  (id: string, data: Partial<Adversary>) => Promise<void>;
  deleteAdversary:  (id: string) => Promise<void>;
  setStatus:        (id: string, status: Adversary['status']) => Promise<void>;
}

export const useMonstersStore = create<MonstersState>((set) => ({
  adversaries: [],
  loading:     false,
  error:       null,

  fetchAdversaries: async (campaignId) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from('campaign_adversaries')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    if (error) { set({ loading: false, error: error.message }); return; }
    set({ adversaries: data ?? [], loading: false });
  },

  createAdversary: async (data) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    const { data: created, error } = await supabase
      .from('campaign_adversaries')
      .insert({ ...data, created_by: user.id, status: data.status ?? 'active' })
      .select()
      .single();
    if (error) { set({ error: error.message }); return null; }
    set(state => ({ adversaries: [created, ...state.adversaries] }));
    return created;
  },

  updateAdversary: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('campaign_adversaries').update(data).eq('id', id).select().single();
    if (error) { set({ error: error.message }); return; }
    set(state => ({ adversaries: state.adversaries.map(a => a.id === id ? updated : a) }));
  },

  deleteAdversary: async (id) => {
    await supabase.from('campaign_adversaries').delete().eq('id', id);
    set(state => ({ adversaries: state.adversaries.filter(a => a.id !== id) }));
  },

  setStatus: async (id, status) => {
    await supabase.from('campaign_adversaries').update({ status }).eq('id', id);
    set(state => ({
      adversaries: state.adversaries.map(a => a.id === id ? { ...a, status } : a),
    }));
  },
}));
