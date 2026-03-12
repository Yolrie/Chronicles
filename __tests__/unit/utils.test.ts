/**
 * CYCLE EN V — Niveau 4 : Tests unitaires
 * Module testé : fonctions utilitaires pures de l'app
 *
 * Couverture :
 *  - randomCode (génération de code d'invitation)
 *  - parseCsvItems (analyse de liste séparée par virgules)
 *  - statModifier (calcul du modificateur de caractéristique D&D)
 */

// ── Fonctions extraites/répliquées pour test ──────────────────────────────────

/** Génère un code d'invitation aléatoire de 8 caractères (extrait de campaignsStore) */
function randomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/** Analyse une liste CSV (extrait de SessionLogFormScreen) */
function parseCsvItems(raw: string): string[] {
  return raw.split(',').map(s => s.trim()).filter(Boolean);
}

/** Calcule le modificateur D&D d'une caractéristique (extrait de CharacterFormScreen) */
function statModifier(score: number): string {
  const mod = Math.floor((score - 10) / 2);
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// ── Tests ─────────────────────────────────────────────────────────────────────

describe('[UNIT] randomCode', () => {
  it('retourne une chaîne de 8 caractères', () => {
    expect(randomCode()).toHaveLength(8);
  });

  it('ne contient que des caractères autorisés (pas 0, 1, I, O)', () => {
    const code = randomCode();
    expect(code).toMatch(/^[ABCDEFGHJKLMNPQRSTUVWXYZ23456789]+$/);
  });

  it('deux appels successifs donnent des codes différents (probabilité 1 - 1/32^8)', () => {
    const c1 = randomCode();
    const c2 = randomCode();
    // Cette assertion peut échouer une fois sur 10^12 — acceptable
    expect(c1).not.toBe(c2);
  });
});

describe('[UNIT] parseCsvItems', () => {
  it('découpe une liste simple', () => {
    expect(parseCsvItems('épée, bouclier, potion')).toEqual(['épée', 'bouclier', 'potion']);
  });

  it('supprime les entrées vides', () => {
    expect(parseCsvItems('a,,b,')).toEqual(['a', 'b']);
  });

  it('retourne un tableau vide pour une chaîne vide', () => {
    expect(parseCsvItems('')).toEqual([]);
  });

  it('gère une entrée unique sans virgule', () => {
    expect(parseCsvItems('torche')).toEqual(['torche']);
  });

  it('supprime les espaces en début/fin de chaque item', () => {
    expect(parseCsvItems('  arc  ,  flèche  ')).toEqual(['arc', 'flèche']);
  });
});

describe('[UNIT] statModifier D&D', () => {
  const cases: [number, string][] = [
    [1,  '-5'],
    [8,  '-1'],
    [9,  '-1'],
    [10, '+0'],
    [11, '+0'],
    [12, '+1'],
    [15, '+2'],
    [20, '+5'],
    [30, '+10'],
  ];

  test.each(cases)('score %i → modificateur %s', (score, expected) => {
    expect(statModifier(score)).toBe(expected);
  });
});
