// src/screens/CharactersScreen.tsx

import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharactersStackParamList } from '../navigation/AppNavigator';
import { useCharactersStore } from '../stores/charactersStore';
import { colors, commonStyles, typography } from '../styles/common';
import { Character } from '../types';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharactersList'>;

const CharacterCard: React.FC<{
  character: Character;
  onPress: () => void;
  onDelete: () => void;
}> = ({ character, onPress, onDelete }) => {
  const stats = character.data_json?.stats;
  const hp = character.data_json?.hp_current ?? character.data_json?.hp_max;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{character.name[0]?.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.charName}>{character.name}</Text>
          <Text style={[commonStyles.badge, commonStyles.badgeGold]}>Lv {character.level}</Text>
        </View>
        <Text style={styles.charSub}>
          {[character.race, character.class, character.background].filter(Boolean).join(' · ') || 'No details set'}
        </Text>
        {stats && (
          <View style={styles.statsRow}>
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map(s => (
              <View key={s} style={styles.statPill}>
                <Text style={styles.statPillVal}>{stats[s] ?? '–'}</Text>
                <Text style={styles.statPillLabel}>{s.slice(0, 3).toUpperCase()}</Text>
              </View>
            ))}
          </View>
        )}
        {hp !== undefined && (
          <Text style={styles.hpLine}>HP {hp}{character.data_json?.hp_max ? `/${character.data_json.hp_max}` : ''}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const CharactersScreen: React.FC<Props> = ({ navigation }) => {
  const { characters, loading, fetchCharacters, deleteCharacter } = useCharactersStore();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchCharacters(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCharacters();
    setRefreshing(false);
  }, []);

  function confirmDelete(id: string, name: string) {
    Alert.alert(
      'Delete character',
      `Permanently delete "${name}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: () => deleteCharacter(id) },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={characters}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={colors.gold2} />
        }
        ListHeaderComponent={
          <TouchableOpacity
            style={[commonStyles.primaryCta, { marginBottom: 16 }]}
            onPress={() => navigation.navigate('CharacterForm', undefined)}
          >
            <Text style={commonStyles.primaryCtaText}>+ Create New Hero</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 32 }]}>
              <Text style={[commonStyles.bodyText, { color: colors.muted, textAlign: 'center' }]}>
                No heroes yet.{'\n'}Forge your first character to begin.
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterForm', { characterId: item.id })}
            onDelete={() => confirmDelete(item.id, item.name)}
          />
        )}
      />
    </SafeAreaView>
  );
};

export default CharactersScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  card: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    gap: 12,
  },
  cardLeft: { justifyContent: 'flex-start' },
  cardBody: { flex: 1 },
  avatar: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(139,26,42,0.25)',
    borderWidth: 1, borderColor: 'rgba(196,40,64,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: typography.title, fontSize: 22, color: colors.crimson2, fontWeight: '700' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  charName: { fontFamily: typography.title, fontSize: 15, color: colors.parchment, fontWeight: '700', flex: 1, marginRight: 8 },
  charSub: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginBottom: 8 },
  statsRow: { flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 6 },
  statPill: {
    alignItems: 'center',
    backgroundColor: 'rgba(201,152,58,0.06)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    minWidth: 36,
  },
  statPillVal: { fontFamily: typography.title, fontSize: 12, color: colors.gold2, fontWeight: '700' },
  statPillLabel: { fontFamily: typography.body, fontSize: 8, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  hpLine: { fontFamily: typography.body, fontSize: 11, color: '#70c090' },
});
