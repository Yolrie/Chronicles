// src/screens/CharactersScreen.tsx

import React, { useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CharactersStackParamList } from '../navigation/AppNavigator';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { Character } from '../types';

type Props = NativeStackScreenProps<CharactersStackParamList, 'CharactersList'>;

// ── Carte personnage ──────────────────────────────────────────────────────────

const CharacterCard: React.FC<{ character: Character; onPress: () => void }> = ({ character, onPress }) => {
  const stats = character.data_json?.stats;
  const hp = character.data_json?.hp_current ?? character.data_json?.hp_max;
  const { campaigns } = useCampaignsStore();
  const { t } = useI18n();
  const camp = character.campaign_id ? campaigns.find(c => c.id === character.campaign_id) : null;

  const STAT_ABBR = { strength: 'FOR', dexterity: 'DEX', constitution: 'CON', intelligence: 'INT', wisdom: 'SAG', charisma: 'CHA' } as const;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.78}>
      {/* Barre dorée top */}
      <View style={styles.cardTopBar} />

      <View style={styles.cardInner}>
        {/* Avatar */}
        <View style={styles.cardAvatarWrap}>
          {character.avatar_url ? (
            <Image source={{ uri: character.avatar_url }} style={styles.cardAvatarImg} />
          ) : (
            <View style={styles.cardAvatar}>
              <Text style={styles.cardAvatarText}>{character.name[0]?.toUpperCase()}</Text>
            </View>
          )}
          {/* Niveau bubble */}
          <View style={styles.levelBubble}>
            <Text style={styles.levelBubbleText}>{character.level}</Text>
          </View>
        </View>

        {/* Infos */}
        <View style={styles.cardContent}>
          <View style={styles.nameRow}>
            <Text style={styles.charName} numberOfLines={1}>{character.name}</Text>
          </View>
          <Text style={styles.charSub} numberOfLines={1}>
            {[character.race, character.class, character.background].filter(Boolean).join(' · ') || t.common.noClassSet}
          </Text>

          {camp ? (
            <Text style={styles.campTag}>◆ {camp.name}</Text>
          ) : (
            <Text style={styles.freeTag}>◆ {t.characters.freeCreation}</Text>
          )}

          {/* Stats compactes */}
          {stats && (
            <View style={styles.statsRow}>
              {(Object.keys(STAT_ABBR) as Array<keyof typeof STAT_ABBR>).map(s => (
                <View key={s} style={styles.statPill}>
                  <Text style={styles.statPillVal}>{stats[s] ?? '—'}</Text>
                  <Text style={styles.statPillLabel}>{STAT_ABBR[s]}</Text>
                </View>
              ))}
            </View>
          )}

          {hp !== undefined && (
            <Text style={styles.hpLine}>
              ♥ {hp}{character.data_json?.hp_max ? `/${character.data_json.hp_max}` : ''} PV
            </Text>
          )}
        </View>

        {/* Flèche */}
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

// ── Écran principal ───────────────────────────────────────────────────────────

const CharactersScreen: React.FC<Props> = ({ navigation }) => {
  const { characters, loading, fetchCharacters } = useCharactersStore();
  const { campaigns } = useCampaignsStore();
  const { t } = useI18n();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchCharacters(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCharacters();
    setRefreshing(false);
  }, []);

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
          <View style={styles.header}>
            {/* CTA création libre */}
            <TouchableOpacity
              style={styles.freeBtn}
              onPress={() => navigation.navigate('CharacterForm', {})}
              activeOpacity={0.78}
            >
              <View style={styles.freeBtnTopBar} />
              <View style={styles.freeBtnInner}>
                <View style={styles.freeBtnIconWrap}>
                  <Text style={styles.freeBtnIcon}>⚔</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.freeBtnTitle}>{t.characters.createWithoutCampaign}</Text>
                  <Text style={styles.freeBtnHint}>{t.characters.freeCreationHint}</Text>
                </View>
                <Text style={styles.freeBtnArrow}>›</Text>
              </View>
            </TouchableOpacity>

            {/* Campagnes joueur */}
            {playerCampaigns.length > 0 && (
              <View style={styles.campSection}>
                <Text style={styles.campSectionTitle}>◆ Créer pour une campagne</Text>
                {playerCampaigns.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={styles.campBtn}
                    onPress={() => navigation.navigate('CharacterForm', { campaignId: c.id })}
                  >
                    <View style={styles.campBtnDot} />
                    <Text style={styles.campBtnText}>{c.name}</Text>
                    <Text style={styles.campBtnArrow}>›</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            {characters.length > 0 && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>◆</Text>
                <View style={styles.dividerLine} />
              </View>
            )}
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[commonStyles.card, styles.emptyCard]}>
              <Text style={styles.emptyRune}>⚔</Text>
              <Text style={styles.emptyTitle}>Aucun héros</Text>
              <Text style={commonStyles.mutedText}>{t.characters.noHeroes}</Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <CharacterCard
            character={item}
            onPress={() => navigation.navigate('CharacterForm', {
              characterId: item.id,
              campaignId: item.campaign_id ?? undefined,
            })}
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

  header: { marginBottom: 8 },

  // ── Bouton création libre ──────────────────────────────────────────────────
  freeBtn: {
    backgroundColor: colors.deep,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border2,
    marginBottom: 14, overflow: 'hidden',
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 8, elevation: 4,
  },
  freeBtnTopBar: { height: 2, backgroundColor: colors.gold2 },
  freeBtnInner: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16 },
  freeBtnIconWrap: {
    width: 44, height: 44, borderRadius: 10,
    backgroundColor: 'rgba(201,168,76,0.1)',
    borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  freeBtnIcon: { fontSize: 22 },
  freeBtnTitle: { fontFamily: typography.title, fontSize: 12, color: colors.gold2, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 3 },
  freeBtnHint: { fontFamily: typography.body, fontSize: 12, color: colors.muted },
  freeBtnArrow: { fontSize: 22, color: colors.gold2, fontWeight: '300' },

  // ── Section campagnes ───────────────────────────────────────────────────────
  campSection: { marginBottom: 8 },
  campSectionTitle: { fontFamily: typography.title, fontSize: 9, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1.6, marginBottom: 8 },
  campBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.deep, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8,
  },
  campBtnDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold2 },
  campBtnText: { fontFamily: typography.title, fontSize: 12, color: colors.parchment, fontWeight: '600', flex: 1 },
  campBtnArrow: { color: colors.gold2, fontSize: 18 },

  // ── Séparateur ─────────────────────────────────────────────────────────────
  divider: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border },
  dividerText: { fontFamily: typography.title, fontSize: 12, color: colors.gold2 },

  // ── Carte personnage ───────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.deep, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    marginBottom: 12, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4, shadowRadius: 10, elevation: 5,
  },
  cardTopBar: { height: 2, backgroundColor: colors.border2 },
  cardInner: { flexDirection: 'row', alignItems: 'flex-start', padding: 14, gap: 14 },

  cardAvatarWrap: { position: 'relative' },
  cardAvatarImg: { width: 56, height: 56, borderRadius: 12, borderWidth: 1, borderColor: colors.border2 },
  cardAvatar: {
    width: 56, height: 56, borderRadius: 12,
    backgroundColor: 'rgba(139,26,26,0.25)',
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.4)',
    alignItems: 'center', justifyContent: 'center',
  },
  cardAvatarText: { fontFamily: typography.title, fontSize: 24, color: colors.crimson2, fontWeight: '700' },
  levelBubble: {
    position: 'absolute', bottom: -4, right: -4,
    width: 22, height: 22, borderRadius: 11,
    backgroundColor: colors.gold2, borderWidth: 1.5, borderColor: colors.deeper,
    alignItems: 'center', justifyContent: 'center',
  },
  levelBubbleText: { fontFamily: typography.title, fontSize: 9, color: colors.deeper, fontWeight: '700' },

  cardContent: { flex: 1 },
  nameRow: { marginBottom: 3 },
  charName: { fontFamily: typography.title, fontSize: 15, color: colors.parchment, fontWeight: '700' },
  charSub: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginBottom: 5 },
  campTag: { fontFamily: typography.title, fontSize: 9, color: colors.gold2, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 },
  freeTag: { fontFamily: typography.title, fontSize: 9, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8, fontStyle: 'italic' },

  statsRow: { flexDirection: 'row', gap: 4, flexWrap: 'wrap', marginBottom: 6 },
  statPill: {
    alignItems: 'center', minWidth: 34,
    backgroundColor: 'rgba(201,168,76,0.07)',
    borderRadius: 6, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 5, paddingVertical: 3,
  },
  statPillVal: { fontFamily: typography.title, fontSize: 11, color: colors.gold2, fontWeight: '700' },
  statPillLabel: { fontFamily: typography.body, fontSize: 7, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.4 },
  hpLine: { fontFamily: typography.body, fontSize: 11, color: '#4CAF6E' },
  cardArrow: { fontSize: 22, color: colors.gold, fontWeight: '300', alignSelf: 'center' },

  // ── État vide ──────────────────────────────────────────────────────────────
  emptyCard: { alignItems: 'center', paddingVertical: 40 },
  emptyRune: { fontSize: 36, marginBottom: 14 },
  emptyTitle: { fontFamily: typography.title, fontSize: 16, color: colors.parchment, fontWeight: '700', marginBottom: 8 },
});
