// src/screens/HomeScreen.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Button, Alert } from 'react-native';
import commonStyles from '../styles/common';
import { useCharacters } from '../context/CharactersContext';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { username } = route.params || {};
  const { characters, deleteCharacter } = useCharacters();

  const handleDeleteFromList = (id: number) => {
    Alert.alert(
      'Delete character',
      'This action cannot be undone. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => deleteCharacter(id),
        },
      ],
    );
  };

  const getInitials = (name: string) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) return parts[0][0].toUpperCase();
    return (parts[0][0] + parts[1][0]).toUpperCase();
  };

  return (
    <View style={commonStyles.screen}>
      {/* Conteneur plein écran (plus de grosse card avec ombres) */}
      <View
        style={{
          width: '100%',
          flex: 1,
          paddingHorizontal: 20,
          paddingVertical: 24,
        }}
      >
        {/* Haut : titre + stats */}
        <View>
          <View style={commonStyles.pill}>
            <Text style={commonStyles.pillText}>Character dashboard</Text>
          </View>

          <Text style={commonStyles.title}>Your party</Text>

          {username ? (
            <Text style={commonStyles.subtitle}>
              Welcome, {username}. Create, edit, and track your heroes.
            </Text>
          ) : (
            <Text style={commonStyles.subtitle}>
              Build and manage a roster of D&D‑style characters.
            </Text>
          )}

          <Text style={commonStyles.sectionHeader}>Overview</Text>
          <View style={commonStyles.statRow}>
            <View style={commonStyles.statCard}>
              <Text style={commonStyles.statLabel}>Characters</Text>
              <Text style={commonStyles.statValue}>{characters.length}</Text>
            </View>
            <View style={commonStyles.statCard}>
              <Text style={commonStyles.statLabel}>Last activity</Text>
              <Text style={commonStyles.statValue}>—</Text>
            </View>
          </View>
        </View>

        {/* Milieu : liste */}
        <View style={{ flex: 1, marginTop: 20 }}>
          {characters.length === 0 ? (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>
                No characters yet. Create your first hero.
              </Text>
            </View>
          ) : (
            <View>
              {characters.map((c) => (
                <View key={c.id} style={commonStyles.characterCard}>
                  {/* Ligne entête : initiales + nom + meta */}
                  <View style={commonStyles.characterHeaderRow}>
                    <View style={commonStyles.characterInitials}>
                      <Text style={commonStyles.characterInitialsText}>
                        {getInitials(c.name)}
                      </Text>
                    </View>

                    <View style={commonStyles.characterNameBlock}>
                      <Text style={commonStyles.characterName}>{c.name}</Text>
                      <Text style={commonStyles.characterMetaLine}>
                        {c.class || 'No class'} · {c.race || 'Unknown race'}
                      </Text>
                    </View>
                  </View>

                  {/* Ligne bas : tags + actions */}
                  <View style={commonStyles.characterFooterRow}>
                    <View style={commonStyles.characterTagsRow}>
                      {/* Placeholder pour plus tard : niveau, campagne, etc. */}
                      <Text style={commonStyles.characterTag}>Single‑player</Text>
                    </View>

                    <View style={commonStyles.characterActionsRow}>
                      <TouchableOpacity
                        onPress={() =>
                          navigation.navigate('CharacterForm', {
                            characterId: c.id,
                          })
                        }
                        style={commonStyles.linkButton}
                      >
                        <Text style={commonStyles.linkButtonText}>Edit</Text>
                      </TouchableOpacity>

                      <TouchableOpacity
                        onPress={() => handleDeleteFromList(c.id)}
                        style={[commonStyles.linkButton, { marginLeft: 12 }]}
                      >
                        <Text style={commonStyles.linkButtonText}>Delete</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Bas : actions (remontées et décollées du bord bas) */}
        <View
          style={[
            commonStyles.actions,
            { marginTop: 18, marginBottom: 12 },
          ]}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('CharacterForm')}
            style={commonStyles.primaryCta}
          >
            <Text style={commonStyles.primaryCtaText}>
              Create new character
            </Text>
          </TouchableOpacity>

          <Button
            onPress={() => navigation.navigate('Login')}
            title="Back to sign in"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
