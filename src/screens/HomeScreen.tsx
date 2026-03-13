// src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { profile } = useAuthStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { campaigns, fetchCampaigns } = useCampaignsStore();
  const { t } = useI18n();
  const navigation = useNavigation<any>();
  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => { fetchCharacters(); fetchCampaigns(); }, []);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([fetchCharacters(), fetchCampaigns()]);
    setRefreshing(false);
  }

  const myGmCampaigns = campaigns.filter(c => c.my_role === 'game_master');
  const recentChars = characters.slice(0, 3);
  const recentCamps = campaigns.slice(0, 3);

  const ROLE_LABELS: Record<string, string> = {
    player:      t.auth.player,
    game_master: t.auth.gameMaster,
    both:        `${t.auth.player} & ${t.auth.gameMaster}`,
  };

  const isEmpty = characters.length === 0 && campaigns.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* ── Hero Banner ─────────────────────────────────────────── */}
        <View style={styles.heroBanner}>
          {/* Titre de l'app */}
          <View style={styles.bannerContent}>
            <Text style={styles.appTitle}>Chronicles</Text>
            <Text style={styles.appTagline}>{t.home.subtitle}</Text>
          </View>

          {/* Décor */}
          <View style={styles.bannerDecor}>
            <Text style={styles.bannerRune}>᛭</Text>
          </View>

          {/* Utilisateur + badge */}
          <View style={styles.bannerUser}>
            <View style={styles.avatarCircle}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarLetter}>{profile?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              )}
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.welcomeText}>{t.home.welcomeBack}</Text>
              <Text style={styles.usernameText} numberOfLines={1}>{profile?.username ?? 'Adventurer'}</Text>
            </View>
            <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Premium')}>
              <Text style={styles.premiumBtnText}>✦ Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('CharactersTab')}>
            <Text style={styles.statNum}>{characters.length}</Text>
            <Text style={styles.statLab}>{t.home.heroes}</Text>
          </TouchableOpacity>
          <View style={styles.statDiv} />
          <TouchableOpacity style={styles.statCard} onPress={() => navigation.navigate('CampaignsTab')}>
            <Text style={styles.statNum}>{campaigns.length}</Text>
            <Text style={styles.statLab}>{t.home.campaigns}</Text>
          </TouchableOpacity>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{myGmCampaigns.length}</Text>
            <Text style={styles.statLab}>{t.home.asGM}</Text>
          </View>
        </View>

        {/* ── État vide — grandes CTA ───────────────────────────── */}
        {isEmpty ? (
          <View>
            <View style={styles.emptyBanner}>
              <Text style={styles.emptyRune}>✦ ᚱ ✦</Text>
              <Text style={styles.emptyTitle}>Vos Chroniques</Text>
              <Text style={styles.emptySubtitle}>{t.home.emptyHint}</Text>
            </View>

            <TouchableOpacity
              style={styles.bigCta}
              onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm', params: {} })}
            >
              <View style={styles.bigCtaInner}>
                <Text style={styles.bigCtaIcon}>⚔</Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.bigCtaTitle}>{t.home.createHero}</Text>
                  <Text style={styles.bigCtaDesc}>Créez votre héros, définissez son identité, son histoire et ses statistiques.</Text>
                </View>
                <Text style={styles.bigCtaArrow}>›</Text>
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.bigCta, styles.bigCtaCampaign]}
              onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignForm' })}
            >
              <View style={styles.bigCtaInner}>
                <Text style={styles.bigCtaIcon}>🗺</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.bigCtaTitle, { color: colors.gold2 }]}>{t.home.createCampaign}</Text>
                  <Text style={styles.bigCtaDesc}>Créez une campagne, invitez vos joueurs et forgez une légende.</Text>
                </View>
                <Text style={[styles.bigCtaArrow, { color: colors.gold2 }]}>›</Text>
              </View>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* ── Actions rapides ── */}
            <View style={styles.quickRow}>
              <TouchableOpacity
                style={styles.quickCard}
                onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm', params: {} })}
              >
                <Text style={styles.quickIcon}>⚔</Text>
                <Text style={styles.quickLabel}>{t.home.newHero}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.quickCard, styles.quickCardGold]}
                onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignForm' })}
              >
                <Text style={styles.quickIcon}>🗺</Text>
                <Text style={[styles.quickLabel, { color: colors.gold2 }]}>{t.home.newCampaign}</Text>
              </TouchableOpacity>
            </View>

            {/* ── Héros récents ── */}
            {recentChars.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={commonStyles.sectionTitle}>{t.home.recentHeroes}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('CharactersTab')}>
                    <Text style={styles.seeAll}>{t.home.seeAll}</Text>
                  </TouchableOpacity>
                </View>
                {recentChars.map(char => (
                  <TouchableOpacity
                    key={char.id}
                    style={styles.heroCard}
                    onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm', params: { characterId: char.id } })}
                    activeOpacity={0.75}
                  >
                    <View style={styles.heroCardAvatar}>
                      <Text style={styles.heroCardAvatarText}>{char.name[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.heroCardName}>{char.name}</Text>
                      <Text style={styles.heroCardMeta}>{[char.race, char.class].filter(Boolean).join(' · ') || t.home.noClassSet}</Text>
                    </View>
                    <Text style={[commonStyles.badge, commonStyles.badgeGold]}>{t.home.level} {char.level}</Text>
                  </TouchableOpacity>
                ))}
              </>
            )}

            {/* ── Campagnes actives ── */}
            {recentCamps.length > 0 && (
              <>
                <View style={styles.sectionHeader}>
                  <Text style={commonStyles.sectionTitle}>{t.home.activeCampaigns}</Text>
                  <TouchableOpacity onPress={() => navigation.navigate('CampaignsTab')}>
                    <Text style={styles.seeAll}>{t.home.seeAll}</Text>
                  </TouchableOpacity>
                </View>
                {recentCamps.map(camp => (
                  <TouchableOpacity
                    key={camp.id}
                    style={styles.campaignCard}
                    onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignDetail', params: { campaignId: camp.id } })}
                    activeOpacity={0.75}
                  >
                    <View style={[styles.heroCardAvatar, { backgroundColor: 'rgba(120,90,24,0.22)' }]}>
                      <Text style={[styles.heroCardAvatarText, { color: colors.gold2 }]}>{camp.name[0]?.toUpperCase()}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.heroCardName}>{camp.name}</Text>
                      <Text style={styles.heroCardMeta}>
                        {camp.my_role === 'game_master' ? t.home.gm : t.home.playerRole}
                        {camp.description ? ' · ' + camp.description.slice(0, 30) : ''}
                      </Text>
                    </View>
                    <Text style={[commonStyles.badge, camp.my_role === 'game_master' ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
                      {camp.my_role === 'game_master' ? t.campaigns.gm : t.campaigns.player}
                    </Text>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingBottom: 40 },

  // ── Hero Banner ──────────────────────────────────────────────────────────────
  heroBanner: {
    backgroundColor: colors.deep,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(201,152,58,0.25)',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 16,
    marginBottom: 16,
    position: 'relative',
    overflow: 'hidden',
  },
  bannerContent: { marginBottom: 16 },
  appTitle: {
    fontFamily: 'Cinzel Decorative',
    fontSize: 26,
    color: colors.gold2,
    fontWeight: '700',
    letterSpacing: 2,
  },
  appTagline: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 0.4,
  },
  bannerDecor: {
    position: 'absolute',
    right: 16,
    top: 16,
    opacity: 0.08,
  },
  bannerRune: {
    fontSize: 80,
    color: colors.gold2,
  },
  bannerUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(201,152,58,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(201,152,58,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 44, height: 44, borderRadius: 22 },
  avatarLetter: {
    fontFamily: typography.title,
    fontSize: 18,
    color: colors.gold2,
    fontWeight: '700',
  },
  welcomeText: { fontFamily: typography.body, fontSize: 12, color: colors.muted },
  usernameText: { fontFamily: typography.title, fontSize: 16, color: colors.parchment, fontWeight: '700' },
  premiumBtn: {
    borderWidth: 1, borderColor: colors.border2, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: 'rgba(180,140,60,0.06)',
  },
  premiumBtnText: {
    fontFamily: typography.title, fontSize: 9, color: colors.gold2,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },

  // ── Stats ────────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', marginHorizontal: 16, marginBottom: 20,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statNum: { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  statLab: { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.7 },
  statDiv: { width: 1, backgroundColor: colors.border, marginVertical: 8 },

  // ── Empty state ──────────────────────────────────────────────────────────────
  emptyBanner: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: 'rgba(201,152,58,0.04)',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.12)',
  },
  emptyRune: { fontFamily: typography.title, fontSize: 18, color: colors.gold2, letterSpacing: 8, marginBottom: 12 },
  emptyTitle: { fontFamily: 'Cinzel Decorative', fontSize: 20, color: colors.parchment, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontFamily: typography.body, fontSize: 14, color: colors.muted, textAlign: 'center', lineHeight: 22 },

  // ── Big CTA (état vide) ───────────────────────────────────────────────────────
  bigCta: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: 'rgba(139,26,42,0.18)',
    borderRadius: 14, borderWidth: 1, borderColor: 'rgba(196,40,64,0.35)',
    overflow: 'hidden',
  },
  bigCtaCampaign: {
    backgroundColor: 'rgba(120,90,24,0.18)',
    borderColor: 'rgba(201,152,58,0.35)',
  },
  bigCtaInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, paddingHorizontal: 18, gap: 14,
  },
  bigCtaIcon: { fontSize: 28 },
  bigCtaTitle: {
    fontFamily: typography.title, fontSize: 14, color: colors.crimson2,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },
  bigCtaDesc: { fontFamily: typography.body, fontSize: 13, color: colors.muted, lineHeight: 19 },
  bigCtaArrow: { fontSize: 24, color: colors.crimson2, fontWeight: '300' },

  // ── Quick actions (state non-vide) ────────────────────────────────────────────
  quickRow: {
    flexDirection: 'row', gap: 12,
    marginHorizontal: 16, marginBottom: 20,
  },
  quickCard: {
    flex: 1, alignItems: 'center', paddingVertical: 18,
    backgroundColor: 'rgba(139,26,42,0.14)',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(196,40,64,0.25)',
    gap: 6,
  },
  quickCardGold: {
    backgroundColor: 'rgba(120,90,24,0.12)',
    borderColor: 'rgba(201,152,58,0.25)',
  },
  quickIcon: { fontSize: 22 },
  quickLabel: {
    fontFamily: typography.title, fontSize: 10, color: colors.crimson2,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },

  // ── Section headers ───────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 8,
  },
  seeAll: { fontFamily: typography.body, fontSize: 13, color: colors.gold },

  // ── Hero card ─────────────────────────────────────────────────────────────────
  heroCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.deep, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginHorizontal: 16, marginBottom: 10,
  },
  heroCardAvatar: {
    width: 44, height: 44, borderRadius: 11,
    backgroundColor: 'rgba(120,24,40,0.20)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroCardAvatarText: { fontFamily: typography.title, fontSize: 19, color: colors.crimson2, fontWeight: '700' },
  heroCardName: { fontFamily: typography.title, fontSize: 14, color: colors.parchment, fontWeight: '700' },
  heroCardMeta: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },

  // ── Campaign card ─────────────────────────────────────────────────────────────
  campaignCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: colors.deep, borderRadius: 12,
    borderWidth: 1, borderColor: colors.border,
    padding: 14, marginHorizontal: 16, marginBottom: 10,
  },
});
