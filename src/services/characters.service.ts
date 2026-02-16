// src/services/characters.service.ts

import { supabase } from './supabase';
import { Character, CharacterFormData } from '../types/character.types';

// Créer un personnage
export async function createCharacter(
  userId: string,
  formData: CharacterFormData
): Promise<Character> {
  const { data, error } = await supabase
    .from('characters')
    .insert({
      user_id: userId,
      name: formData.name,
      race: formData.race,
      class: formData.class,
      background: formData.background,
      level: formData.level,
      data_json: {
        abilities: formData.abilities,
        skills: formData.skills,
        equipment: formData.equipment,
        personality: formData.personality,
      },
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Récupérer tous les personnages d'un utilisateur
export async function getUserCharacters(userId: string): Promise<Character[]> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data || [];
}

// Récupérer un personnage par ID
export async function getCharacterById(id: string): Promise<Character> {
  const { data, error } = await supabase
    .from('characters')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Mettre à jour un personnage
export async function updateCharacter(
  id: string,
  updates: Partial<Character>
): Promise<Character> {
  const { data, error } = await supabase
    .from('characters')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Supprimer un personnage
export async function deleteCharacter(id: string): Promise<void> {
  const { error } = await supabase
    .from('characters')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
