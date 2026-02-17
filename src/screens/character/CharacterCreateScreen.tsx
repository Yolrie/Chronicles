// src/screens/character/CharacterCreateScreen.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { createCharacter } from '../../services/characters.service';
import { CharacterFormData } from '../../types/character.types';

// Import des étapes (on va les créer après)
import Step1BasicInfo from '../../components/character/Step1BasicInfo';
import Step2Abilities from '../../components/character/Step2Abilities';
// import Step3Personality from '../../components/character/Step3Personality';
//import Step4Equipment from '../../components/character/Step4Equipment';
//import Step5Summary from '../../components/character/Step5Summary';

export default function CharacterCreateScreen({ navigation }: any) {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State du formulaire (toutes les données)
  const [formData, setFormData] = useState<CharacterFormData>({
    name: '',
    race: '',
    class: '',
    background: '',
    level: 1,
    abilities: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10,
    },
    skills: [],
    equipment: {
      armor: '',
      weapons: [],
      gear: [],
      gold: 0,
    },
    personality: {
      traits: '',
      ideals: '',
      bonds: '',
      flaws: '',
    },
  });

  // Fonction pour mettre à jour une partie des données
  function updateFormData(updates: Partial<CharacterFormData>) {
    setFormData({ ...formData, ...updates });
  }

  // Navigation entre les étapes
  function goToNextStep() {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goToPreviousStep() {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  // Sauvegarde finale
  async function handleSubmit() {
    try {
      setIsSubmitting(true);
      
      await createCharacter(user!.id, formData);
      
      Alert.alert(
        'Succès !',
        `${formData.name} a été créé avec succès !`,
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('CharacterList'),
          },
        ]
      );
    } catch (error: any) {
      Alert.alert('Erreur', error.message || 'Impossible de créer le personnage');
    } finally {
      setIsSubmitting(false);
    }
  }

  // Annuler et retourner à la liste
  function handleCancel() {
    Alert.alert(
      'Annuler ?',
      'Toutes les modifications seront perdues.',
      [
        { text: 'Continuer', style: 'cancel' },
        {
          text: 'Annuler',
          style: 'destructive',
          onPress: () => navigation.goBack(),
        },
      ]
    );
  }

  // Affiche le composant de l'étape courante
  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            data={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onCancel={handleCancel}
          />
        );
      case 2:
        return (
          <Step2Abilities
            data={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      /*case 3:
        return (
          <Step3Personality
            data={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 4:
        return (
          <Step4Equipment
            data={formData}
            onUpdate={updateFormData}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );
      case 5:
        return (
          <Step5Summary
            data={formData}
            onSubmit={handleSubmit}
            onPrevious={goToPreviousStep}
            isSubmitting={isSubmitting}
          />
        );
      default:
        return null;*/
    }
  }

  return (
    <View style={styles.container}>
      {/* Indicateur de progression */}
      <View style={styles.progressBar}>
        {[1, 2, 3, 4, 5].map((step) => (
          <View
            key={step}
            style={[
              styles.progressDot,
              step <= currentStep && styles.progressDotActive,
            ]}
          />
        ))}
      </View>

      {/* Titre de l'étape */}
      <Text style={styles.stepTitle}>
        Étape {currentStep}/5
      </Text>

      {/* Contenu de l'étape */}
      {renderStep()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  progressBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 40,
    backgroundColor: 'white',
    gap: 12,
  },
  progressDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#ddd',
  },
  progressDotActive: {
    backgroundColor: '#007AFF',
    width: 16,
    height: 16,
    borderRadius: 8,
  },
  stepTitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingVertical: 10,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});
