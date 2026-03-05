// HomeScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        <Text style={commonStyles.title}>HomeScreen</Text>
        <Text style={commonStyles.subtitle}>
          Bienvenue sur l’écran d’accueil
        </Text>

        <View style={commonStyles.actions}>
          <Button
            onPress={() => {
              navigation.navigate('Login');
            }}
            title="Aller à Login Screen"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
