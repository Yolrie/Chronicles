// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Écrans
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';

// Type pour les routes d'authentification
type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

// Type pour les routes principales
type MainStackParamList = {
  Home: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

// Navigation pour les utilisateurs NON connectés
function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

// Navigation pour les utilisateurs connectés
function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="Home" 
        component={HomeScreen}
        options={{ title: 'Mes Personnages' }}
      />
    </MainStack.Navigator>
  );
}

// Navigation principale : affiche Auth ou Main selon l'état de connexion
export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  // Pendant le chargement, affiche rien (ou un loader)
  if (isLoading) {
    return null; // Tu peux mettre un écran de chargement ici
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
