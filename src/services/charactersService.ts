// src/services/charactersService.ts

import AsyncStorage from '@react-native-async-storage/async-storage'; // quand tu seras prêt

import type { Character } from '../context/CharactersContext';

const STORAGE_KEY = 'characters_v1';

export async function loadCharacters(): Promise<Character[]> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as Character[];
  } catch {
    return [];
  }
}

export async function saveCharacters(chars: Character[]): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(chars));
  } catch {
    // pour la v1, on peut juste ignorer ou logger
  }
}
