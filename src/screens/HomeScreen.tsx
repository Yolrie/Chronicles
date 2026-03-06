// HomeScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params;

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Mes Personnages</Text>
        <Text style={commonStyles.subtitle}>
          Bienvenue sur l’écran d’accueil { username }
        </Text>

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('CharacterForm');
            }}
            title="Créer un personnage"
          />
        </View>
        
        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Login');
            }}
            title="Retour à l'écran de connexion"
          />
        </View>

      </View>
    </View>
  );
};

export default HomeScreen;
