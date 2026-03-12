// src/stores/badgesStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';

export interface BadgeDefinition {
  id:        string;
  name_fr:   string;
  name_en:   string;
  desc_fr:   string;
  desc_en:   string;
  icon:      string;
  category:  'general' | 'campaign' | 'character' | 'social' | 'milestone';
  is_rare:   boolean;
}

export interface BadgeWithStatus extends BadgeDefinition {
  earned:     boolean;
  awarded_at?: string;
  context_id?: string;
}

interface BadgesState {
  badges:  BadgeWithStatus[];
  loading: boolean;
  fetchBadges:  () => Promise<void>;
  awardBadge:   (badgeId: string, contextId?: string) => Promise<void>;
}

export const useBadgesStore = create<BadgesState>((set) => ({
  badges:  [],
  loading: false,

  fetchBadges: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    set({ loading: true });

    const [{ data: defs }, { data: earned }] = await Promise.all([
      supabase.from('badge_definitions').select('*').order('category'),
      supabase.from('user_badges').select('*').eq('user_id', user.id),
    ]);

    const earnedMap = new Map((earned ?? []).map(b => [b.badge_id, b]));

    const merged: BadgeWithStatus[] = (defs ?? []).map(def => ({
      ...def,
      earned:     earnedMap.has(def.id),
      awarded_at: earnedMap.get(def.id)?.awarded_at,
      context_id: earnedMap.get(def.id)?.context_id,
    }));

    set({ badges: merged, loading: false });
  },

  awardBadge: async (badgeId, contextId) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('user_badges').upsert({
      user_id:    user.id,
      badge_id:   badgeId,
      context_id: contextId ?? null,
      awarded_at: new Date().toISOString(),
    }, { onConflict: 'user_id,badge_id' });

    set(state => ({
      badges: state.badges.map(b =>
        b.id === badgeId
          ? { ...b, earned: true, awarded_at: new Date().toISOString() }
          : b
      ),
    }));
  },
}));
