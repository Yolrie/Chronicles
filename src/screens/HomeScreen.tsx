// HomeScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params || {};

  const [characters, setCharacters] = React.useState([]);

  return (
    <View style={commonStyles.screen}>
      <View className={commonStyles.card}>
        <Text style={commonStyles.title}>Mes personnages</Text>

        {username && (
          <Text style={commonStyles.subtitle}>
            Bienvenue, {username}
          </Text>
        )}

        <Text style={commonStyles.subtitle}>
          Tu as {characters.length} personnage(s) créé(s).
        </Text>

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('CharacterForm');
            }}
            title="Créer un personnage"
          />

          <Button
            onPress={() => {
              navigation.navigate('Login');
            }}
            title="Retour à l’écran de connexion"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
