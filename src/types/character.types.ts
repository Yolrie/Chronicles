// src/types/character.types.ts

// Type principal du personnage
export interface Character {
  id?: string; // Optionnel car généré par Supabase
  user_id: string;
  game_system_id?: string;
  
  // Infos de base
  name: string;
  race: string;
  class: string;
  background: string;
  level: number;
  
  // Caractéristiques
  abilities: Abilities;
  
  // Compétences
  skills: string[];
  
  // Équipement
  equipment: Equipment;
  
  // Personnalité
  personality: Personality;
  
  // Métadonnées
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

// Caractéristiques (stats)
export interface Abilities {
  strength: number;
  dexterity: number;
  constitution: number;
  intelligence: number;
  wisdom: number;
  charisma: number;
}

// Équipement
export interface Equipment {
  armor: string;
  weapons: string[];
  gear: string[];
  gold: number;
}

// Personnalité
export interface Personality {
  traits: string;
  ideals: string;
  bonds: string;
  flaws: string;
}

// Données pour la création (formulaire)
export interface CharacterFormData {
  name: string;
  race: string;
  class: string;
  background: string;
  level: number;
  abilities: Abilities;
  skills: string[];
  equipment: Equipment;
  personality: Personality;
}

// Listes de choix D&D 5e SRD
export const RACES = [
  'Humain',
  'Elfe',
  'Nain',
  'Halfelin',
  'Demi-Elfe',
  'Demi-Orque',
  'Tieffelin',
  'Gnome',
  'Drakéide',
];

export const CLASSES = [
  'Barbare',
  'Barde',
  'Clerc',
  'Druide',
  'Guerrier',
  'Moine',
  'Paladin',
  'Rôdeur',
  'Roublard',
  'Ensorceleur',
  'Occultiste',
  'Magicien',
];

export const BACKGROUNDS = [
  'Acolyte',
  'Artisan de guilde',
  'Charlatan',
  'Criminel',
  'Enfant des rues',
  'Ermite',
  'Héros du peuple',
  'Noble',
  'Sage',
  'Sauvageon',
  'Soldat',
];

export const SKILLS = [
  'Acrobaties',
  'Arcanes',
  'Athlétisme',
  'Discrétion',
  'Dressage',
  'Escamotage',
  'Histoire',
  'Intimidation',
  'Investigation',
  'Médecine',
  'Nature',
  'Perception',
  'Perspicacité',
  'Persuasion',
  'Religion',
  'Représentation',
  'Survie',
  'Tromperie',
];
