// src/screens/character/CharacterListScreen.tsx

import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useAuth } from '../../contexts/AuthContext';
import { getUserCharacters } from '../../services/characters.service';
import { Character } from '../../types/character.types';
import Button from '../../components/common/Button';

export default function CharacterListScreen({ navigation }: any) {
  const { user, signOut } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Charge les personnages au montage du composant
  useEffect(() => {
    loadCharacters();
  }, []);

  async function loadCharacters() {
    try {
      setIsLoading(true);
      const data = await getUserCharacters(user!.id);
      setCharacters(data);
    } catch (error: any) {
      Alert.alert('Erreur', 'Impossible de charger les personnages');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  function goToCreateCharacter() {
    navigation.navigate('CharacterCreate');
  }

  function goToCharacterDetail(character: Character) {
    navigation.navigate('CharacterDetail', { characterId: character.id });
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (error) {
      Alert.alert('Erreur', 'Impossible de se déconnecter');
    }
  }

  // Affiche un personnage dans la liste
  function renderCharacter({ item }: { item: Character }) {
    return (
      <TouchableOpacity 
        style={styles.characterCard}
        onPress={() => goToCharacterDetail(item)}
      >
        <View style={styles.characterHeader}>
          <Text style={styles.characterName}>{item.name}</Text>
          <Text style={styles.characterLevel}>Niv. {item.level}</Text>
        </View>
        <Text style={styles.characterInfo}>
          {item.race} • {item.class}
        </Text>
        <Text style={styles.characterBackground}>{item.background}</Text>
      </TouchableOpacity>
    );
  }

  // Affiche un message si aucun personnage
  function renderEmptyState() {
    return (
      <View style={styles.emptyState}>
        <Text style={styles.emptyTitle}>🎲</Text>
        <Text style={styles.emptyText}>Aucun personnage</Text>
        <Text style={styles.emptySubtext}>
          Crée ton premier héros pour commencer l'aventure !
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Bienvenue, {user?.username} !</Text>
          <Text style={styles.subGreeting}>
            {characters.length}/5 personnages
          </Text>
        </View>
        <TouchableOpacity onPress={handleLogout}>
          <Text style={styles.logoutButton}>Déconnexion</Text>
        </TouchableOpacity>
      </View>

      {/* Liste des personnages */}
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id!}
        renderItem={renderCharacter}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />

      {/* Bouton créer (désactivé si 5 persos) */}
      <View style={styles.footer}>
        <Button
          texte="+ Créer un personnage"
          onPress={goToCreateCharacter}
          couleur={characters.length >= 5 ? '#999' : '#34C759'}
        />
        {characters.length >= 5 && (
          <Text style={styles.limitText}>
            Limite de 5 personnages atteinte
          </Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  subGreeting: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  logoutButton: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  listContent: {
    padding: 16,
    flexGrow: 1,
  },
  characterCard: {
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  characterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  characterName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  characterLevel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
    backgroundColor: '#E3F2FD',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  characterInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  characterBackground: {
    fontSize: 12,
    color: '#999',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  footer: {
    padding: 16,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  limitText: {
    textAlign: 'center',
    color: '#999',
    fontSize: 12,
    marginTop: 8,
  },
});
