// App.tsx

import React from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>HSC - V2</Text>
      <Text>Première version propre du projet.</Text>
      <Button 
          onPress={() =>{
              console.log('You tapped the button Home screen!');
          }}
          title="Aller à Home Screen"
      />
      <Button 
          onPress={() =>{
              console.log('You tapped the button Login screen!');
          }}
          title="Aller à Login Screen"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
});
