// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CharacterFormScreen from '../screens/CharacterFormScreen';
import GuildsScreen from '../screens/GuildsScreen';

import { CharactersProvider } from '../context/CharactersContext';
import { GuildsProvider } from '../context/GuildsContext'; // à créer

export type RootStackParamList = {
  Login: undefined;
  Home: {
    username: string;
    email: string;
    password: string;
  };
  CharacterForm: {
    characterId?: number;
  } | undefined;
  Guilds: undefined; // écran des confréries
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <CharactersProvider>
      <GuildsProvider>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
              headerStyle: { backgroundColor: '#020617' },
              headerTintColor: '#e5e7eb',
              headerTitleStyle: { fontWeight: '600' },
            }}
          >
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: 'Sign in' }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ title: 'Characters' }}
            />
            <Stack.Screen
              name="CharacterForm"
              component={CharacterFormScreen}
              options={{ title: 'Character sheet' }}
            />
            <Stack.Screen
              name="Guilds"
              component={GuildsScreen}
              options={{ title: 'Guilds' }}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </GuildsProvider>
    </CharactersProvider>
  );
};

export default AppNavigator;
