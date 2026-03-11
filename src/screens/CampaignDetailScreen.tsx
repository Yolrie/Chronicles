// src/screens/CampaignDetailScreen.tsx

import React, { useEffect, useLayoutEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useAuthStore } from '../stores/authStore';
import { colors, commonStyles, typography } from '../styles/common';
import { SessionLog } from '../types';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignDetail'>;

function StatusBadge({ status }: { status: SessionLog['status'] }) {
  const style = status === 'approved' ? commonStyles.badgeGreen
    : status === 'rejected' ? commonStyles.badgeCrimson
    : commonStyles.badgeGold;
  return <Text style={[commonStyles.badge, style]}>{status}</Text>;
}

const CampaignDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user } = useAuthStore();
  const {
    campaigns, campaignPlayers, sessionLogs,
    fetchCampaignPlayers, fetchSessionLogs,
    approveSessionLog, rejectSessionLog,
    leaveCampaign, deleteCampaign,
  } = useCampaignsStore();

  const campaign = campaigns.find(c => c.id === campaignId);
  const isGM = campaign?.my_role === 'game_master';

  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<'players' | 'logs'>('players');

  useLayoutEffect(() => {
    navigation.setOptions({ title: campaign?.name ?? 'Campaign' });
  }, [campaign?.name]);

  useEffect(() => {
    fetchCampaignPlayers(campaignId);
    fetchSessionLogs(campaignId);
  }, [campaignId]);

  async function onRefresh() {
    setRefreshing(true);
    await Promise.all([fetchCampaignPlayers(campaignId), fetchSessionLogs(campaignId)]);
    setRefreshing(false);
  }

  function handleLeave() {
    Alert.alert('Leave campaign', 'Are you sure you want to leave this campaign?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Leave', style: 'destructive', onPress: async () => { await leaveCampaign(campaignId); navigation.goBack(); } },
    ]);
  }

  function handleDelete() {
    Alert.alert('End campaign', 'Archive this campaign? Players will lose access.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Archive', style: 'destructive', onPress: async () => { await deleteCampaign(campaignId); navigation.goBack(); } },
    ]);
  }

  if (!campaign) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold2} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* Header */}
        <View style={styles.heroCard}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>{campaign.name[0]?.toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>{campaign.name}</Text>
            {campaign.description ? <Text style={styles.heroDesc}>{campaign.description}</Text> : null}
            <View style={styles.heroMeta}>
              <Text style={[commonStyles.badge, isGM ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
                {isGM ? 'Game Master' : 'Player'}
              </Text>
              <Text style={styles.inviteCode}>Code: {campaign.invite_code}</Text>
            </View>
          </View>
        </View>

        {/* Log Session button for players */}
        {!isGM && (
          <TouchableOpacity
            style={[commonStyles.primaryCta, { marginBottom: 16 }]}
            onPress={() => navigation.navigate('SessionLogForm', { campaignId })}
          >
            <Text style={commonStyles.primaryCtaText}>+ Log Session</Text>
          </TouchableOpacity>
        )}

        {/* Tab bar */}
        <View style={styles.tabBar}>
          {(['players', 'logs'] as const).map(t => (
            <TouchableOpacity key={t} style={[styles.tabItem, tab === t && styles.tabItemActive]} onPress={() => setTab(t)}>
              <Text style={[styles.tabText, tab === t && styles.tabTextActive]}>
                {t === 'players' ? `Players (${campaignPlayers.length})` : `Session Logs (${sessionLogs.length})`}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Players tab */}
        {tab === 'players' && (
          <View>
            {campaignPlayers.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={[commonStyles.mutedText, { textAlign: 'center' }]}>
                  No players yet. Share the invite code: {campaign.invite_code}
                </Text>
              </View>
            ) : (
              campaignPlayers.map(cp => (
                <View key={cp.id} style={commonStyles.card}>
                  <View style={styles.playerRow}>
                    <View style={styles.playerAvatar}>
                      <Text style={styles.playerAvatarText}>{cp.player?.username?.[0]?.toUpperCase() ?? '?'}</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.playerName}>{cp.player?.username ?? 'Unknown'}</Text>
                      {cp.character && (
                        <Text style={styles.playerChar}>
                          {cp.character.name} · {cp.character.race ?? ''} {cp.character.class ?? ''} · Lv{cp.character.level}
                        </Text>
                      )}
                    </View>
                    {cp.player_id === campaign.game_master_id && (
                      <Text style={[commonStyles.badge, commonStyles.badgePurple]}>GM</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* Logs tab */}
        {tab === 'logs' && (
          <View>
            {sessionLogs.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={[commonStyles.mutedText, { textAlign: 'center' }]}>
                  No session logs yet.
                </Text>
              </View>
            ) : (
              sessionLogs.map(log => (
                <View key={log.id} style={commonStyles.card}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logDate}>{log.session_date}</Text>
                    <StatusBadge status={log.status} />
                  </View>
                  <Text style={styles.logChar}>
                    {log.character?.name ?? 'Unknown character'}
                  </Text>
                  <View style={styles.logStats}>
                    {log.xp_gained > 0 && <Text style={styles.logStat}>+{log.xp_gained} XP</Text>}
                    {log.gold_changed !== 0 && (
                      <Text style={[styles.logStat, { color: log.gold_changed > 0 ? '#70c090' : '#e07070' }]}>
                        {log.gold_changed > 0 ? '+' : ''}{log.gold_changed} GP
                      </Text>
                    )}
                    {log.hp_current !== undefined && <Text style={styles.logStat}>HP: {log.hp_current}</Text>}
                  </View>
                  {log.notes ? <Text style={styles.logNotes} numberOfLines={2}>{log.notes}</Text> : null}
                  {isGM && log.status === 'pending' && (
                    <View style={styles.logActions}>
                      <TouchableOpacity
                        style={styles.approveBtn}
                        onPress={() => approveSessionLog(log.id)}
                      >
                        <Text style={styles.approveBtnText}>Approve</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.rejectBtn}
                        onPress={() => rejectSessionLog(log.id)}
                      >
                        <Text style={styles.rejectBtnText}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* GM actions */}
        {isGM ? (
          <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 24 }]} onPress={handleDelete}>
            <Text style={commonStyles.dangerButtonText}>Archive Campaign</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 24 }]} onPress={handleLeave}>
            <Text style={commonStyles.dangerButtonText}>Leave Campaign</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default CampaignDetailScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  heroCard: {
    flexDirection: 'row', gap: 14,
    backgroundColor: colors.deep,
    borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    padding: 16, marginBottom: 16,
  },
  heroAvatar: {
    width: 56, height: 56, borderRadius: 14,
    backgroundColor: 'rgba(122,90,30,0.25)',
    borderWidth: 1, borderColor: 'rgba(201,152,58,0.3)',
    alignItems: 'center', justifyContent: 'center',
  },
  heroAvatarText: { fontFamily: typography.title, fontSize: 26, color: colors.gold2, fontWeight: '700' },
  heroName: { fontFamily: typography.title, fontSize: 16, color: colors.parchment, fontWeight: '700', marginBottom: 4 },
  heroDesc: { fontFamily: typography.body, fontSize: 13, color: colors.muted, lineHeight: 18, marginBottom: 8 },
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  inviteCode: { fontFamily: typography.title, fontSize: 11, color: colors.gold2, letterSpacing: 1 },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.deep,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', marginBottom: 14,
  },
  tabItem: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: colors.gold2 },
  tabText: { fontFamily: typography.title, fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  tabTextActive: { color: colors.gold2 },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerAvatar: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: 'rgba(80,20,120,0.2)',
    alignItems: 'center', justifyContent: 'center',
  },
  playerAvatarText: { fontFamily: typography.title, fontSize: 16, color: '#b080e0', fontWeight: '700' },
  playerName: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700' },
  playerChar: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  logDate: { fontFamily: typography.title, fontSize: 11, color: colors.muted, letterSpacing: 0.5 },
  logChar: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700', marginBottom: 6 },
  logStats: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  logStat: { fontFamily: typography.body, fontSize: 12, color: colors.gold2 },
  logNotes: { fontFamily: typography.body, fontSize: 12, color: colors.muted, fontStyle: 'italic', marginTop: 4 },
  logActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  approveBtn: {
    flex: 1, borderRadius: 6, paddingVertical: 8, alignItems: 'center',
    backgroundColor: 'rgba(20,80,40,0.2)', borderWidth: 1, borderColor: 'rgba(50,160,80,0.4)',
  },
  approveBtnText: { fontFamily: typography.title, fontSize: 10, color: '#70c090', textTransform: 'uppercase', letterSpacing: 0.8 },
  rejectBtn: {
    flex: 1, borderRadius: 6, paddingVertical: 8, alignItems: 'center',
    backgroundColor: 'rgba(139,26,42,0.15)', borderWidth: 1, borderColor: 'rgba(196,40,64,0.4)',
  },
  rejectBtnText: { fontFamily: typography.title, fontSize: 10, color: '#e07070', textTransform: 'uppercase', letterSpacing: 0.8 },
});
