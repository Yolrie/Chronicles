// LoginScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';

const LoginScreen = ({ navigation }) => {
  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>LoginScreen</Text>
        <Text style={commonStyles.subtitle}>
          Connecte-toi pour accéder à l’accueil
        </Text>

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Home');
            }}
            title="Aller à Home Screen"
          />
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;
