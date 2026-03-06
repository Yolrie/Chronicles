// LoginScreen.tsx

import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import commonStyles from '../styles/common';
import { useState } from 'react';



const LoginScreen = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

  const isValid =
  username.trim().length > 0 &&
  email.trim().length > 0 &&
  password.trim().length > 0;

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>LoginScreen</Text>

        {username.length > 0 && (
        <Text style={commonStyles.subtitle}>
          Bonjour, {username}
        </Text>
      )}


        <TextInput
            placeholder="Name"
            placeholderTextColor="#9ca3af"
            value={username}
            onChangeText={setUsername}
            style={commonStyles.input}
        />

        <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
            style={commonStyles.input}
        />

        <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
            style={commonStyles.input}
        />

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Home', { username });
            }}
            title="Enregistrer"
            disabled={!isValid}
          />
        </View>
        
      </View>
    </View>
  );
};

export default LoginScreen;
