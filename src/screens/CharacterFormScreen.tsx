import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import commonStyles from '../styles/common';

const CharacterFormScreen = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [charClass, setCharClass] = React.useState('');
  const [race, setRace] = React.useState('');


  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Créer un personnage</Text>
        <Text style={commonStyles.subtitle}>
          Cette fonctionnalité est en cours de développement.
        </Text>

        <TextInput
          placeholder="Nom du personnage"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Classe"
          placeholderTextColor="#9ca3af"
          value={charClass}
         onChangeText={setCharClass}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Race"
          placeholderTextColor="#9ca3af"
          value={race}
          onChangeText={setRace}
          style={commonStyles.input}
        />
        
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