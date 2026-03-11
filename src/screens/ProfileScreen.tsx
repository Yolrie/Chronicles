// src/screens/ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { colors, commonStyles, typography } from '../styles/common';

const ProfileScreen: React.FC = () => {
  const { profile, loading, signOut, updateProfile } = useAuthStore();
  const { characters } = useCharactersStore();
  const { campaigns } = useCampaignsStore();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [role, setRole] = useState<'player' | 'game_master' | 'both'>(profile?.role ?? 'player');
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    if (!username.trim()) { Alert.alert('Required', 'Username cannot be empty.'); return; }
    setSaving(true);
    await updateProfile({ username: username.trim(), role });
    setSaving(false);
    setEditMode(false);
  }

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: signOut },
    ]);
  }

  const gmCampaigns = campaigns.filter(c => c.my_role === 'game_master').length;
  const playerCampaigns = campaigns.filter(c => c.my_role === 'player').length;

  const ROLE_LABELS: Record<string, string> = {
    player: 'Player',
    game_master: 'Game Master',
    both: 'Player & GM',
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Avatar & name */}
        <View style={styles.profileBlock}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>
              {profile?.username?.[0]?.toUpperCase() ?? '?'}
            </Text>
          </View>
          {!editMode ? (
            <>
              <Text style={styles.displayName}>{profile?.username ?? 'Adventurer'}</Text>
              <Text style={[commonStyles.badge, commonStyles.badgePurple, { alignSelf: 'center', marginTop: 6 }]}>
                {ROLE_LABELS[profile?.role ?? 'player']}
              </Text>
            </>
          ) : null}
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{characters.length}</Text>
            <Text style={styles.statLab}>Heroes</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{gmCampaigns}</Text>
            <Text style={styles.statLab}>GM'd</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCard}>
            <Text style={styles.statNum}>{playerCampaigns}</Text>
            <Text style={styles.statLab}>Played</Text>
          </View>
        </View>

        {/* Edit form */}
        <View style={commonStyles.card}>
          <View style={styles.cardHeader}>
            <Text style={commonStyles.sectionTitle}>Profile Settings</Text>
            {!editMode && (
              <TouchableOpacity onPress={() => setEditMode(true)}>
                <Text style={styles.editBtn}>Edit</Text>
              </TouchableOpacity>
            )}
          </View>

          {editMode ? (
            <>
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Username</Text>
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
                <Text style={commonStyles.fieldLabel}>Role</Text>
                <View style={styles.roleRow}>
                  {(['player', 'game_master', 'both'] as const).map(r => (
                    <TouchableOpacity
                      key={r}
                      style={[styles.roleChip, role === r && styles.roleChipActive]}
                      onPress={() => setRole(r)}
                    >
                      <Text style={[styles.roleText, role === r && styles.roleTextActive]}>
                        {ROLE_LABELS[r]}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity style={[commonStyles.primaryCta, { flex: 1 }]} onPress={handleSave} disabled={saving}>
                  {saving ? <ActivityIndicator color="#fce8e8" /> : <Text style={commonStyles.primaryCtaText}>Save</Text>}
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.ghostButton} onPress={() => {
                  setEditMode(false);
                  setUsername(profile?.username ?? '');
                  setRole(profile?.role ?? 'player');
                }}>
                  <Text style={commonStyles.ghostButtonText}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Username</Text>
                <Text style={styles.infoValue}>{profile?.username ?? '—'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Role</Text>
                <Text style={styles.infoValue}>{ROLE_LABELS[profile?.role ?? 'player']}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.infoLabel}>Member since</Text>
                <Text style={styles.infoValue}>
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : '—'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* About section */}
        <View style={commonStyles.card}>
          <Text style={commonStyles.sectionTitle}>About Chronicles</Text>
          <Text style={[commonStyles.bodyText, { color: colors.muted, lineHeight: 20, marginTop: 8 }]}>
            Chronicles is your tabletop RPG companion. Track your heroes, manage campaigns, and log your adventures — all synced across devices.
          </Text>
          <Text style={[commonStyles.mutedText, { marginTop: 10 }]}>Version 2.0.0</Text>
        </View>

        {/* Sign out */}
        <TouchableOpacity
          style={[commonStyles.dangerButton, { marginTop: 8, alignItems: 'center' }]}
          onPress={handleSignOut}
        >
          <Text style={commonStyles.dangerButtonText}>Sign Out</Text>
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
    backgroundColor: 'rgba(201,152,58,0.1)',
    borderWidth: 2, borderColor: colors.gold2,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarLetter: { fontFamily: typography.display, fontSize: 32, color: colors.gold2, fontWeight: '700' },
  displayName: { fontFamily: typography.title, fontSize: 22, color: colors.parchment, fontWeight: '700', letterSpacing: 0.5 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 16,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum: { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  statLab: { fontFamily: typography.body, fontSize: 11, color: colors.muted, marginTop: 2, textTransform: 'uppercase', letterSpacing: 0.8 },
  statDiv: { width: 1, backgroundColor: colors.border, marginVertical: 8 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  editBtn: { fontFamily: typography.title, fontSize: 11, color: colors.gold, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border },
  infoLabel: { fontFamily: typography.body, fontSize: 14, color: colors.muted },
  infoValue: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '600' },
  roleRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  roleChip: {
    borderRadius: 6, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  roleChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  roleText: { fontFamily: typography.title, fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.6 },
  roleTextActive: { color: colors.gold2 },
});
