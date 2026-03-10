// src/screens/LoginScreen.tsx

import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import commonStyles from '../styles/common';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogin = () => {
    navigation.navigate('Home', {
      username,
      email,
      password,
    });
  };

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        {/* Petit badge haut */}
        <View style={commonStyles.pill}>
          <Text style={commonStyles.pillText}>Create · Build · Play</Text>
        </View>

        {/* Titre principal */}
        <Text style={commonStyles.title}>
          Access your characters
        </Text>

        <Text style={commonStyles.subtitle}>
          Sign in to start creating and managing your D&D‑style heroes.
        </Text>

        {/* Formulaire */}
        <TextInput
          placeholder="Username"
          placeholderTextColor="#9ca3af"
          value={username}
          onChangeText={setUsername}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Email"
          placeholderTextColor="#9ca3af"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
          style={commonStyles.input}
        />

        <TextInput
          placeholder="Password"
          placeholderTextColor="#9ca3af"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={commonStyles.input}
        />

        {/* Actions */}
        <View style={commonStyles.actions}>
          {/* CTA rouge */}
          <View style={commonStyles.primaryCta}>
            <Text
              style={commonStyles.primaryCtaText}
              onPress={handleLogin}
            >
              Continue
            </Text>
          </View>

          {/* Bouton secondaire simple */}
          <Button
            title="Use a demo account"
            onPress={() => {
              setUsername('Demo hero');
              setEmail('demo@example.com');
              setPassword('demo');
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
