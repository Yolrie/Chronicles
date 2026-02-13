// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/common/Button';

export default function HomeScreen() {
  const { user, signOut } = useAuth();

  async function handleLogout() {
    try {
      await signOut();
      Alert.alert('Déconnexion', 'À bientôt !');
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue {user?.username} ! 🎉</Text>
      <Text style={styles.subtitle}>Email: {user?.email}</Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          texte="Se déconnecter" 
          onPress={handleLogout}
          couleur="#FF3B30"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
});
