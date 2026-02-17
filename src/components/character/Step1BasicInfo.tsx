// src/components/character/Step1BasicInfo.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Alert,
  TouchableOpacity 
} from 'react-native';
import { CharacterFormData, RACES, CLASSES, BACKGROUNDS } from '../../types/character.types';
import Input from '../common/Input';
import Button from '../common/Button';

interface Props {
  data: CharacterFormData;
  onUpdate: (updates: Partial<CharacterFormData>) => void;
  onNext: () => void;
  onCancel: () => void;
}

export default function Step1BasicInfo({ data, onUpdate, onNext, onCancel }: Props) {
  const [name, setName] = useState(data.name);
  const [selectedRace, setSelectedRace] = useState(data.race);
  const [selectedClass, setSelectedClass] = useState(data.class);
  const [selectedBackground, setSelectedBackground] = useState(data.background);

  function handleNext() {
    // Validation
    if (!name.trim()) {
      Alert.alert('Erreur', 'Le nom est obligatoire');
      return;
    }
    if (!selectedRace) {
      Alert.alert('Erreur', 'Sélectionnez une race');
      return;
    }
    if (!selectedClass) {
      Alert.alert('Erreur', 'Sélectionnez une classe');
      return;
    }
    if (!selectedBackground) {
      Alert.alert('Erreur', 'Sélectionnez un historique');
      return;
    }

    // Sauvegarde les données
    onUpdate({
      name: name.trim(),
      race: selectedRace,
      class: selectedClass,
      background: selectedBackground,
    });

    // Passe à l'étape suivante
    onNext();
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Informations de base</Text>

        {/* Nom */}
        <Input
          label="Nom du personnage *"
          value={name}
          onChangeText={setName}
          placeholder="Aragorn"
        />

        {/* Race */}
        <View style={styles.field}>
          <Text style={styles.label}>Race *</Text>
          <View style={styles.optionsGrid}>
            {RACES.map((race) => (
              <TouchableOpacity
                key={race}
                style={[
                  styles.optionButton,
                  selectedRace === race && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedRace(race)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedRace === race && styles.optionTextSelected,
                  ]}
                >
                  {race}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Classe */}
        <View style={styles.field}>
          <Text style={styles.label}>Classe *</Text>
          <View style={styles.optionsGrid}>
            {CLASSES.map((cls) => (
              <TouchableOpacity
                key={cls}
                style={[
                  styles.optionButton,
                  selectedClass === cls && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedClass(cls)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedClass === cls && styles.optionTextSelected,
                  ]}
                >
                  {cls}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Historique */}
        <View style={styles.field}>
          <Text style={styles.label}>Historique *</Text>
          <View style={styles.optionsGrid}>
            {BACKGROUNDS.map((bg) => (
              <TouchableOpacity
                key={bg}
                style={[
                  styles.optionButton,
                  selectedBackground === bg && styles.optionButtonSelected,
                ]}
                onPress={() => setSelectedBackground(bg)}
              >
                <Text
                  style={[
                    styles.optionText,
                    selectedBackground === bg && styles.optionTextSelected,
                  ]}
                >
                  {bg}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Boutons */}
        <View style={styles.buttons}>
          <View style={styles.buttonHalf}>
            <Button texte="Annuler" onPress={onCancel} couleur="#999" />
          </View>
          <View style={styles.buttonHalf}>
            <Button texte="Suivant" onPress={handleNext} couleur="#007AFF" />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  field: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: 'white',
  },
  optionButtonSelected: {
    borderColor: '#007AFF',
    backgroundColor: '#E3F2FD',
  },
  optionText: {
    fontSize: 14,
    color: '#666',
  },
  optionTextSelected: {
    color: '#007AFF',
    fontWeight: '600',
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 30,
  },
  buttonHalf: {
    flex: 1,
  },
});
