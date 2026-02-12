import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../contexts/ThemeContext';
import Button from '../components/common/Button';

export default function HomeScreen() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <View style={[
      styles.container,
      { backgroundColor: isDark ? '#000' : '#fff' }
    ]}>
      <Text style={[
        styles.title,
        { color: isDark ? '#fff' : '#000' }
      ]}>
        Thème actuel : {theme}
      </Text>

      <Button
        texte={`Passer en mode ${isDark ? 'clair' : 'sombre'}`}
        onPress={toggleTheme}
        couleur={isDark ? '#fff' : '#000'}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
});
