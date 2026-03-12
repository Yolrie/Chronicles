# Chronicles — Compagnon JDR

> Application mobile React Native / Expo pour la gestion de campagnes de jeu de rôle sur table.

---

## Aperçu

**Chronicles** est un compagnon numérique pour joueurs et maîtres du jeu (MJ).
Elle permet de créer et gérer des personnages, coordonner des campagnes, soumettre
des journaux de session et suivre la progression de votre groupe — le tout synchronisé
en temps réel via Supabase.

---

## Fonctionnalités actuelles

| Fonctionnalité | Joueur | MJ |
|---|:---:|:---:|
| Inscription / Connexion sécurisée | ✓ | ✓ |
| Profil utilisateur (pseudo, rôle) | ✓ | ✓ |
| Création de personnage lié à une campagne | ✓ | — |
| Fiche de personnage complète (stats D&D 5e) | ✓ | ✓ |
| Création de campagne avec code d'invitation | — | ✓ |
| Règles de campagne (races, classes, méthode de stats, notes MJ) | — | ✓ |
| Rejoindre une campagne via code | ✓ | — |
| Journal de session (soumission) | ✓ | — |
| Approbation / rejet des journaux | — | ✓ |
| Traduction FR / EN | ✓ | ✓ |
| Aperçu des fonctionnalités Premium à venir | ✓ | ✓ |

---

## Stack technique

| Couche | Technologie |
|---|---|
| Framework mobile | React Native 0.81 + Expo SDK 54 |
| Navigation | React Navigation 7 (native-stack + bottom-tabs) |
| État global | Zustand 5 |
| Backend / Auth / DB | Supabase (PostgreSQL + RLS + Auth) |
| Persistance locale | AsyncStorage |
| Internationalisation | Store Zustand custom (FR par défaut) |
| Tests | Jest + jest-expo + Testing Library React Native |
| Typage | TypeScript 5.9 |

---

## Architecture du projet

```
src/
├── components/
│   └── ImagePlaceholder.tsx   # Zone réservée pour images futures
├── i18n/
│   ├── translations.ts        # Textes FR + EN
│   └── index.ts               # Store Zustand + AsyncStorage
├── lib/
│   └── supabase.ts
├── navigation/
│   └── AppNavigator.tsx       # Navigateurs (tabs, stacks, modal Premium)
├── screens/
│   ├── LoginScreen.tsx
│   ├── HomeScreen.tsx
│   ├── CharactersScreen.tsx
│   ├── CharacterFormScreen.tsx
│   ├── CampaignsScreen.tsx
│   ├── CampaignDetailScreen.tsx
│   ├── CampaignFormScreen.tsx
│   ├── SessionLogFormScreen.tsx
│   ├── ProfileScreen.tsx
│   └── PremiumScreen.tsx      # Aperçu des fonctionnalités à venir
├── stores/
│   ├── authStore.ts
│   ├── campaignsStore.ts
│   └── charactersStore.ts
├── styles/
│   └── common.ts              # Palette "Grimoire & Parchemin", styles partagés
└── types/
    └── index.ts               # Interfaces TypeScript globales

__tests__/                     # Suite de tests (Cycle en V)
├── unit/                      # Niveau 4 — fonctions pures, types, i18n
├── integration/               # Niveau 3 — stores + Supabase mocké
└── components/                # Niveau 3 — écrans et composants UI
```

---

## Base de données (Supabase)

### Tables principales

| Table | Description |
|---|---|
| `profiles` | Profils utilisateurs — créé via trigger auth |
| `game_systems` | Systèmes de jeu (D&D 5e, Pathfinder 2e…) |
| `campaigns` | Campagnes avec code d'invitation et `rules_json` |
| `campaign_players` | Relation joueur ↔ campagne |
| `characters` | Fiches avec `data_json` (stats JSONB) et `campaign_id` |
| `session_logs` | Journaux (pending / approved / rejected) |

### Sécurité (RLS)

- Chaque table est protégée par des politiques Row Level Security
- La récursion infinie entre `campaigns` et `campaign_players` est résolue
  via des fonctions `SECURITY DEFINER` (`is_campaign_gm`, `is_campaign_player`)
- Aucune credential n'est transmise dans les paramètres de navigation

---

## Installation

### Prérequis

- Node.js 20+
- Expo CLI : `npm install -g expo-cli`

### Étapes

```bash
git clone <repo>
cd Chronicles
npm install
```

Créer `.env` à la racine :

```env
EXPO_PUBLIC_SUPABASE_URL=https://zwavgbeaqtbimsdmpxxd.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=<clé-anon-publique>
```

```bash
npm start        # Expo Go
npm run android  # Android
npm run ios      # iOS
```

---

## Tests — Cycle en V

```
Besoins utilisateurs  ←→  Tests d'acceptation  (E2E Detox — à venir)
Conception système    ←→  Tests système         (à venir)
Architecture          ←→  Tests d'intégration   __tests__/integration/
Conception détaillée  ←→  Tests de composants   __tests__/components/
Code                  ←→  Tests unitaires        __tests__/unit/
```

```bash
npm test               # Tous les tests
npm run test:watch     # Mode watch (développement)
npm run test:coverage  # Rapport de couverture HTML
```

Voir [`__tests__/README.md`](./__tests__/README.md) pour le détail.

---

## Emplacements d'images

Le composant `ImagePlaceholder` réserve les zones visuelles en attendant les assets :

| Écran | Description | Dimensions |
|---|---|---|
| HomeScreen | Bannière d'accueil | 100% × 110px |
| PremiumScreen | Illustration principale | 100% × 160px |
| PremiumScreen | Illustration pied de page | 100% × 100px |
| ProfileScreen | Photo de profil | 80 × 80px (rond) |

Pour injecter une image :

```tsx
<ImagePlaceholder uri="https://cdn.example.com/banner.jpg" height={110} />
```

---

## Compatibilité

| Plateforme | Statut |
|---|---|
| Android 10+ | ✓ Testé |
| Android 15 / MagicOS 9 (2652×1200) | ✓ Insets adaptés |
| iOS 16+ | ✓ |

---

## Fonctionnalités Premium (à venir)

L'écran **Premium** de l'app liste les fonctionnalités en développement.
Aucune date ni tarif communiqués à ce stade.

---

## Licence

Projet privé — tous droits réservés.
