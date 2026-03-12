// src/stores/friendsStore.ts

import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Profile } from '../types';

export interface FriendEntry {
  id:        string;
  friend:    Profile;
  status:    'pending' | 'accepted';
  direction: 'sent' | 'received';
}

interface FriendsState {
  friends:         FriendEntry[];
  pendingReceived: FriendEntry[];
  pendingSent:     FriendEntry[];
  searchResults:   Profile[];
  loading:         boolean;
  error:           string | null;

  fetchFriends:       () => Promise<void>;
  sendFriendRequest:  (username: string) => Promise<'ok' | 'not_found' | 'already' | 'error'>;
  acceptFriendRequest:(friendshipId: string) => Promise<void>;
  declineFriendRequest:(friendshipId: string) => Promise<void>;
  removeFriend:       (friendshipId: string) => Promise<void>;
  searchUsers:        (q: string) => Promise<void>;
  clearSearch:        () => void;
}

export const useFriendsStore = create<FriendsState>((set) => ({
  friends:         [],
  pendingReceived: [],
  pendingSent:     [],
  searchResults:   [],
  loading:         false,
  error:           null,

  fetchFriends: async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    set({ loading: true });

    const { data } = await supabase
      .from('friendships')
      .select(`
        id, status,
        requester:profiles!friendships_requester_id_fkey(id,username,avatar_url,role,created_at,updated_at),
        addressee:profiles!friendships_addressee_id_fkey(id,username,avatar_url,role,created_at,updated_at)
      `)
      .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

    const entries: FriendEntry[] = (data ?? []).map((row: any) => {
      const isSender = row.requester?.id === user.id;
      const friend   = isSender ? row.addressee : row.requester;
      return {
        id:        row.id,
        friend:    friend as Profile,
        status:    row.status,
        direction: isSender ? 'sent' : 'received',
      };
    });

    set({
      friends:         entries.filter(e => e.status === 'accepted'),
      pendingReceived: entries.filter(e => e.status === 'pending' && e.direction === 'received'),
      pendingSent:     entries.filter(e => e.status === 'pending' && e.direction === 'sent'),
      loading:         false,
    });
  },

  sendFriendRequest: async (username) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return 'error';

    const { data: target } = await supabase
      .from('profiles').select('id').eq('username', username.trim()).maybeSingle();
    if (!target) return 'not_found';
    if (target.id === user.id) return 'error';

    const { data: existing } = await supabase
      .from('friendships')
      .select('id')
      .or(
        `and(requester_id.eq.${user.id},addressee_id.eq.${target.id}),and(requester_id.eq.${target.id},addressee_id.eq.${user.id})`
      )
      .maybeSingle();
    if (existing) return 'already';

    const { error } = await supabase.from('friendships').insert({
      requester_id: user.id,
      addressee_id: target.id,
    });
    if (error) return 'error';
    return 'ok';
  },

  acceptFriendRequest: async (friendshipId) => {
    await supabase.from('friendships')
      .update({ status: 'accepted' }).eq('id', friendshipId);
    set(state => {
      const entry = state.pendingReceived.find(e => e.id === friendshipId);
      if (!entry) return {};
      return {
        pendingReceived: state.pendingReceived.filter(e => e.id !== friendshipId),
        friends: [...state.friends, { ...entry, status: 'accepted' as const }],
      };
    });
  },

  declineFriendRequest: async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    set(state => ({
      pendingReceived: state.pendingReceived.filter(e => e.id !== friendshipId),
    }));
  },

  removeFriend: async (friendshipId) => {
    await supabase.from('friendships').delete().eq('id', friendshipId);
    set(state => ({
      friends:     state.friends.filter(e => e.id !== friendshipId),
      pendingSent: state.pendingSent.filter(e => e.id !== friendshipId),
    }));
  },

  searchUsers: async (q) => {
    if (q.length < 2) { set({ searchResults: [] }); return; }
    const { data } = await supabase
      .from('profiles')
      .select('id,username,avatar_url,role,created_at,updated_at')
      .ilike('username', `%${q}%`)
      .limit(10);
    set({ searchResults: (data as Profile[]) ?? [] });
  },

  clearSearch: () => set({ searchResults: [] }),
}));
