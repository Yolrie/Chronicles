// src/services/api.ts

const API_URL = 'http://localhost:3001';

export interface ApiUser {
  id: number;
  email: string;
  password: string;
  username: string;
}

export async function login(email: string, password: string): Promise<ApiUser> {
  const res = await fetch(
    `${API_URL}/users?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`
  );

  if (!res.ok) {
    throw new Error('Erreur serveur');
  }

  const data: ApiUser[] = await res.json();

  if (!data.length) {
    throw new Error('Email ou mot de passe incorrect');
  }

  return data[0];
}

export async function register(email: string, password: string, username: string): Promise<ApiUser> {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username })
  });

  if (!res.ok) {
    throw new Error('Erreur lors de l\'inscription');
  }

  return await res.json();
}

export async function getCharacters(userId: number) {
  const res = await fetch(`${API_URL}/characters?userId=${userId}`);
  if (!res.ok) throw new Error('Erreur chargement personnages');
  return await res.json();
}

export async function createCharacter(userId: number, payload: any) {
  const res = await fetch(`${API_URL}/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, ...payload })
  });
  if (!res.ok) throw new Error('Erreur création personnage');
  return await res.json();
}
