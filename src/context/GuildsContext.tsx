// src/context/GuildsContext.tsx

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
} from 'react';

export type Guild = {
  id: string;
  name: string;
  code: string;      // ex: SHADOW42
  masterId: string;  // id du maître de la confrérie
  members: string[]; // ids des membres
  pending: string[]; // ids des demandes en attente
};

export type JoinResult = 'ok' | 'error' | 'warn';

type GuildsContextValue = {
  guilds: Guild[];
  createGuild: (name: string, masterId: string) => Guild;
  requestJoin: (code: string, userId: string) => JoinResult;
  // plus tard: approveMember, rejectMember, kickMember, etc.
};

const GuildsContext = createContext<GuildsContextValue | undefined>(
  undefined,
);

export const GuildsProvider = ({ children }: { children: ReactNode }) => {
  const [guilds, setGuilds] = useState<Guild[]>([]);

  const createGuild = (name: string, masterId: string): Guild => {
    const code = generateCode(name);
    const guild: Guild = {
      id: Date.now().toString(),
      name,
      code,
      masterId,
      members: [masterId],
      pending: [],
    };
    setGuilds(prev => [...prev, guild]);
    return guild;
  };

  const requestJoin = (code: string, userId: string): JoinResult => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return 'error';

    const guild = guilds.find(g => g.code === normalized);
    if (!guild) return 'error';

    if (guild.members.includes(userId)) return 'warn';
    if (guild.pending.includes(userId)) return 'warn';

    setGuilds(prev =>
      prev.map(g =>
        g.id === guild.id
          ? { ...g, pending: [...g.pending, userId] }
          : g,
      ),
    );

    return 'ok';
  };

  const value: GuildsContextValue = {
    guilds,
    createGuild,
    requestJoin,
  };

  return (
    <GuildsContext.Provider value={value}>
      {children}
    </GuildsContext.Provider>
  );
};

function generateCode(name: string): string {
  const base = name.replace(/\s+/g, '').slice(0, 4).toUpperCase() || 'GILD';
  const rand = Math.floor(10 + Math.random() * 90);
  return `${base}${rand}`;
}

export const useGuilds = () => {
  const ctx = useContext(GuildsContext);
  if (!ctx) {
    throw new Error('useGuilds must be used within a GuildsProvider');
  }
  return ctx;
};
