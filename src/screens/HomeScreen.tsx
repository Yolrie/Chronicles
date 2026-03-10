// src/screens/HomeScreen.tsx

import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useCharacters } from '../context/CharactersContext';
import { commonStyles, colors } from '../styles/common';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

const HomeScreen: React.FC<Props> = ({ navigation, route }) => {
  const { characters } = useCharacters();
  const { username } = route.params;

  function goToCreate() {
    navigation.navigate('CharacterForm', undefined);
  }

  function goToEdit(id: number) {
    navigation.navigate('CharacterForm', { characterId: id });
  }

  function goToGuilds() {
    navigation.navigate('Guilds');
  }

  return (
    <View style={commonStyles.screen}>
      {/* Header */}
      <View style={{ marginBottom: 16 }}>
        <Text style={commonStyles.headerTitle}>
          Welcome, {username || 'Adventurer'}
        </Text>
        <Text style={commonStyles.headerSubtitle}>
          Forge heroes, then gather them into guilds.
        </Text>
      </View>

      {/* Actions principales */}
      <View style={{ marginBottom: 16, gap: 8 }}>
        <TouchableOpacity style={commonStyles.primaryCta} onPress={goToCreate}>
          <Text style={commonStyles.primaryCtaText}>
            Create new character
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={commonStyles.goldCta} onPress={goToGuilds}>
          <Text style={commonStyles.goldCtaText}>Open guilds</Text>
        </TouchableOpacity>
      </View>

      {/* Liste de personnages */}
      <Text style={commonStyles.sectionTitle}>My characters</Text>

      {characters.length === 0 ? (
        <View style={[commonStyles.card, { marginTop: 8 }]}>
          <Text style={commonStyles.bodyText}>
            No character yet. Forge your first hero to begin your chronicles.
          </Text>
        </View>
      ) : (
        <FlatList
          data={characters}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={{ paddingBottom: 24 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[commonStyles.card, { flexDirection: 'row', alignItems: 'center' }]}
              onPress={() => goToEdit(item.id)}
            >
              {/* Avatar simple avec initiale */}
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 10,
                  backgroundColor: colors.deep,
                  borderWidth: 1,
                  borderColor: colors.border2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Cinzel',
                    fontSize: 18,
                    color: colors.gold2,
                    fontWeight: '700',
                  }}
                >
                  {item.name?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>

              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    fontFamily: 'Cinzel',
                    fontSize: 15,
                    color: colors.parchment,
                    fontWeight: '700',
                  }}
                >
                  {item.name}
                </Text>
                <Text
                  style={{
                    fontFamily: 'EB Garamond',
                    fontSize: 13,
                    color: '#9ca3af',
                    marginTop: 2,
                  }}
                >
                  {(item.race || 'Unknown race') +
                    ' · ' +
                    (item.class || 'Unknown class')}
                </Text>
              </View>

              <View style={{ alignItems: 'flex-end' }}>
                <Text
                  style={[
                    commonStyles.badge,
                    commonStyles.badgeGold,
                    { marginBottom: 4 },
                  ]}
                >
                  Lv. {item.level ?? 1}
                </Text>
                <Text
                  style={{
                    fontFamily: 'EB Garamond',
                    fontSize: 11,
                    color: colors.muted,
                  }}
                >
                  Tap to edit
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;
