import React from 'react';

import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
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
      </Stack.Navigator>

      <Stack.Navigator initialRouteName="Home">
        {<Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Accueil' }}
            />}
      </Stack.Navigator>  

    </NavigationContainer>
  );
};

export default AppNavigator;
