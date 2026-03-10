// src/screens/CharacterFormScreen.tsx

import React, { useLayoutEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useCharacters } from '../context/CharactersContext';
import { commonStyles } from '../styles/common';

type Props = NativeStackScreenProps<RootStackParamList, 'CharacterForm'>;

const CharacterFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { characterId } = route.params || {};
  const { characters, addCharacter, updateCharacter, deleteCharacter } =
    useCharacters();

  const existingCharacter = useMemo(
    () => characters.find(c => c.id === characterId),
    [characters, characterId],
  );

  const [name, setName] = useState(existingCharacter?.name ?? '');
  const [race, setRace] = useState(existingCharacter?.race ?? '');
  const [charClass, setCharClass] = useState(existingCharacter?.class ?? '');
  const [level, setLevel] = useState(
    existingCharacter?.level?.toString() ?? '1',
  );

  const isEditMode = !!existingCharacter;

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditMode ? 'Edit character' : 'New character',
    });
  }, [navigation, isEditMode]);

  function handleSave() {
    if (!name.trim()) {
      Alert.alert('Missing name', 'Please enter a character name.');
      return;
    }

    const payload = {
      name: name.trim(),
      race: race.trim() || undefined,
      class: charClass.trim() || undefined,
      level: Number(level) || 1,
    };

    if (isEditMode && existingCharacter) {
      updateCharacter(existingCharacter.id, payload);
    } else {
      addCharacter(payload);
    }

    navigation.goBack();
  }

  function confirmDelete() {
    if (!existingCharacter) return;
    Alert.alert(
      'Delete character',
      `Are you sure you want to delete “${existingCharacter.name}”?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            deleteCharacter(existingCharacter.id);
            navigation.goBack();
          },
        },
      ],
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: '#0b0806' }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={commonStyles.screen}>
          <View style={commonStyles.card}>
            <Text style={commonStyles.headerTitle}>
              {isEditMode ? 'Character sheet' : 'Forge a new hero'}
            </Text>
            <Text style={commonStyles.headerSubtitle}>
              Name, race, class and level — enough for a first draft.
            </Text>

            {/* Name */}
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Character name</Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Arthémis Valdor..."
                placeholderTextColor="#6a5a40"
                style={commonStyles.input}
              />
            </View>

            {/* Race */}
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Race</Text>
              <TextInput
                value={race}
                onChangeText={setRace}
                placeholder="Human, Elf, Dwarf..."
                placeholderTextColor="#6a5a40"
                style={commonStyles.input}
              />
            </View>

            {/* Class */}
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Class</Text>
              <TextInput
                value={charClass}
                onChangeText={setCharClass}
                placeholder="Warrior, Mage, Rogue..."
                placeholderTextColor="#6a5a40"
                style={commonStyles.input}
              />
            </View>

            {/* Level */}
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Level</Text>
              <TextInput
                value={level}
                onChangeText={setLevel}
                placeholder="1"
                keyboardType="number-pad"
                placeholderTextColor="#6a5a40"
                style={commonStyles.input}
              />
            </View>

            {/* Actions */}
            <View style={{ marginTop: 12, gap: 8 }}>
              <TouchableOpacity
                style={commonStyles.primaryCta}
                onPress={handleSave}
              >
                <Text style={commonStyles.primaryCtaText}>
                  {isEditMode ? 'Save changes' : 'Create character'}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={commonStyles.ghostButton}
                onPress={() => navigation.goBack()}
              >
                <Text style={commonStyles.ghostButtonText}>Cancel</Text>
              </TouchableOpacity>

              {isEditMode && (
                <TouchableOpacity
                  style={commonStyles.dangerButton}
                  onPress={confirmDelete}
                >
                  <Text style={commonStyles.dangerButtonText}>
                    Delete character
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CharacterFormScreen;
