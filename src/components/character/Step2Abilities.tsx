// src/components/character/Step2Abilities.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { CharacterFormData, Abilities } from '../../types/character.types';
import Button from '../common/Button';

interface Props {
  data: CharacterFormData;
  onUpdate: (updates: Partial<CharacterFormData>) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export default function Step2Abilities({ data, onUpdate, onNext, onPrevious }: Props) {
  const [abilities, setAbilities] = useState<Abilities>(data.abilities);

  // Fonction pour changer une caractéristique
  function updateAbility(key: keyof Abilities, delta: number) {
    const newValue = abilities[key] + delta;
    // Limite entre 3 et 18 (règles D&D)
    if (newValue >= 3 && newValue <= 18) {
      setAbilities({ ...abilities, [key]: newValue });
    }
  }

  function handleNext() {
    onUpdate({ abilities });
    onNext();
  }

  // Calcule le modificateur D&D
  function getModifier(score: number): string {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.sectionTitle}>Caractéristiques</Text>
        <Text style={styles.subtitle}>
          Ajuste les valeurs entre 3 et 18
        </Text>

        {/* Liste des caractéristiques */}
        {(Object.keys(abilities) as Array<keyof Abilities>).map((key) => {
          const labels = {
            strength: 'Force',
            dexterity: 'Dextérité',
            constitution: 'Constitution',
            intelligence: 'Intelligence',
            wisdom: 'Sagesse',
            charisma: 'Charisme',
          };

          return (
            <View key={key} style={styles.abilityRow}>
              <View style={styles.abilityInfo}>
                <Text style={styles.abilityName}>{labels[key]}</Text>
                <Text style={styles.abilityModifier}>
                  {getModifier(abilities[key])}
                </Text>
              </View>

              <View style={styles.abilityControls}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => updateAbility(key, -1)}
                >
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>

                <Text style={styles.abilityValue}>{abilities[key]}</Text>

                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => updateAbility(key, 1)}
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* Boutons navigation */}
        <View style={styles.buttons}>
          <View style={styles.buttonHalf}>
            <Button texte="Précédent" onPress={onPrevious} couleur="#999" />
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
    marginBottom: 8,
    color: '#333',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  abilityRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  abilityInfo: {
    flex: 1,
  },
  abilityName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  abilityModifier: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  abilityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  controlButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButtonText: {
    fontSize: 20,
    color: 'white',
    fontWeight: 'bold',
  },
  abilityValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    minWidth: 40,
    textAlign: 'center',
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
