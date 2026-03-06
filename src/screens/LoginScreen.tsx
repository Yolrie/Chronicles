// LoginScreen.tsx

import React from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import commonStyles from '../styles/common';
import { useState } from 'react';



const LoginScreen = ({ navigation }) => {
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');

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
        />

        <TextInput
            placeholder="Email"
            placeholderTextColor="#9ca3af"
            value={email}
            onChangeText={setEmail}
        />

        <TextInput
            placeholder="Mot de passe"
            placeholderTextColor="#9ca3af"
            value={password}
            onChangeText={setPassword}
        />

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Home');
            }}
            title="Enregistrer"
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
