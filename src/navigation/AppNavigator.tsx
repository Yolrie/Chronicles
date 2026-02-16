// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../contexts/AuthContext';

// Écrans d'authentification
import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';

// Écrans de personnages
import CharacterListScreen from '../screens/character/CharacterListScreen';

type AuthStackParamList = {
  Login: undefined;
  Register: undefined;
};

type MainStackParamList = {
  CharacterList: undefined;
  CharacterCreate: undefined;
  CharacterDetail: { characterId: string };
};

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const MainStack = createNativeStackNavigator<MainStackParamList>();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function MainNavigator() {
  return (
    <MainStack.Navigator>
      <MainStack.Screen 
        name="CharacterList" 
        component={CharacterListScreen}
        options={{ 
          title: 'Mes Personnages',
          headerShown: false // On gère le header manuellement dans l'écran
        }}
      />
      {/* On ajoutera CharacterCreate et CharacterDetail après */}
    </MainStack.Navigator>
  );
}

export default function AppNavigator() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return null;
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
