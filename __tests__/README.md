# Tests — Chronicles (Cycle en V)

## Architecture des tests

Les tests suivent la méthodologie **Cycle en V**, où chaque niveau de conception
est associé à un niveau de test symétrique :

```
Besoins utilisateurs  ←→  Tests d'acceptation (E2E — à venir avec Detox)
Conception système    ←→  Tests système (flux complets)
Architecture          ←→  Tests d'intégration   __tests__/integration/
Conception détaillée  ←→  Tests de composants   __tests__/components/
Code                  ←→  Tests unitaires        __tests__/unit/
```

## Structure

```
__tests__/
├── unit/
│   ├── i18n.test.ts          # Système de traduction FR/EN
│   ├── utils.test.ts         # Fonctions pures (randomCode, parseCsv, statMod)
│   └── types.test.ts         # Validation des interfaces TypeScript
├── integration/
│   ├── authStore.test.ts     # Store d'auth + appels Supabase mockés
│   └── campaignsStore.test.ts # Store campagnes + appels Supabase mockés
└── components/
    ├── PremiumScreen.test.tsx # Écran premium (contenu, absence de prix/dates)
    └── ImagePlaceholder.test.tsx # Composant placeholder image
__mocks__/
├── async-storage.ts          # Mock AsyncStorage
└── supabase.ts               # Mock client Supabase
```

## Commandes

```bash
# Tous les tests
npm test

# Mode watch (développement)
npm run test:watch

# Rapport de couverture
npm run test:coverage
```

## Conventions

- Chaque fichier de test documente son niveau dans le cycle en V en en-tête
- Les mocks Supabase permettent des tests rapides sans connexion réseau
- Les tests de composants mockent `useI18n` avec les traductions réelles FR
- Les tests unitaires ne dépendent d'aucun framework React Native
