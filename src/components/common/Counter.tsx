// src/components/common/Counter.tsx

import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from './Button';

function Counter() {
  // State : compteur commence à 0
  const [count, setCount] = useState(0);

  // Fonctions pour modifier le state
  function incrementer() {
    setCount(count + 1);
  }

  function decrementer() {
    setCount(count - 1);
  }

  function reset() {
    setCount(0);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compteur</Text>
      <Text style={styles.count}>{count}</Text>
      
      <View style={styles.buttons}>
        <Button text="-" couleur="#FF3B30" onPress={decrementer} />
        <Button text="Reset" couleur="#8E8E93" onPress={reset} />
        <Button text="+" couleur="#34C759" onPress={incrementer} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  count: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#007AFF',
    marginVertical: 20,
  },
  buttons: {
    flexDirection: 'row',
    gap: 10,
  },
});

export default Counter;
