// src/context/CharactersContext.tsx

import React, { createContext, useContext, useState, ReactNode } from 'react';

export type Character = {
  id: number;
  name: string;
  race?: string;
  class?: string;
  level?: number;
  // champs supplémentaires possibles
  // age?: string;
  // alignment?: string;
  // backstory?: string;
  // stats?: { [key: string]: number };
};

type CharactersContextValue = {
  characters: Character[];
  addCharacter: (character: Omit<Character, 'id'>) => void;
  updateCharacter: (id: number, updates: Partial<Character>) => void;
  deleteCharacter: (id: number) => void;
};

const CharactersContext = createContext<CharactersContextValue | undefined>(
  undefined,
);

export const CharactersProvider = ({ children }: { children: ReactNode }) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const addCharacter = (character: Omit<Character, 'id'>) => {
    setCharacters(prev => {
      const newId = prev.length > 0 ? prev[prev.length - 1].id + 1 : 1;
      return [...prev, { ...character, id: newId }];
    });
  };

  const updateCharacter = (id: number, updates: Partial<Character>) => {
    setCharacters(prev =>
      prev.map(c => (c.id === id ? { ...c, ...updates } : c)),
    );
  };

  const deleteCharacter = (id: number) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  const value: CharactersContextValue = {
    characters,
    addCharacter,
    updateCharacter,
    deleteCharacter,
  };

  return (
    <CharactersContext.Provider value={value}>
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharacters = () => {
  const ctx = useContext(CharactersContext);
  if (!ctx) {
    throw new Error('useCharacters must be used within a CharactersProvider');
  }
  return ctx;
};
