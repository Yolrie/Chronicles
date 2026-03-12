// src/screens/CharactersScreen.tsx

import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharactersStackParamList } from '../navigation/AppNavigator';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { Character } from '../types';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharactersList'>;

const CharacterCard: React.FC<{ character: Character; onPress: () => void }> = ({ character, onPress }) => {
  const stats = character.data_json?.stats;
  const hp = character.data_json?.hp_current ?? character.data_json?.hp_max;
  const { campaigns } = useCampaignsStore();
  const camp = character.campaign_id ? campaigns.find(c => c.id === character.campaign_id) : null;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardLeft}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{character.name[0]?.toUpperCase()}</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.charName} numberOfLines={1}>{character.name}</Text>
          <Text style={[commonStyles.badge, commonStyles.badgeGold]}>Niv {character.level}</Text>
        </View>
        <Text style={styles.charSub}>
          {[character.race, character.class, character.background].filter(Boolean).join(' · ') || 'Aucun détail'}
        </Text>
        {camp && (
          <Text style={styles.campTag}>{camp.name}</Text>
        )}
        {stats && (
          <View style={styles.statsRow}>
            {(['strength', 'dexterity', 'constitution', 'intelligence', 'wisdom', 'charisma'] as const).map(s => {
              const abbr = { strength: 'FOR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'SAG', charisma: 'CHA' }[s];
              return (
                <View key={s} style={styles.statPill}>
                  <Text style={styles.statPillVal}>{stats[s] ?? '–'}</Text>
                  <Text style={styles.statPillLabel}>{abbr}</Text>
                </View>
              );
            })}
          </View>
        )}
        {hp !== undefined && <Text style={styles.hpLine}>PV {hp}{character.data_json?.hp_max ? `/${character.data_json.hp_max}` : ''}</Text>}
      </View>
    </TouchableOpacity>
  );
};

const CharactersScreen: React.FC<Props> = ({ navigation }) => {
  const { characters, loading, fetchCharacters, deleteCharacter } = useCharactersStore();
  const { campaigns } = useCampaignsStore();
  const { t } = useI18n();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchCharacters(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCharacters();
    setRefreshing(false);
  }, []);

  // Campagnes dont le joueur est membre
  const playerCampaigns = campaigns.filter(c => c.my_role === 'player');

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={characters}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={colors.gold2} />}
        ListHeaderComponent={
          playerCampaigns.length > 0 ? (
            <View style={styles.campHeader}>
              <Text style={commonStyles.sectionTitle}>Créer un personnage pour :</Text>
              {playerCampaigns.map(c => (
                <TouchableOpacity
                  key={c.id}
                  style={styles.campBtn}
                  onPress={() => navigation.navigate('CharacterForm', { campaignId: c.id })}
                >
                  <Text style={styles.campBtnText}>{c.name}</Text>
                  <Text style={styles.campBtnArrow}>›</Text>
                </TouchableOpacity>
              ))}
              <View style={styles.separator} />
            </View>
          ) : null
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 32 }]}>
              <Text style={[commonStyles.bodyText, { color: colors.muted, textAlign: 'center' }]}>
                {playerCampaigns.length === 0 ? t.characters.needCampaign : t.characters.noHeroes}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterForm', { characterId: item.id, campaignId: item.campaign_id ?? undefined })}
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
  campHeader: { marginBottom: 8 },
  campBtn: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    backgroundColor: colors.deep, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8,
  },
  campBtnText: { fontFamily: typography.title, fontSize: 12, color: colors.parchment, fontWeight: '700' },
  campBtnArrow: { color: colors.gold2, fontSize: 20, fontWeight: '300' },
  separator: { height: 1, backgroundColor: colors.border, marginBottom: 16, marginTop: 4 },
  card: {
    backgroundColor: colors.deep, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 12, flexDirection: 'row', gap: 12,
  },
  cardLeft: { justifyContent: 'flex-start' },
  cardBody: { flex: 1 },
  avatar: {
    width: 48, height: 48, borderRadius: 12,
    backgroundColor: 'rgba(139,26,42,0.25)', borderWidth: 1, borderColor: 'rgba(196,40,64,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  avatarText: { fontFamily: typography.title, fontSize: 22, color: colors.crimson2, fontWeight: '700' },
  nameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  charName: { fontFamily: typography.title, fontSize: 15, color: colors.parchment, fontWeight: '700', flex: 1, marginRight: 8 },
  charSub: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginBottom: 4 },
  campTag: { fontFamily: typography.title, fontSize: 9, color: colors.gold, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  statsRow: { flexDirection: 'row', gap: 5, flexWrap: 'wrap', marginBottom: 6 },
  statPill: {
    alignItems: 'center', backgroundColor: 'rgba(201,152,58,0.06)',
    borderRadius: 6, borderWidth: 1, borderColor: 'rgba(201,152,58,0.15)',
    paddingHorizontal: 5, paddingVertical: 3, minWidth: 34,
  },
  statPillVal: { fontFamily: typography.title, fontSize: 12, color: colors.gold2, fontWeight: '700' },
  statPillLabel: { fontFamily: typography.body, fontSize: 8, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.5 },
  hpLine: { fontFamily: typography.body, fontSize: 11, color: '#70c090' },
});
