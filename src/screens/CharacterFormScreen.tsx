import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import commonStyles from '../styles/common';
import { useCharacters } from '../context/CharactersContext';

const CharacterFormScreen = ({ navigation, route }) => {
  const [name, setName] = React.useState('');
  const [charClass, setCharClass] = React.useState('');
  const [race, setRace] = React.useState('');

  const characterId = route?.params?.characterId;

  const { characters, addCharacter, updateCharacter } = useCharacters();

  React.useEffect(() => {
    if (!characterId) return;

    const existing = characters.find(c => c.id === characterId);
    if (!existing) return;

    setName(existing.name);
    setCharClass(existing.class);
    setRace(existing.race);
  }, [characterId, characters]);

  const handleSave = () => {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a character name.');
      return;
    }

    const baseCharacter = {
      id: characterId ?? Date.now(),
      name: name.trim(),
      class: charClass.trim(),
      race: race.trim(),
    };

    if (characterId) {
      updateCharacter(baseCharacter);
    } else {
      addCharacter(baseCharacter);
    }

    Alert.alert(
      characterId ? 'Character updated' : 'Character created',
      characterId
        ? 'Your character has been updated.'
        : 'Your character has been added to the list.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>
          {characterId ? 'Modifier le personnage' : 'Créer un personnage'}
        </Text>
        <Text style={commonStyles.subtitle}>
          Fill in your character&apos;s basic information.
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
            title={characterId ? 'Mettre à jour' : 'Enregistrer'}
          />

          <Button
            onPress={() => {
              navigation.goBack();
            }}
            title="Retour à l'écran d'accueil"
          />
        </View>
      </View>
    </View>
  );
};

export default CharacterFormScreen;
