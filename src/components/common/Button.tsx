import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface ButtonProps {
  texte: string;
  couleur?: string;
  onPress: () => void;
}

function Button({ texte, couleur = '#007AFF', onPress }: ButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor: couleur }]}
      onPress={onPress}
    >
      <Text style={styles.text}>{texte}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 8,
  },
  text: {
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default Button;
