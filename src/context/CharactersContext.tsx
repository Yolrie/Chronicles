// src/context/CharactersContext.tsx

import React, { createContext, useContext, useState } from 'react';

export type Character = {
  id: number;
  name: string;
  class: string;
  race: string;
};

type CharactersContextValue = {
  characters: Character[];
  addCharacter: (character: Character) => void;
  updateCharacter: (character: Character) => void;
  deleteCharacter: (id: number) => void;
};

const CharactersContext = createContext<CharactersContextValue | undefined>(
  undefined,
);

export const CharactersProvider = ({ children }: { children: React.ReactNode }) => {
  const [characters, setCharacters] = useState<Character[]>([]);

  const addCharacter = (character: Character) => {
    setCharacters(prev => {
      const exists = prev.some(c => c.id === character.id);
      if (exists) {
        return prev;
      }
      return [...prev, character];
    });
  };

  const updateCharacter = (character: Character) => {
    setCharacters(prev =>
      prev.map(c => (c.id === character.id ? character : c)),
    );
  };

  const deleteCharacter = (id: number) => {
    setCharacters(prev => prev.filter(c => c.id !== id));
  };

  return (
    <CharactersContext.Provider
      value={{ characters, addCharacter, updateCharacter, deleteCharacter }}
    >
      {children}
    </CharactersContext.Provider>
  );
};

export const useCharacters = () => {
  const context = useContext(CharactersContext);
  if (!context) {
    throw new Error('useCharacters must be used within a CharactersProvider');
  }
  return context;
};
