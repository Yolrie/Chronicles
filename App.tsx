import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Input from './src/components/common/Input';
import Button from './src/components/common/Button';

export default function App() {
  // States pour chaque champ
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSubmit() {
    Alert.alert(
      'Formulaire soumis',
      `Email: ${email}\nMot de passe: ${password}`
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.title}>Connexion</Text>
        
        <Input
          label="Email"
          value={email}
          onChangeText={setEmail}
          placeholder="ton@email.com"
        />
        
        <Input
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          placeholder="••••••••"
          secureTextEntry={true}
        />
        
        <Button text="Se connecter" onPress={handleSubmit} couleur="#007AFF" />
        
        {/* Affiche en temps réel ce que tu tapes */}
        <Text style={styles.debug}>
          Email: {email}{'\n'}
          Password: {password.replace(/./g, '•')}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  form: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  debug: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    fontSize: 12,
    color: '#666',
  },
});
