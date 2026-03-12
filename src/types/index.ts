// src/types/index.ts

export interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
  role: 'player' | 'game_master' | 'both';
  created_at: string;
  updated_at: string;
}

export interface GameSystem {
  id: string;
  name: string;
  description?: string;
  is_official: boolean;
  template_json?: {
    stats?: string[];
    classes?: string[];
    races?: string[];
    alignments?: string[];
  };
  created_by?: string;
  created_at: string;
}

export interface CharacterStats {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

export interface CharacterData {
  stats?: CharacterStats;
  hp_max?: number;
  hp_current?: number;
  ac?: number;
  initiative?: number;
  speed?: number;
  proficiency_bonus?: number;
  alignment?: string;
  backstory?: string;
  notes?: string;
  traits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  equipment?: string;
  gold?: number;
  xp?: number;
  age?: number;
  height?: string;
  weight?: string;
  eyes?: string;
  hair?: string;
  skin?: string;
}

export interface Character {
  id: string;
  user_id: string;
  game_system_id?: string;
  campaign_id?: string;
  name: string;
  race?: string;
  class?: string;
  background?: string;
  level: number;
  data_json?: CharacterData;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  game_master_id: string;
  game_system_id?: string;
  name: string;
  description?: string;
  custom_form_json?: Record<string, unknown>;
  rules_json?: Record<string, unknown>;
  invite_code: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  game_master?: Profile;
  players_count?: number;
  my_role?: 'game_master' | 'player';
}

export interface CampaignPlayer {
  id: string;
  campaign_id: string;
  player_id: string;
  character_id?: string;
  joined_at: string;
  player?: Profile;
  character?: Character;
}

export interface SessionLog {
  id: string;
  campaign_id: string;
  character_id: string;
  player_id: string;
  session_date: string;
  xp_gained: number;
  gold_changed: number;
  items_gained?: string[];
  items_lost?: string[];
  hp_current?: number;
  spells_used?: string[];
  notes?: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewed_by?: string;
  reviewed_at?: string;
  created_at: string;
  campaign?: Campaign;
  character?: Character;
}
