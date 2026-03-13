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

// ── Ornamental divider ────────────────────────────────────────────────────────

const OrnamentDivider: React.FC<{ label?: string }> = ({ label }) => (
  <View style={divStyles.wrap}>
    <View style={divStyles.line} />
    {label ? (
      <Text style={divStyles.label}>{`◆ ${label} ◆`}</Text>
    ) : (
      <Text style={divStyles.diamond}>◆</Text>
    )}
    <View style={divStyles.line} />
  </View>
);

const divStyles = StyleSheet.create({
  wrap: { flexDirection: 'row', alignItems: 'center', marginVertical: 14, paddingHorizontal: 16 },
  line: { flex: 1, height: 1, backgroundColor: colors.border2, opacity: 0.6 },
  label: { fontFamily: typography.title, fontSize: 9, color: colors.gold2, letterSpacing: 2.2, textTransform: 'uppercase', marginHorizontal: 12 },
  diamond: { fontFamily: typography.title, fontSize: 12, color: colors.gold2, marginHorizontal: 10, opacity: 0.7 },
});

// ── Portrait corner marks component ──────────────────────────────────────────

const PortraitCorners: React.FC = () => (
  <>
    {/* Top-left */}
    <View style={[cornerStyles.hLine, cornerStyles.tlH]} />
    <View style={[cornerStyles.vLine, cornerStyles.tlV]} />
    {/* Top-right */}
    <View style={[cornerStyles.hLine, cornerStyles.trH]} />
    <View style={[cornerStyles.vLine, cornerStyles.trV]} />
    {/* Bottom-left */}
    <View style={[cornerStyles.hLine, cornerStyles.blH]} />
    <View style={[cornerStyles.vLine, cornerStyles.blV]} />
    {/* Bottom-right */}
    <View style={[cornerStyles.hLine, cornerStyles.brH]} />
    <View style={[cornerStyles.vLine, cornerStyles.brV]} />
  </>
);

const C = colors.gold2;
const cornerStyles = StyleSheet.create({
  hLine: { position: 'absolute', width: 10, height: 1.5, backgroundColor: C },
  vLine: { position: 'absolute', width: 1.5, height: 10, backgroundColor: C },
  tlH: { top: 0, left: 0 },
  tlV: { top: 0, left: 0 },
  trH: { top: 0, right: 0 },
  trV: { top: 0, right: 0 },
  blH: { bottom: 0, left: 0 },
  blV: { bottom: 0, left: 0 },
  brH: { bottom: 0, right: 0 },
  brV: { bottom: 0, right: 0 },
});

// ── Main Screen ───────────────────────────────────────────────────────────────

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

  const isEmpty = characters.length === 0 && campaigns.length === 0;

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* ── Stone Header Strip ───────────────────────────────────── */}
        <View style={styles.headerStrip}>
          {/* Left: app title */}
          <View style={styles.headerLeft}>
            <Text style={styles.appTitle}>Chronicles</Text>
            <Text style={styles.appTagline}>{t.home.subtitle}</Text>
          </View>

          {/* Right: user avatar inline */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.premiumBtn} onPress={() => navigation.navigate('Premium')}>
              <Text style={styles.premiumBtnText}>✦ Premium</Text>
            </TouchableOpacity>
            <View style={styles.avatarCircle}>
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
              ) : (
                <Text style={styles.avatarLetter}>{profile?.username?.[0]?.toUpperCase() ?? '?'}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Ornamental gold divider */}
        <View style={styles.headerDivider}>
          <View style={styles.headerDividerLine} />
          <Text style={styles.headerDividerDiamond}>◆</Text>
          <View style={styles.headerDividerLine} />
        </View>

        {/* Welcome line */}
        <View style={styles.welcomeRow}>
          <Text style={styles.welcomeText}>{t.home.welcomeBack}, </Text>
          <Text style={styles.usernameText} numberOfLines={1}>{profile?.username ?? 'Adventurer'}</Text>
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
            {/* Parchment-style empty banner */}
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
                  <Text style={styles.sectionTitle}>{`◆ ${t.home.recentHeroes} ◆`}</Text>
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
                    {/* Small rectangular portrait placeholder with corner marks */}
                    <View style={styles.heroPortrait}>
                      <PortraitCorners />
                      <Text style={styles.heroPortraitIcon}>◉</Text>
                      <Text style={styles.heroPortraitInitial}>{char.name[0]?.toUpperCase()}</Text>
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
                  <Text style={styles.sectionTitle}>{`◆ ${t.home.activeCampaigns} ◆`}</Text>
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
                    {/* Circular portrait placeholder with gold border */}
                    <View style={styles.campPortrait}>
                      <Text style={styles.campPortraitIcon}>🏰</Text>
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

  // ── Stone header strip ────────────────────────────────────────────────────
  headerStrip: {
    backgroundColor: colors.deep,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: { flex: 1 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },

  appTitle: {
    fontFamily: 'Cinzel Decorative',
    fontSize: 22,
    color: colors.gold2,
    fontWeight: '700',
    letterSpacing: 2,
  },
  appTagline: {
    fontSize: 11,
    color: colors.muted,
    marginTop: 2,
    letterSpacing: 0.4,
  },

  premiumBtn: {
    borderWidth: 1, borderColor: colors.border2, borderRadius: 99,
    paddingHorizontal: 10, paddingVertical: 5,
    backgroundColor: 'rgba(180,140,60,0.06)',
  },
  premiumBtnText: {
    fontFamily: typography.title, fontSize: 9, color: colors.gold2,
    textTransform: 'uppercase', letterSpacing: 0.8,
  },

  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(201,152,58,0.12)',
    borderWidth: 2,
    borderColor: 'rgba(201,152,58,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarImg: { width: 38, height: 38, borderRadius: 19 },
  avatarLetter: {
    fontFamily: typography.title,
    fontSize: 16,
    color: colors.gold2,
    fontWeight: '700',
  },

  // Gold ornamental divider below header
  headerDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    backgroundColor: colors.deep,
  },
  headerDividerLine: { flex: 1, height: 1, backgroundColor: colors.border2, opacity: 0.5 },
  headerDividerDiamond: { fontFamily: typography.title, fontSize: 10, color: colors.gold2, marginHorizontal: 10, opacity: 0.8 },

  welcomeRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
  },
  welcomeText: { fontSize: 13, color: colors.muted },
  usernameText: { fontFamily: typography.title, fontSize: 15, color: colors.parchment, fontWeight: '700' },

  // ── Stats ────────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#0A0B0E',
    borderRadius: 10, borderWidth: 1, borderColor: colors.border2,
    overflow: 'hidden', marginHorizontal: 16, marginBottom: 18,
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 14 },
  statNum: { fontFamily: typography.title, fontSize: 24, color: colors.gold2, fontWeight: '700' },
  statLab: { fontSize: 10, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.7 },
  statDiv: { width: 1, backgroundColor: colors.border2, marginVertical: 8 },

  // ── Empty state (parchment panel) ────────────────────────────────────────
  emptyBanner: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 24,
    marginHorizontal: 16,
    marginBottom: 20,
    backgroundColor: colors.parchment,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#8B7350',
    shadowColor: '#3C2800',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  emptyRune: { fontFamily: typography.title, fontSize: 18, color: colors.parchmentInk, letterSpacing: 8, marginBottom: 12, opacity: 0.7 },
  emptyTitle: { fontFamily: 'Cinzel Decorative', fontSize: 18, color: colors.parchmentInk, fontWeight: '700', marginBottom: 8 },
  emptySubtitle: { fontSize: 13, color: '#5C4030', textAlign: 'center', lineHeight: 20 },

  // ── Big CTA (état vide) ───────────────────────────────────────────────────
  bigCta: {
    marginHorizontal: 16, marginBottom: 12,
    backgroundColor: '#0F0A0A',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139,26,26,0.5)',
    overflow: 'hidden',
    shadowColor: colors.crimson,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  bigCtaCampaign: {
    backgroundColor: '#0A0B0A',
    borderColor: colors.border2,
    shadowColor: colors.gold2,
  },
  bigCtaInner: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 18, paddingHorizontal: 18, gap: 14,
  },
  bigCtaIcon: { fontSize: 28 },
  bigCtaTitle: {
    fontFamily: typography.title, fontSize: 13, color: colors.crimson2,
    fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 4,
  },
  bigCtaDesc: { fontSize: 12, color: colors.muted, lineHeight: 18 },
  bigCtaArrow: { fontSize: 24, color: colors.crimson2, fontWeight: '300' },

  // ── Quick actions ─────────────────────────────────────────────────────────
  quickRow: {
    flexDirection: 'row', gap: 12,
    marginHorizontal: 16, marginBottom: 20,
  },
  quickCard: {
    flex: 1, alignItems: 'center', paddingVertical: 20,
    backgroundColor: '#0A0708',
    borderRadius: 12, borderWidth: 1, borderColor: 'rgba(139,26,26,0.35)',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 3,
  },
  quickCardGold: {
    backgroundColor: '#09090A',
    borderColor: colors.border2,
  },
  quickIcon: { fontSize: 24 },
  quickLabel: {
    fontFamily: typography.title, fontSize: 10, color: colors.crimson2,
    textTransform: 'uppercase', letterSpacing: 0.6,
  },

  // ── Section headers ────────────────────────────────────────────────────────
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 16, marginBottom: 10, marginTop: 4,
  },
  sectionTitle: {
    fontFamily: typography.title, fontSize: 10, color: colors.gold2,
    textTransform: 'uppercase', letterSpacing: 2.0,
  },
  seeAll: { fontSize: 13, color: colors.gold },

  // ── Hero card ─────────────────────────────────────────────────────────────
  heroCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0E1420', borderRadius: 12,
    borderWidth: 1, borderColor: colors.border2,
    padding: 12, marginHorizontal: 16, marginBottom: 10,
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  // Small rectangular portrait placeholder with corner marks (44x54)
  heroPortrait: {
    width: 44,
    height: 54,
    backgroundColor: colors.deep,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 3,
    flexShrink: 0,
  },
  heroPortraitIcon: {
    fontSize: 18,
    color: colors.gold2,
    opacity: 0.6,
    lineHeight: 22,
  },
  heroPortraitInitial: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold,
    marginTop: 2,
  },

  heroCardName: { fontFamily: typography.title, fontSize: 14, color: colors.parchment, fontWeight: '700' },
  heroCardMeta: { fontSize: 12, color: colors.muted, marginTop: 2 },

  // ── Campaign card ─────────────────────────────────────────────────────────
  campaignCard: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    backgroundColor: '#0E1420', borderRadius: 12,
    borderWidth: 1, borderColor: colors.border2,
    padding: 12, marginHorizontal: 16, marginBottom: 10,
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },

  // Circular portrait placeholder (48px) with gold border
  campPortrait: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(120,90,24,0.18)',
    borderWidth: 2,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  campPortraitIcon: {
    fontSize: 22,
  },
});
