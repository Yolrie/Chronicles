// App.tsx

import React from 'react';
import { ThemeProvider } from './src/contexts/ThemeContext';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    // Le ThemeProvider enveloppe toute l'app
    // Tous les composants enfants peuvent accéder au theme via useTheme()
    <ThemeProvider>
      <HomeScreen />
    </ThemeProvider>
  );
}
