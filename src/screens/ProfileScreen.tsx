// src/screens/ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView, Alert, StyleSheet, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { Locale } from '../i18n/translations';
import { colors, commonStyles, typography } from '../styles/common';

const ProfileScreen: React.FC = () => {
  const { profile, loading, signOut, updateProfile } = useAuthStore();
  const { characters } = useCharactersStore();
  const { campaigns } = useCampaignsStore();
  const { t, locale, setLocale } = useI18n();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [role, setRole] = useState<'player' | 'game_master' | 'both'>(profile?.role ?? 'player');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!username.trim()) { Alert.alert(t.common.required, t.profile.username); return; }
    setSaving(true);
    await updateProfile({ username: username.trim(), role });
    setSaving(false);
    setEditMode(false);
  }

  function handleSignOut() {
    Alert.alert(t.profile.signOut, t.profile.signOutConfirm, [
      { text: t.common.cancel, style: 'cancel' },
      { text: t.profile.signOut, style: 'destructive', onPress: signOut },
    ]);
  }

  const gmCampaigns = campaigns.filter(c => c.my_role === 'game_master').length;
  const playerCampaigns = campaigns.filter(c => c.my_role === 'player').length;

  const ROLES: { key: 'player' | 'game_master' | 'both'; label: string }[] = [
    { key: 'player', label: t.profile.roles.player },
    { key: 'game_master', label: t.profile.roles.game_master },
    { key: 'both', label: t.profile.roles.both },
  ];

  const LANGS: { key: Locale; label: string }[] = [
    { key: 'fr', label: t.profile.french },
    { key: 'en', label: t.profile.english },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar */}
        <View style={styles.profileBlock}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{profile?.username?.[0]?.toUpperCase() ?? '?'}</Text>
          </View>
          {!editMode && (
            <>
              <Text style={styles.displayName}>{profile?.username ?? 'Adventurer'}</Text>
              <Text style={[commonStyles.badge, commonStyles.badgePurple, { alignSelf: 'center', marginTop: 6 }]}>
                {t.profile.roles[profile?.role ?? 'player']}
              </Text>
            </>
          )}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{characters.length}</Text>
            <Text style={styles.statLab}>{t.profile.heroes}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{gmCampaigns}</Text>
            <Text style={styles.statLab}>{t.profile.gmd}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{playerCampaigns}</Text>
            <Text style={styles.statLab}>{t.profile.played}</Text>
          </View>
        </View>

        {/* Edition profil */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={commonStyles.sectionTitle}>{t.profile.settings}</Text>
            {!editMode && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.editBtn}>{t.profile.edit}</Text>
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <>
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.profile.username}</Text>
                <TextInput
                  style={commonStyles.input}
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                  maxLength={24}
                  autoCorrect={false}
                />
              </View>
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.profile.role}</Text>
                <View style={styles.chipRow}>
                  {ROLES.map(r => (
                    <TouchableOpacity
                      key={r.key}
                      style={[styles.chip, role === r.key && styles.chipActive]}
                      onPress={() => setRole(r.key)}
                    >
                      <Text style={[styles.chipText, role === r.key && styles.chipTextActive]}>{r.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[commonStyles.primaryCta, { flex: 1 }]} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fce8e8" /> : <Text style={commonStyles.primaryCtaText}>{t.profile.save}</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.ghostButton} onPress={() => {
                  setEditMode(false);
                  setUsername(profile?.username ?? '');
                  setRole(profile?.role ?? 'player');
                }}>
                  <Text style={commonStyles.ghostButtonText}>{t.profile.cancel}</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.profile.username}</Text>
                <Text style={styles.infoValue}>{profile?.username ?? '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>{t.profile.role}</Text>
                <Text style={styles.infoValue}>{t.profile.roles[profile?.role ?? 'player']}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>{t.profile.memberSince}</Text>
                <Text style={styles.infoValue}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString('fr-FR') : '—'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Langue */}
        <View style={commonStyles.card}>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 12 }]}>{t.profile.language}</Text>
          <View style={styles.chipRow}>
            {LANGS.map(l => (
              <TouchableOpacity
                key={l.key}
                style={[styles.chip, locale === l.key && styles.chipActive]}
                onPress={() => setLocale(l.key)}
              >
                <Text style={[styles.chipText, locale === l.key && styles.chipTextActive]}>{l.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* À propos */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.sectionTitle}>{t.profile.about}</Text>
          <Text style={[commonStyles.bodyText, { color: colors.muted, lineHeight: 20, marginTop: 8 }]}>
            {t.profile.appDescription}
          </Text>
          <Text style={[commonStyles.mutedText, { marginTop: 10 }]}>{t.profile.version} 2.0.0</Text>
        </View>

        <TouchableOpacity style={[commonStyles.dangerButton, { alignItems: 'center', marginTop: 8 }]} onPress={handleSignOut}>
          <Text style={commonStyles.dangerButtonText}>{t.profile.signOut}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 24, paddingBottom: 40 },
  profileBlock: { alignItems: 'center', marginBottom: 24 },
  avatarCircle: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: 'rgba(201,152,58,0.1)', borderWidth: 2, borderColor: colors.gold2,
    alignItems: 'center', justifyContent: 'center', marginBottom: 12,
  },
  avatarLetter: { fontFamily: typography.display, fontSize: 32, color: colors.gold2, fontWeight: '700' },
  displayName: { fontFamily: typography.title, fontSize: 22, color: colors.parchment, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: { flexDirection: 'row', backgroundColor: colors.deep, borderRadius: 10, borderWidth: 1, borderColor: colors.border, overflow: 'hidden', marginBottom: 16 },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum: { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  statLab: { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8 },
  statDiv: { width: 1, backgroundColor: colors.border, marginVertical: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editBtn: { fontFamily: typography.title, fontSize: 11, color: colors.gold, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontFamily: typography.body, fontSize: 14, color: colors.muted },
  infoValue: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '600' },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: { borderRadius: 6, borderWidth: 1, borderColor: colors.border2, paddingHorizontal: 12, paddingVertical: 8, backgroundColor: 'rgba(255,255,255,0.02)' },
  chipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  chipText: { fontFamily: typography.title, fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  chipTextActive: { color: colors.gold2 },
});
