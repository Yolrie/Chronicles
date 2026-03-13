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

// ── Portrait Corner Marks ─────────────────────────────────────────────────────
// L-shaped corner marks: each corner has one horizontal + one vertical leg (10px × 1.5px)

const PortraitCorners: React.FC = () => (
  <>
    {/* Top-left */}
    <View style={[pcStyles.h, pcStyles.tlH]} />
    <View style={[pcStyles.v, pcStyles.tlV]} />
    {/* Top-right */}
    <View style={[pcStyles.h, pcStyles.trH]} />
    <View style={[pcStyles.v, pcStyles.trV]} />
    {/* Bottom-left */}
    <View style={[pcStyles.h, pcStyles.blH]} />
    <View style={[pcStyles.v, pcStyles.blV]} />
    {/* Bottom-right */}
    <View style={[pcStyles.h, pcStyles.brH]} />
    <View style={[pcStyles.v, pcStyles.brV]} />
  </>
);

const pcStyles = StyleSheet.create({
  h: { position: 'absolute', width: 10, height: 1.5, backgroundColor: colors.gold2 },
  v: { position: 'absolute', width: 1.5, height: 10, backgroundColor: colors.gold2 },
  tlH: { top: 0, left: 0 },
  tlV: { top: 0, left: 0 },
  trH: { top: 0, right: 0 },
  trV: { top: 0, right: 0 },
  blH: { bottom: 0, left: 0 },
  blV: { bottom: 0, left: 0 },
  brH: { bottom: 0, right: 0 },
  brV: { bottom: 0, right: 0 },
});

// ── Character Card ─────────────────────────────────────────────────────────────
// D&D trading card style: portrait on left, info on right

const CharacterCard: React.FC<{ character: Character; onPress: () => void }> = ({ character, onPress }) => {
  const stats = character.data_json?.stats;
  const hp = character.data_json?.hp_current ?? character.data_json?.hp_max;
  const { campaigns } = useCampaignsStore();
  const { t } = useI18n();
  const camp = character.campaign_id ? campaigns.find(c => c.id === character.campaign_id) : null;

  const STAT_ABBR = {
    strength: 'FOR',
    dexterity: 'DEX',
    constitution: 'CON',
    intelligence: 'INT',
    wisdom: 'SAG',
    charisma: 'CHA',
  } as const;

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.78}>
      {/* Gold top bar */}
      <View style={styles.cardTopBar} />

      <View style={styles.cardInner}>
        {/* Left: Trading-card portrait (70x88) */}
        <View style={styles.portraitWrap}>
          {/* Outer gold border */}
          <View style={styles.portrait}>
            {/* Corner marks */}
            <PortraitCorners />

            {character.avatar_url ? (
              <Image source={{ uri: character.avatar_url }} style={styles.portraitImg} />
            ) : (
              <View style={styles.portraitPlaceholder}>
                <Text style={styles.portraitSymbol}>◉</Text>
                <Text style={styles.portraitInitial}>{character.name[0]?.toUpperCase()}</Text>
              </View>
            )}
          </View>

          {/* Level badge — overlaps bottom-right corner */}
          <View style={styles.levelBadge}>
            <Text style={styles.levelBadgeText}>{character.level}</Text>
          </View>
        </View>

        {/* Right: character info */}
        <View style={styles.cardContent}>
          {/* Name */}
          <Text style={styles.charName} numberOfLines={1}>{character.name}</Text>

          {/* Race · Class · Background */}
          <Text style={styles.charSub} numberOfLines={1}>
            {[character.race, character.class, character.background].filter(Boolean).join(' · ') || t.common.noClassSet}
          </Text>

          {/* Campaign tag */}
          {camp ? (
            <Text style={styles.campTag}>◆ {camp.name}</Text>
          ) : (
            <Text style={styles.freeTag}>◆ {t.characters.freeCreation}</Text>
          )}

          {/* Stat pills */}
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

          {/* HP */}
          {hp !== undefined && (
            <Text style={styles.hpLine}>
              ♥ {hp}{character.data_json?.hp_max ? `/${character.data_json.hp_max}` : ''} PV
            </Text>
          )}
        </View>

        {/* Arrow */}
        <Text style={styles.cardArrow}>›</Text>
      </View>
    </TouchableOpacity>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────

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
            {/* ── Dramatic free-create button: parchment left stripe + dark content ── */}
            <TouchableOpacity
              style={styles.freeBtn}
              onPress={() => navigation.navigate('CharacterForm', {})}
              activeOpacity={0.78}
            >
              {/* Parchment left stripe */}
              <View style={styles.freeBtnStripe}>
                <Text style={styles.freeBtnStripeIcon}>⚔</Text>
              </View>
              {/* Dark content area */}
              <View style={styles.freeBtnContent}>
                <Text style={styles.freeBtnTitle}>{t.characters.createWithoutCampaign}</Text>
                <Text style={styles.freeBtnHint}>{t.characters.freeCreationHint}</Text>
              </View>
              <Text style={styles.freeBtnArrow}>›</Text>
            </TouchableOpacity>

            {/* ── Campaign section ── */}
            {playerCampaigns.length > 0 && (
              <View style={styles.campSection}>
                {/* Ornamental section title */}
                <View style={styles.ornamentalTitle}>
                  <View style={styles.ornamentalLine} />
                  <Text style={styles.campSectionTitle}>◆ Créer pour une campagne</Text>
                  <View style={styles.ornamentalLine} />
                </View>
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

            {/* ── Ornamental divider above character list ── */}
            {characters.length > 0 && (
              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerDiamond}>◆ HÉROS ◆</Text>
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

  // ── Free-create button: parchment left stripe + dark content ──────────────
  freeBtn: {
    flexDirection: 'row',
    alignItems: 'stretch',
    backgroundColor: '#09090C',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  // Parchment left stripe
  freeBtnStripe: {
    width: 52,
    backgroundColor: colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    borderRightWidth: 2,
    borderRightColor: '#8B7350',
  },
  freeBtnStripeIcon: {
    fontSize: 24,
  },
  // Dark content area
  freeBtnContent: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 14,
    justifyContent: 'center',
  },
  freeBtnTitle: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold2,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  freeBtnHint: {
    fontSize: 12,
    color: colors.muted,
  },
  freeBtnArrow: {
    fontSize: 22,
    color: colors.gold2,
    fontWeight: '300',
    paddingHorizontal: 14,
    alignSelf: 'center',
  },

  // ── Campaign section ─────────────────────────────────────────────────────
  campSection: { marginBottom: 8 },

  ornamentalTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    gap: 8,
  },
  ornamentalLine: { flex: 1, height: 1, backgroundColor: colors.border, opacity: 0.6 },
  campSectionTitle: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.6,
  },

  campBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: colors.deep, borderRadius: 8, borderWidth: 1, borderColor: colors.border,
    paddingVertical: 12, paddingHorizontal: 14, marginBottom: 8,
  },
  campBtnDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.gold2 },
  campBtnText: { fontFamily: typography.title, fontSize: 12, color: colors.parchment, fontWeight: '600', flex: 1 },
  campBtnArrow: { color: colors.gold2, fontSize: 18 },

  // ── Ornamental divider ────────────────────────────────────────────────────
  divider: {
    flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.border2, opacity: 0.5 },
  dividerDiamond: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.gold2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  // ── Trading-card character card ───────────────────────────────────────────
  card: {
    backgroundColor: '#0E1420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    marginBottom: 14,
    overflow: 'hidden',
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  cardTopBar: {
    height: 2,
    backgroundColor: colors.gold2,
    opacity: 0.7,
  },
  cardInner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: 12,
    gap: 12,
  },

  // ── Portrait placeholder (70x88) ─────────────────────────────────────────
  portraitWrap: {
    position: 'relative',
    flexShrink: 0,
  },
  portrait: {
    width: 70,
    height: 88,
    backgroundColor: colors.deep,
    borderWidth: 1.5,
    borderColor: colors.border2,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    position: 'relative',
  },
  portraitImg: {
    width: 70,
    height: 88,
    borderRadius: 3,
  },
  portraitPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  portraitSymbol: {
    fontSize: 28,
    color: colors.gold2,
    opacity: 0.65,
    lineHeight: 34,
  },
  portraitInitial: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold,
    fontWeight: '700',
  },

  // Level badge overlapping bottom-right corner
  levelBadge: {
    position: 'absolute',
    bottom: -5,
    right: -5,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.gold2,
    borderWidth: 2,
    borderColor: colors.ink,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  levelBadgeText: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.deeper,
    fontWeight: '700',
  },

  // ── Character info (right side) ────────────────────────────────────────────
  cardContent: { flex: 1 },

  charName: {
    fontFamily: typography.title,
    fontSize: 15,
    color: colors.parchment,
    fontWeight: '700',
    marginBottom: 3,
  },
  charSub: {
    fontSize: 12,
    color: colors.muted,
    marginBottom: 5,
  },
  campTag: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
  },
  freeTag: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    fontStyle: 'italic',
  },

  statsRow: {
    flexDirection: 'row',
    gap: 4,
    flexWrap: 'wrap',
    marginBottom: 6,
  },
  statPill: {
    alignItems: 'center',
    minWidth: 34,
    backgroundColor: 'rgba(201,168,76,0.07)',
    borderRadius: 5,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 5,
    paddingVertical: 3,
  },
  statPillVal: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold2,
    fontWeight: '700',
  },
  statPillLabel: {
    fontSize: 7,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.4,
  },

  hpLine: {
    fontSize: 11,
    color: '#4CAF6E',
  },

  cardArrow: {
    fontSize: 22,
    color: colors.gold,
    fontWeight: '300',
    alignSelf: 'center',
  },

  // ── Empty state ────────────────────────────────────────────────────────────
  emptyCard: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyRune: { fontSize: 36, marginBottom: 14 },
  emptyTitle: {
    fontFamily: typography.title,
    fontSize: 16,
    color: colors.parchment,
    fontWeight: '700',
    marginBottom: 8,
  },
});
