import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import CharacterFormScreen from '../screens/CharacterFormScreen';
import CharactersForm from '../form/CharactersForm';

type RootStackParamList = {
  Login: undefined;
  Home: { 
    username : string,
    email: string,
    password: string
   };
  CharacterForm: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator = () => {
  return (
    <NavigationContainer>

      <Stack.Navigator initialRouteName="Login">
        {<Stack.Screen 
            name="Login" 
            component={LoginScreen} 
            options={{ title: 'Connexion'}}
            />}
        {<Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Accueil' }}
            />}
        {<Stack.Screen 
            name="CharacterForm" 
            component={CharacterFormScreen} 
            options={{ title: 'Nouveau personnage' }}
            />}
      </Stack.Navigator>
      
    </NavigationContainer>
  );
};

export default AppNavigator;
