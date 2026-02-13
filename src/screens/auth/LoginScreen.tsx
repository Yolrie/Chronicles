// src/screens/auth/LoginScreen.tsx

import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Alert, 
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

export default function LoginScreen({ navigation }: any) {
  // States pour les champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Récupère la fonction signIn du Context
  const { signIn } = useAuth();

  // Fonction de soumission du formulaire
  async function handleLogin() {
    // Validation basique
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    try {
      setIsSubmitting(true);
      await signIn(email.trim(), password);
      
      // Si ça arrive ici, c'est que la connexion a réussi
      Alert.alert('Succès', 'Connexion réussie !');
      
    } catch (error: any) {
      // Affiche l'erreur à l'utilisateur
      Alert.alert(
        'Erreur de connexion',
        error.message || 'Email ou mot de passe incorrect'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // Navigation vers l'écran d'inscription
  function goToRegister() {
    navigation.navigate('Register');
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.formContainer}>
          {/* Header */}
          <Text style={styles.title}>Connexion</Text>
          <Text style={styles.subtitle}>
            Connecte-toi pour gérer tes personnages
          </Text>

          {/* Formulaire */}
          <View style={styles.form}>
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

            <Button
              texte={isSubmitting ? 'Connexion...' : 'Se connecter'}
              onPress={handleLogin}
              couleur="#007AFF"
            />
          </View>

          {/* Lien vers inscription */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Pas encore de compte ?</Text>
            <TouchableOpacity onPress={goToRegister}>
              <Text style={styles.link}>S'inscrire</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  formContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  footerText: {
    fontSize: 14,
    color: '#666',
  },
  link: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
});
