// src/screens/CharacterFormScreen.tsx

import React from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import commonStyles from '../styles/common';
import { useCharacters } from '../context/CharactersContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterForm'>;

const CharacterFormScreen: React.FC<Props> = ({ navigation, route }) => {
  const [name, setName] = React.useState('');
  const [charClass, setCharClass] = React.useState('');
  const [race, setRace] = React.useState('');

  const characterId = route?.params?.characterId;
  const { characters, addCharacter, updateCharacter, deleteCharacter } =
    useCharacters();

  // Pré-remplissage si édition
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

  const handleDelete = () => {
    if (!characterId) return;

    Alert.alert(
      'Delete character',
      'This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCharacter(characterId);
            navigation.goBack();
          },
        },
      ],
    );
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        {/* Badge / contexte */}
        <View style={commonStyles.pill}>
          <Text style={commonStyles.pillText}>
            {characterId ? 'Edit character' : 'New character'}
          </Text>
        </View>

        {/* Titre */}
        <Text style={commonStyles.title}>
          {characterId ? 'Character sheet' : 'Create a character'}
        </Text>
        <Text style={commonStyles.subtitle}>
          Fill in your hero&apos;s basic information. You can extend this sheet later.
        </Text>

        {/* Section identité */}
        <Text style={commonStyles.sectionHeader}>Identity</Text>

        <TextInput
          placeholder="Character name"
          placeholderTextColor="#9ca3af"
          value={name}
          onChangeText={setName}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Class (fighter, wizard, rogue...)"
          placeholderTextColor="#9ca3af"
          value={charClass}
          onChangeText={setCharClass}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Race (human, elf, dwarf...)"
          placeholderTextColor="#9ca3af"
          value={race}
          onChangeText={setRace}
          style={commonStyles.input}
        />

        {/* Actions */}
        <View style={commonStyles.actions}>
          <View style={commonStyles.primaryCta}>
            <Text
              style={commonStyles.primaryCtaText}
              onPress={handleSave}
            >
              {characterId ? 'Save changes' : 'Create character'}
            </Text>
          </View>

          {characterId && (
            <Button
              title="Delete character"
              color="#b91c1c"
              onPress={handleDelete}
            />
          )}

          <Button
            title="Back to characters"
            onPress={() => navigation.goBack()}
          />
        </View>
      </View>
    </View>
  );
};

export default CharacterFormScreen;
