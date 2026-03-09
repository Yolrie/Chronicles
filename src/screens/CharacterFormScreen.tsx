import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import commonStyles from '../styles/common';

const CharacterFormScreen = ({ navigation }) => {
  const [name, setName] = React.useState('');
  const [charClass, setCharClass] = React.useState('');
  const [race, setRace] = React.useState('');

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a character name.');
      return;
    }

    const newCharacter = {
      id: Date.now(),
      name: name.trim(),
      class: charClass.trim(),
      race: race.trim(),
    };

    console.log('New character:', newCharacter);

    Alert.alert(
      'Character created',
      'Your character has been created (not yet linked to the Home list).',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.navigate('Home');
          },
        },
      ]
    );
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>Créer un personnage</Text>
        <Text style={commonStyles.subtitle}>
          Fill in your character&apos;s basic information. Saving to the Home list is not implemented yet.
        </Text>

        <Text style={commonStyles.sectionHeader}>Identité</Text>

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
            onPress={handleSave}
            title="Enregistrer (temporaire)"
          />

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
};

export default CharacterFormScreen;
