import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import commonStyles from '../styles/common';

const CharacterFormScreen = ({ navigation }) => {
  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Créer un personnage</Text>
        <Text style={commonStyles.subtitle}>
          Cette fonctionnalité est en cours de développement.
        </Text>

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Home');
            }}
            title="Retour à l'écran d'accueil"
          />
        </View>
        
      </View>
    </View>
  );
}

export default CharacterFormScreen;