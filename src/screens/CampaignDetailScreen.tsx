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
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore, CampaignRules } from '../stores/campaignsStore';
import { useAuthStore } from '../stores/authStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { SessionLog } from '../types';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignDetail'>;
type Tab = 'players' | 'logs' | 'rulebook';

function StatusBadge({ status }: { status: SessionLog['status'] }) {
  const style = status === 'approved' ? commonStyles.badgeGreen
    : status === 'rejected' ? commonStyles.badgeCrimson
    : commonStyles.badgeGold;
  return <Text style={[commonStyles.badge, style]}>{status}</Text>;
}

// ── Onglet Règles MJ ─────────────────────────────────────────────────────────

function RulebookTab({ campaignId, isGM }: { campaignId: string; isGM: boolean }) {
  const { campaigns, updateCampaignRules } = useCampaignsStore();
  const { t } = useI18n();
  const campaign = campaigns.find(c => c.id === campaignId);
  const current = (campaign?.rules_json ?? {}) as CampaignRules;

  const [allowedRaces, setAllowedRaces] = useState((current.allowed_races ?? []).join(', '));
  const [allowedClasses, setAllowedClasses] = useState((current.allowed_classes ?? []).join(', '));
  const [statMethod, setStatMethod] = useState<CampaignRules['stat_method']>(current.stat_method ?? 'standard_array');
  const [gmNotes, setGmNotes] = useState(current.gm_notes ?? '');
  const [stages, setStages] = useState<{ name: string; description: string }[]>(current.stages ?? []);
  const [saving, setSaving] = useState(false);

  function parseList(raw: string): string[] {
    return raw.split(',').map(s => s.trim()).filter(Boolean);
  }

  async function handleSave() {
    setSaving(true);
    const rules: CampaignRules = {
      allowed_races: parseList(allowedRaces),
      allowed_classes: parseList(allowedClasses),
      stat_method: statMethod,
      gm_notes: gmNotes || undefined,
      stages: stages.filter(s => s.name.trim()),
    };
    const ok = await updateCampaignRules(campaignId, rules);
    setSaving(false);
    if (ok) Alert.alert(t.campaigns.rulesSaved);
  }

  const statMethods: { key: CampaignRules['stat_method']; label: string }[] = [
    { key: 'standard_array', label: t.campaigns.statMethodStandard },
    { key: 'point_buy', label: t.campaigns.statMethodPointBuy },
    { key: 'roll', label: t.campaigns.statMethodRoll },
  ];

  return (
    <View>
      {/* Notes MJ — visibles par tout le monde */}
      {!isGM && gmNotes ? (
        <View style={[commonStyles.card, { marginBottom: 12 }]}>
          <Text style={commonStyles.sectionTitle}>{t.campaigns.gmNotes}</Text>
          <Text style={[commonStyles.bodyText, { color: colors.muted, marginTop: 8, lineHeight: 20 }]}>{gmNotes}</Text>
        </View>
      ) : null}

      {/* Étapes — visibles par tout le monde */}
      {stages.length > 0 && (
        <View style={[commonStyles.card, { marginBottom: 12 }]}>
          <Text style={commonStyles.sectionTitle}>{t.campaigns.campaignStages}</Text>
          {stages.map((s, i) => (
            <View key={i} style={styles.stageRow}>
              <View style={styles.stageDot} />
              <View style={{ flex: 1 }}>
                <Text style={styles.stageName}>{s.name}</Text>
                {s.description ? <Text style={styles.stageDesc}>{s.description}</Text> : null}
              </View>
            </View>
          ))}
        </View>
      )}

      {/* Formulaire MJ */}
      {isGM && (
        <View>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 4 }]}>{t.campaigns.rulebookTitle}</Text>
          <Text style={[commonStyles.mutedText, { marginBottom: 16 }]}>{t.campaigns.rulebookSubtitle}</Text>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.allowedRaces}</Text>
            <TextInput
              style={commonStyles.input}
              value={allowedRaces}
              onChangeText={setAllowedRaces}
              placeholder="Humain, Elfe, Nain..."
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.allowedClasses}</Text>
            <TextInput
              style={commonStyles.input}
              value={allowedClasses}
              onChangeText={setAllowedClasses}
              placeholder="Guerrier, Magicien, Roublard..."
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.statMethod}</Text>
            <View style={styles.methodRow}>
              {statMethods.map(m => (
                <TouchableOpacity
                  key={m.key}
                  style={[styles.methodChip, statMethod === m.key && styles.methodChipActive]}
                  onPress={() => setStatMethod(m.key)}
                >
                  <Text style={[styles.methodText, statMethod === m.key && styles.methodTextActive]}>{m.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.gmNotes}</Text>
            <TextInput
              style={[commonStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
              value={gmNotes}
              onChangeText={setGmNotes}
              placeholder="Notes visibles par les joueurs..."
              placeholderTextColor={colors.muted}
              multiline
            />
          </View>

          {/* Étapes */}
          <Text style={commonStyles.fieldLabel}>{t.campaigns.campaignStages}</Text>
          {stages.map((s, i) => (
            <View key={i} style={styles.stageEditor}>
              <TextInput
                style={[commonStyles.input, { marginBottom: 6 }]}
                value={s.name}
                onChangeText={v => setStages(prev => prev.map((st, idx) => idx === i ? { ...st, name: v } : st))}
                placeholder={t.campaigns.stageName}
                placeholderTextColor={colors.muted}
              />
              <TextInput
                style={[commonStyles.input, { minHeight: 56, textAlignVertical: 'top', marginBottom: 4 }]}
                value={s.description}
                onChangeText={v => setStages(prev => prev.map((st, idx) => idx === i ? { ...st, description: v } : st))}
                placeholder={t.campaigns.stageDesc}
                placeholderTextColor={colors.muted}
                multiline
              />
              <TouchableOpacity onPress={() => setStages(prev => prev.filter((_, idx) => idx !== i))}>
                <Text style={[commonStyles.dangerButtonText, { textAlign: 'right' }]}>✕ Supprimer</Text>
              </TouchableOpacity>
            </View>
          ))}
          <TouchableOpacity
            style={[commonStyles.ghostButton, { marginBottom: 12 }]}
            onPress={() => setStages(prev => [...prev, { name: '', description: '' }])}
          >
            <Text style={commonStyles.ghostButtonText}>{t.campaigns.addStage}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[commonStyles.goldCta, saving && { opacity: 0.6 }]}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? <ActivityIndicator color="#1a0e00" /> : (
              <Text style={commonStyles.goldCtaText}>{t.campaigns.saveRules}</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {!isGM && stages.length === 0 && !gmNotes && (
        <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
          <Text style={[commonStyles.mutedText, { textAlign: 'center' }]}>
            Le Maître du Jeu n'a pas encore défini de règles pour cette campagne.
          </Text>
        </View>
      )}
    </View>
  );
}

// ── Écran principal ───────────────────────────────────────────────────────────

const CampaignDetailScreen: React.FC<Props> = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user } = useAuthStore();
  const { t } = useI18n();
  const {
    campaigns, campaignPlayers, sessionLogs,
    fetchCampaignPlayers, fetchSessionLogs,
    approveSessionLog, rejectSessionLog,
    leaveCampaign, deleteCampaign,
  } = useCampaignsStore();

  const mainNav = useNavigation<any>();
  const campaign = campaigns.find(c => c.id === campaignId);
  const isGM = campaign?.my_role === 'game_master';

  const [refreshing, setRefreshing] = useState(false);
  const [tab, setTab] = useState<Tab>('players');

  useLayoutEffect(() => {
    navigation.setOptions({ title: campaign?.name ?? '' });
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
    Alert.alert(t.campaigns.leaveConfirm, '', [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.campaigns.leave, style: 'destructive', onPress: async () => { await leaveCampaign(campaignId); navigation.goBack(); } },
    ]);
  }

  function handleDelete() {
    Alert.alert(t.campaigns.archiveConfirm, '', [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.campaigns.archive, style: 'destructive', onPress: async () => { await deleteCampaign(campaignId); navigation.goBack(); } },
    ]);
  }

  if (!campaign) {
    return <View style={styles.center}><ActivityIndicator color={colors.gold2} /></View>;
  }

  const pendingLogs = sessionLogs.filter(l => l.status === 'pending').length;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />}
      >
        {/* Hero card */}
        <View style={styles.heroCard}>
          <View style={styles.heroAvatar}>
            <Text style={styles.heroAvatarText}>{campaign.name[0]?.toUpperCase()}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.heroName}>{campaign.name}</Text>
            {campaign.description ? <Text style={styles.heroDesc}>{campaign.description}</Text> : null}
            <View style={styles.heroMeta}>
              <Text style={[commonStyles.badge, isGM ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
                {isGM ? t.campaigns.gmRole : t.campaigns.playerRole}
              </Text>
              <Text style={styles.inviteCode}>{t.campaigns.inviteCodeLabel} : {campaign.invite_code}</Text>
            </View>
          </View>
        </View>

        {/* Bouton planifier une session (GM uniquement) */}
        {isGM && (
          <TouchableOpacity
            style={[commonStyles.goldCta, { marginBottom: 10 }]}
            onPress={() => navigation.navigate('SessionSchedule', { campaignId })}
          >
            <Text style={commonStyles.goldCtaText}>📅 {t.sessions.scheduleTitle}</Text>
          </TouchableOpacity>
        )}

        {/* Bouton créer un personnage (joueur dans la campagne) */}
        {!isGM && (
          <TouchableOpacity
            style={[commonStyles.primaryCta, { marginBottom: 10 }]}
            onPress={() => mainNav.navigate('CharactersTab', {
              screen: 'CharacterForm',
              params: { campaignId },
            })}
          >
            <Text style={commonStyles.primaryCtaText}>{t.campaigns.createCharacterForCampaign}</Text>
          </TouchableOpacity>
        )}

        {/* Bouton log session */}
        {!isGM && (
          <TouchableOpacity
            style={[commonStyles.ghostButton, { marginBottom: 16 }]}
            onPress={() => navigation.navigate('SessionLogForm', { campaignId })}
          >
            <Text style={commonStyles.ghostButtonText}>+ {t.sessionLog.logSession}</Text>
          </TouchableOpacity>
        )}

        {/* Tabs */}
        <View style={styles.tabBar}>
          {(['players', 'logs', 'rulebook'] as Tab[]).map(tb => {
            const label = tb === 'players' ? t.campaigns.players(campaignPlayers.length)
              : tb === 'logs' ? t.campaigns.sessionLogs(sessionLogs.length)
              : t.campaigns.rulebook;
            const hasBadge = tb === 'logs' && isGM && pendingLogs > 0;
            return (
              <TouchableOpacity key={tb} style={[styles.tabItem, tab === tb && styles.tabItemActive]} onPress={() => setTab(tb)}>
                <View style={styles.tabRow}>
                  <Text style={[styles.tabText, tab === tb && styles.tabTextActive]}>{label}</Text>
                  {hasBadge && <View style={styles.badge}><Text style={styles.badgeText}>{pendingLogs}</Text></View>}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Joueurs ── */}
        {tab === 'players' && (
          <View>
            {campaignPlayers.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={[commonStyles.mutedText, { textAlign: 'center' }]}>
                  {t.campaigns.noPlayers}{'\n'}{campaign.invite_code}
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
                      <Text style={styles.playerName}>{cp.player?.username ?? 'Inconnu'}</Text>
                      {cp.character && (
                        <Text style={styles.playerChar}>
                          {cp.character.name} · {[cp.character.race, cp.character.class].filter(Boolean).join(' ')} · Niv {cp.character.level}
                        </Text>
                      )}
                    </View>
                    {cp.player_id === campaign.game_master_id && (
                      <Text style={[commonStyles.badge, commonStyles.badgePurple]}>{t.campaigns.gm}</Text>
                    )}
                  </View>
                </View>
              ))
            )}
          </View>
        )}

        {/* ── Journaux ── */}
        {tab === 'logs' && (
          <View>
            {sessionLogs.length === 0 ? (
              <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 24 }]}>
                <Text style={[commonStyles.mutedText, { textAlign: 'center' }]}>{t.campaigns.noLogs}</Text>
              </View>
            ) : (
              sessionLogs.map(log => (
                <View key={log.id} style={commonStyles.card}>
                  <View style={styles.logHeader}>
                    <Text style={styles.logDate}>{log.session_date}</Text>
                    <StatusBadge status={log.status} />
                  </View>
                  <Text style={styles.logChar}>{log.character?.name ?? 'Personnage inconnu'}</Text>
                  <View style={styles.logStats}>
                    {log.xp_gained > 0 && <Text style={styles.logStat}>+{log.xp_gained} XP</Text>}
                    {log.gold_changed !== 0 && (
                      <Text style={[styles.logStat, { color: log.gold_changed > 0 ? '#70c090' : '#e07070' }]}>
                        {log.gold_changed > 0 ? '+' : ''}{log.gold_changed} PO
                      </Text>
                    )}
                    {log.hp_current !== undefined && <Text style={styles.logStat}>PV: {log.hp_current}</Text>}
                  </View>
                  {log.notes ? <Text style={styles.logNotes} numberOfLines={2}>{log.notes}</Text> : null}
                  {isGM && log.status === 'pending' && (
                    <View style={styles.logActions}>
                      <TouchableOpacity style={styles.approveBtn} onPress={() => approveSessionLog(log.id)}>
                        <Text style={styles.approveBtnText}>{t.campaigns.approve}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.rejectBtn} onPress={() => rejectSessionLog(log.id)}>
                        <Text style={styles.rejectBtnText}>{t.campaigns.reject}</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              ))
            )}
          </View>
        )}

        {/* ── Règles MJ ── */}
        {tab === 'rulebook' && (
          <RulebookTab campaignId={campaignId} isGM={isGM} />
        )}

        {/* Actions bas de page */}
        {isGM ? (
          <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 24, alignItems: 'center' }]} onPress={handleDelete}>
            <Text style={commonStyles.dangerButtonText}>{t.campaigns.archiveCampaign}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[commonStyles.dangerButton, { marginTop: 24, alignItems: 'center' }]} onPress={handleLeave}>
            <Text style={commonStyles.dangerButtonText}>{t.campaigns.leaveCampaign}</Text>
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
    padding: 16, marginBottom: 14,
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
  heroMeta: { flexDirection: 'row', alignItems: 'center', gap: 12, flexWrap: 'wrap' },
  inviteCode: { fontFamily: typography.title, fontSize: 11, color: colors.gold2, letterSpacing: 1 },
  tabBar: {
    flexDirection: 'row', backgroundColor: colors.deep,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    overflow: 'hidden', marginBottom: 14,
  },
  tabItem: { flex: 1, paddingVertical: 11, alignItems: 'center' },
  tabItemActive: { borderBottomWidth: 2, borderBottomColor: colors.gold2 },
  tabRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  tabText: { fontFamily: typography.title, fontSize: 9, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  tabTextActive: { color: colors.gold2 },
  badge: { backgroundColor: colors.crimson2, borderRadius: 10, minWidth: 16, height: 16, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 4 },
  badgeText: { fontFamily: typography.title, fontSize: 8, color: '#fff', fontWeight: '700' },
  playerRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  playerAvatar: { width: 38, height: 38, borderRadius: 10, backgroundColor: 'rgba(80,20,120,0.2)', alignItems: 'center', justifyContent: 'center' },
  playerAvatarText: { fontFamily: typography.title, fontSize: 16, color: '#b080e0', fontWeight: '700' },
  playerName: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700' },
  playerChar: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },
  logHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 },
  logDate: { fontFamily: typography.title, fontSize: 11, color: colors.muted, letterSpacing: 0.5 },
  logChar: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700', marginBottom: 6 },
  logStats: { flexDirection: 'row', gap: 10, marginBottom: 4, flexWrap: 'wrap' },
  logStat: { fontFamily: typography.body, fontSize: 12, color: colors.gold2 },
  logNotes: { fontFamily: typography.body, fontSize: 12, color: colors.muted, fontStyle: 'italic', marginTop: 4 },
  logActions: { flexDirection: 'row', gap: 8, marginTop: 10 },
  approveBtn: { flex: 1, borderRadius: 6, paddingVertical: 8, alignItems: 'center', backgroundColor: 'rgba(20,80,40,0.2)', borderWidth: 1, borderColor: 'rgba(50,160,80,0.4)' },
  approveBtnText: { fontFamily: typography.title, fontSize: 10, color: '#70c090', textTransform: 'uppercase', letterSpacing: 0.8 },
  rejectBtn: { flex: 1, borderRadius: 6, paddingVertical: 8, alignItems: 'center', backgroundColor: 'rgba(139,26,42,0.15)', borderWidth: 1, borderColor: 'rgba(196,40,64,0.4)' },
  rejectBtnText: { fontFamily: typography.title, fontSize: 10, color: '#e07070', textTransform: 'uppercase', letterSpacing: 0.8 },
  // Rulebook
  methodRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  methodChip: { borderRadius: 6, borderWidth: 1, borderColor: colors.border2, paddingHorizontal: 10, paddingVertical: 7, backgroundColor: 'rgba(255,255,255,0.02)' },
  methodChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  methodText: { fontFamily: typography.body, fontSize: 12, color: colors.muted },
  methodTextActive: { color: colors.gold2 },
  stageEditor: { backgroundColor: colors.deep, borderRadius: 8, borderWidth: 1, borderColor: colors.border, padding: 12, marginBottom: 10 },
  stageRow: { flexDirection: 'row', gap: 10, paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: colors.border },
  stageDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: colors.gold2, marginTop: 6 },
  stageName: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700' },
  stageDesc: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginTop: 2 },
});
