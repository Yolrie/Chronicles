// src/screens/HomeScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { colors, commonStyles, typography } from '../styles/common';
import { useNavigation } from '@react-navigation/native';

const HomeScreen: React.FC = () => {
  const { profile, signOut } = useAuthStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { campaigns, fetchCampaigns } = useCampaignsStore();
  const navigation = useNavigation<any>();

  const [refreshing, setRefreshing] = React.useState(false);

  useEffect(() => {
    fetchCharacters();
    fetchCampaigns();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([fetchCharacters(), fetchCampaigns()]);
    setRefreshing(false);
  }

  const myGmCampaigns = campaigns.filter(c => c.my_role === 'game_master');
  const myPlayerCampaigns = campaigns.filter(c => c.my_role === 'player');
  const pendingLogs = 0; // placeholder

  const recentChars = characters.slice(0, 3);

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Welcome back,</Text>
            <Text style={styles.username}>{profile?.username ?? 'Adventurer'}</Text>
          </View>
          <View style={[commonStyles.badge, commonStyles.badgePurple, { alignSelf: 'flex-start' }]}>
            <Text style={[commonStyles.badge, commonStyles.badgePurple]}>
              {profile?.role === 'game_master' ? 'Game Master' : profile?.role === 'both' ? 'GM & Player' : 'Player'}
            </Text>
          </View>
        </View>

        <View style={styles.dividerLine} />

        {/* Stats row */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{characters.length}</Text>
            <Text style={styles.statLabel}>Heroes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{campaigns.length}</Text>
            <Text style={styles.statLabel}>Campaigns</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{myGmCampaigns.length}</Text>
            <Text style={styles.statLabel}>As GM</Text>
          </View>
        </View>

        {/* Quick actions */}
        <Text style={[commonStyles.sectionTitle, { marginTop: 20 }]}>Quick Actions</Text>
        <View style={styles.actionsRow}>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.crimson }]}
            onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm' })}
          >
            <Text style={styles.actionBtnIcon}>+</Text>
            <Text style={styles.actionBtnText}>New Hero</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { borderColor: colors.gold3 }]}
            onPress={() => navigation.navigate('CampaignsTab', { screen: 'CampaignForm' })}
          >
            <Text style={styles.actionBtnIcon}>⚑</Text>
            <Text style={styles.actionBtnText}>New Campaign</Text>
          </TouchableOpacity>
        </View>

        {/* Recent characters */}
        {recentChars.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Recent Heroes</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CharactersTab')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {recentChars.map(char => (
              <TouchableOpacity
                key={char.id}
                style={commonStyles.card}
                onPress={() => navigation.navigate('CharactersTab', {
                  screen: 'CharacterForm',
                  params: { characterId: char.id },
                })}
              >
                <View style={styles.charRow}>
                  <View style={styles.charAvatar}>
                    <Text style={styles.charAvatarText}>{char.name[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.charName}>{char.name}</Text>
                    <Text style={styles.charMeta}>
                      {[char.race, char.class].filter(Boolean).join(' · ') || 'No class set'}
                    </Text>
                  </View>
                  <Text style={[commonStyles.badge, commonStyles.badgeGold]}>Lv {char.level}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Active campaigns */}
        {campaigns.length > 0 && (
          <>
            <View style={styles.sectionHeader}>
              <Text style={commonStyles.sectionTitle}>Active Campaigns</Text>
              <TouchableOpacity onPress={() => navigation.navigate('CampaignsTab')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {campaigns.slice(0, 3).map(camp => (
              <TouchableOpacity
                key={camp.id}
                style={commonStyles.card}
                onPress={() => navigation.navigate('CampaignsTab', {
                  screen: 'CampaignDetail',
                  params: { campaignId: camp.id },
                })}
              >
                <View style={styles.charRow}>
                  <View style={[styles.charAvatar, { backgroundColor: 'rgba(122,90,30,0.25)' }]}>
                    <Text style={[styles.charAvatarText, { color: colors.gold2 }]}>{camp.name[0]?.toUpperCase()}</Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.charName}>{camp.name}</Text>
                    <Text style={styles.charMeta}>
                      {camp.my_role === 'game_master' ? 'Game Master' : 'Player'}
                      {camp.description ? ' · ' + camp.description.slice(0, 40) : ''}
                    </Text>
                  </View>
                  <Text style={[commonStyles.badge, camp.my_role === 'game_master' ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
                    {camp.my_role === 'game_master' ? 'GM' : 'Player'}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        )}

        {/* Empty state */}
        {characters.length === 0 && campaigns.length === 0 && (
          <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 32, marginTop: 16 }]}>
            <Text style={[commonStyles.bodyText, { textAlign: 'center', color: colors.muted, marginBottom: 16 }]}>
              Your chronicles are empty.{'\n'}Forge your first hero or join a campaign.
            </Text>
            <TouchableOpacity
              style={commonStyles.goldCta}
              onPress={() => navigation.navigate('CharactersTab', { screen: 'CharacterForm' })}
            >
              <Text style={commonStyles.goldCtaText}>Create your first hero</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  welcome: { fontFamily: typography.body, fontSize: 14, color: colors.muted },
  username: { fontFamily: typography.title, fontSize: 22, color: colors.parchment, fontWeight: '700', marginTop: 2 },
  dividerLine: { height: 1, backgroundColor: colors.border, marginVertical: 16 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNumber: { fontFamily: typography.title, fontSize: 24, color: colors.gold2, fontWeight: '700' },
  statLabel: { fontFamily: typography.body, fontSize: 11, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8 },
  statDivider: { width: 1, backgroundColor: colors.border, marginVertical: 8 },
  actionsRow: { flexDirection: 'row', gap: 10, marginBottom: 8 },
  actionBtn: {
    flex: 1,
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    paddingVertical: 16,
    alignItems: 'center',
  },
  actionBtnIcon: { fontSize: 20, color: colors.parchment, marginBottom: 4 },
  actionBtnText: { fontFamily: typography.title, fontSize: 11, color: colors.parchment, textTransform: 'uppercase', letterSpacing: 0.8 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20, marginBottom: 8 },
  seeAll: { fontFamily: typography.body, fontSize: 13, color: colors.gold },
  charRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  charAvatar: {
    width: 40, height: 40, borderRadius: 10,
    backgroundColor: 'rgba(139,26,42,0.25)',
    alignItems: 'center', justifyContent: 'center',
  },
  charAvatarText: { fontFamily: typography.title, fontSize: 18, color: colors.crimson2, fontWeight: '700' },
  charName: { fontFamily: typography.title, fontSize: 14, color: colors.parchment, fontWeight: '700' },
  charMeta: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },
});
