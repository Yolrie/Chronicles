// src/stores/campaignsStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Campaign, CampaignPlayer, SessionLog } from '../types';

function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

interface CampaignsState {
  campaigns: Campaign[];
  activeCampaign: Campaign | null;
  campaignPlayers: CampaignPlayer[];
  sessionLogs: SessionLog[];
  loading: boolean;
  error: string | null;

  fetchCampaigns: () => Promise<void>;
  createCampaign: (name: string, description?: string, gameSystemId?: string) => Promise<Campaign | null>;
  joinCampaign: (inviteCode: string, characterId?: string) => Promise<'ok' | 'not_found' | 'already' | 'error'>;
  leaveCampaign: (campaignId: string) => Promise<void>;
  deleteCampaign: (campaignId: string) => Promise<void>;
  fetchCampaignPlayers: (campaignId: string) => Promise<void>;
  fetchSessionLogs: (campaignId: string) => Promise<void>;
  createSessionLog: (log: Omit<SessionLog, 'id' | 'created_at' | 'status' | 'reviewed_by' | 'reviewed_at'>) => Promise<SessionLog | null>;
  approveSessionLog: (logId: string) => Promise<void>;
  rejectSessionLog: (logId: string) => Promise<void>;
  setActiveCampaign: (campaign: Campaign | null) => void;
  clearError: () => void;
}

export const useCampaignsStore = create<CampaignsState>((set, get) => ({
  campaigns: [],
  activeCampaign: null,
  campaignPlayers: [],
  sessionLogs: [],
  loading: false,
  error: null,

  fetchCampaigns: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    set({ loading: true, error: null });

    // Campaigns where I'm the GM
    const { data: gmCampaigns } = await supabase
      .from('campaigns')
      .select('*, game_master:profiles!campaigns_game_master_id_fkey(id,username,avatar_url)')
      .eq('game_master_id', user.id)
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    // Campaigns where I'm a player
    const { data: playerEntries } = await supabase
      .from('campaign_players')
      .select('campaign_id')
      .eq('player_id', user.id);

    let playerCampaigns: Campaign[] = [];
    if (playerEntries && playerEntries.length > 0) {
      const ids = playerEntries.map(e => e.campaign_id);
      const { data } = await supabase
        .from('campaigns')
        .select('*, game_master:profiles!campaigns_game_master_id_fkey(id,username,avatar_url)')
        .in('id', ids)
        .neq('game_master_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false });
      playerCampaigns = (data ?? []).map(c => ({ ...c, my_role: 'player' as const }));
    }

    const allGm = (gmCampaigns ?? []).map(c => ({ ...c, my_role: 'game_master' as const }));
    set({ campaigns: [...allGm, ...playerCampaigns], loading: false });
  },

  createCampaign: async (name, description, gameSystemId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;
    set({ error: null });

    let code = randomCode();
    // Ensure uniqueness
    const { data: existing } = await supabase
      .from('campaigns').select('id').eq('invite_code', code).maybeSingle();
    if (existing) code = randomCode() + Math.floor(Math.random() * 9);

    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        name,
        description,
        game_master_id: user.id,
        game_system_id: gameSystemId ?? null,
        invite_code: code,
        is_active: true,
      })
      .select()
      .single();
    if (error) {
      set({ error: error.message });
      return null;
    }
    const campaign = { ...data, my_role: 'game_master' as const };
    set(state => ({ campaigns: [campaign, ...state.campaigns] }));
    return campaign;
  },

  joinCampaign: async (inviteCode, characterId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'error';

    const { data: campaign } = await supabase
      .from('campaigns')
      .select('id,game_master_id')
      .eq('invite_code', inviteCode.toUpperCase().trim())
      .eq('is_active', true)
      .maybeSingle();

    if (!campaign) return 'not_found';
    if (campaign.game_master_id === user.id) return 'already';

    const { data: existing } = await supabase
      .from('campaign_players')
      .select('id')
      .eq('campaign_id', campaign.id)
      .eq('player_id', user.id)
      .maybeSingle();

    if (existing) return 'already';

    const { error } = await supabase.from('campaign_players').insert({
      campaign_id: campaign.id,
      player_id: user.id,
      character_id: characterId ?? null,
    });
    if (error) return 'error';

    await get().fetchCampaigns();
    return 'ok';
  },

  leaveCampaign: async (campaignId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('campaign_players')
      .delete()
      .eq('campaign_id', campaignId)
      .eq('player_id', user.id);
    set(state => ({ campaigns: state.campaigns.filter(c => c.id !== campaignId) }));
  },

  deleteCampaign: async (campaignId) => {
    await supabase.from('campaigns').update({ is_active: false }).eq('id', campaignId);
    set(state => ({ campaigns: state.campaigns.filter(c => c.id !== campaignId) }));
  },

  fetchCampaignPlayers: async (campaignId) => {
    const { data } = await supabase
      .from('campaign_players')
      .select('*, player:profiles!campaign_players_player_id_fkey(id,username,avatar_url), character:characters(id,name,race,class,level)')
      .eq('campaign_id', campaignId);
    set({ campaignPlayers: data ?? [] });
  },

  fetchSessionLogs: async (campaignId) => {
    const { data } = await supabase
      .from('session_logs')
      .select('*, character:characters(id,name,race,class,level)')
      .eq('campaign_id', campaignId)
      .order('session_date', { ascending: false });
    set({ sessionLogs: data ?? [] });
  },

  createSessionLog: async (log) => {
    const { data, error } = await supabase
      .from('session_logs')
      .insert({ ...log, status: 'pending' })
      .select()
      .single();
    if (error) {
      set({ error: error.message });
      return null;
    }
    set(state => ({ sessionLogs: [data, ...state.sessionLogs] }));
    return data;
  },

  approveSessionLog: async (logId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('session_logs')
      .update({ status: 'approved', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', logId);
    set(state => ({
      sessionLogs: state.sessionLogs.map(l => l.id === logId ? { ...l, status: 'approved' } : l),
    }));
  },

  rejectSessionLog: async (logId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('session_logs')
      .update({ status: 'rejected', reviewed_by: user.id, reviewed_at: new Date().toISOString() })
      .eq('id', logId);
    set(state => ({
      sessionLogs: state.sessionLogs.map(l => l.id === logId ? { ...l, status: 'rejected' } : l),
    }));
  },

  setActiveCampaign: (campaign) => set({ activeCampaign: campaign }),

  clearError: () => set({ error: null }),
}));
