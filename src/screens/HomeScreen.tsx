// src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { useNavigation } from '@react-navigation/native';
import ImagePlaceholder from '../components/ImagePlaceholder';

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
  const ROLE_LABELS: Record<string, string> = {
    player:      t.auth.player,
    game_master: t.auth.gameMaster,
    both:        `${t.auth.player} & ${t.auth.gameMaster}`,
  };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* En-tête */}
        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={styles.welcome}>{t.home.welcomeBack}</Text>
            <Text style={styles.username}>{profile?.username ?? 'Adventurer'}</Text>
          </View>
          <View style={{ alignItems: 'flex-end', gap: 6 }}>
            <Text style={[commonStyles.badge, commonStyles.badgePurple]}>
              {ROLE_LABELS[profile?.role ?? 'player']}
            </Text>
            <TouchableOpacity
              style={styles.premiumBtn}
              onPress={() => navigation.navigate('Premium')}
            >
              <Text style={styles.premiumBtnText}>✦ Premium</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bannière image — illustration d'accueil */}
        <ImagePlaceholder
          height={110}
          borderRadius={10}
          label="Illustration de bienvenue"
          style={{ marginBottom: 16 }}
        />

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{characters.length}</Text>
            <Text style={styles.statLab}>{t.home.heroes}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{campaigns.length}</Text>
            <Text style={styles.statLab}>{t.home.campaigns}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{myGmCampaigns.length}</Text>
            <Text style={styles.statLab}>{t.home.asGM}</Text>
          </View>
        </View>

        {/* Actions rapides */}
        <Text style={[commonStyles.sectionTitle, { marginTop: 20 }]}>{t.home.quickActions}</Text>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignForm' })}
        >
          <Text style={styles.actionIcon}>⚔</Text>
          <Text style={styles.actionText}>{t.home.newCampaign}</Text>
        </TouchableOpacity>

        {/* Héros récents */}
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
                style={commonStyles.card}
                onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm', params: { characterId: char.id } })}
              >
                <View style={styles.itemRow}>
                  <View style={styles.itemAvatar}>
                    <Text style={styles.itemAvatarText}>{char.name[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{char.name}</Text>
                    <Text style={styles.itemMeta}>{[char.race, char.class].filter(Boolean).join(' · ') || t.home.noClassSet}</Text>
                  </View>
                  <Text style={[commonStyles.badge, commonStyles.badgeGold]}>{t.home.level} {char.level}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Campagnes actives */}
        {campaigns.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>{t.home.activeCampaigns}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CampaignsTab')}>
                <Text style={styles.seeAll}>{t.home.seeAll}</Text>
              </TouchableOpacity>
            </View>
            {campaigns.slice(0, 3).map(camp => (
              <TouchableOpacity
                key={camp.id}
                style={commonStyles.card}
                onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignDetail', params: { campaignId: camp.id } })}
              >
                <View style={styles.itemRow}>
                  <View style={[styles.itemAvatar, { backgroundColor: 'rgba(120,90,24,0.22)' }]}>
                    <Text style={[styles.itemAvatarText, { color: colors.gold2 }]}>{camp.name[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.itemName}>{camp.name}</Text>
                    <Text style={styles.itemMeta}>
                      {camp.my_role === 'game_master' ? t.home.gm : t.home.playerRole}
                      {camp.description ? ' · ' + camp.description.slice(0, 35) : ''}
                    </Text>
                  </View>
                  <Text style={[commonStyles.badge, camp.my_role === 'game_master' ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
                    {camp.my_role === 'game_master' ? t.campaigns.gm : t.campaigns.player}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* État vide */}
        {characters.length === 0 && campaigns.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 36, marginTop: 16 }]}>
            <Text style={{ fontSize: 36, marginBottom: 12 }}>📜</Text>
            <Text style={[commonStyles.bodyText, { textAlign: 'center', color: colors.muted, marginBottom: 16, lineHeight: 22 }]}>
              {t.home.emptyChronicles}
            </Text>
            <TouchableOpacity style={commonStyles.goldCta} onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignForm' })}>
              <Text style={commonStyles.goldCtaText}>{t.home.createFirstCampaign}</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 },
  welcome:  { fontFamily: typography.body, fontSize: 13, color: colors.muted },
  username: { fontFamily: typography.title, fontSize: 20, color: colors.parchment, fontWeight: '700', marginTop: 2 },

  premiumBtn: {
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 99,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: 'rgba(180,140,60,0.06)',
  },
  premiumBtnText: {
    fontFamily: typography.title,
    fontSize: 9,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum:  { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  statLab:  { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.7 },
  statDiv:  { width: 1, backgroundColor: colors.border, marginVertical: 8 },

  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  actionIcon: { fontSize: 15, color: colors.gold },
  actionText: { fontFamily: typography.title, fontSize: 11, color: colors.parchment, textTransform: 'uppercase', letterSpacing: 0.7 },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  seeAll: { fontFamily: typography.body, fontSize: 13, color: colors.gold },

  itemRow:        { flexDirection: 'row', alignItems: 'center', gap: 12 },
  itemAvatar:     { width: 40, height: 40, borderRadius: 10, backgroundColor: 'rgba(120,24,40,0.20)', alignItems: 'center', justifyContent: 'center' },
  itemAvatarText: { fontFamily: typography.title, fontSize: 17, color: colors.crimson2, fontWeight: '700' },
  itemName:       { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700' },
  itemMeta:       { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },
});
