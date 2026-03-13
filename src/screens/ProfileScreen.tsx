// src/screens/ProfileScreen.tsx

import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  StyleSheet, ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import { useAuthStore } from '../stores/authStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { Locale } from '../i18n/translations';
import { colors, commonStyles, typography } from '../styles/common';
import { useChroniclesAlert } from '../components/AlertProvider';

const ProfileScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const { profile, saving, signOut, updateProfile, uploadAvatar } = useAuthStore();
  const { characters } = useCharactersStore();
  const { campaigns } = useCampaignsStore();
  const { t, locale, setLocale } = useI18n();
  const { showAlert } = useChroniclesAlert();

  const [editMode, setEditMode] = useState(false);
  const [username, setUsername] = useState(profile?.username ?? '');
  const [role, setRole] = useState<'player' | 'game_master' | 'both'>(profile?.role ?? 'player');

  async function handleSave() {
    if (!username.trim()) {
      showAlert({ title: t.common.required, message: t.profile.username });
      return;
    }
    const ok = await updateProfile({ username: username.trim(), role });
    if (ok) setEditMode(false);
  }

  async function handlePickAvatar() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      showAlert({ title: t.profile.permissionNeeded, message: t.profile.photoPermission });
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.75,
    });
    if (!result.canceled && result.assets[0]) {
      await uploadAvatar(result.assets[0].uri);
    }
  }

  function handleSignOut() {
    showAlert({
      title: t.profile.signOut,
      message: t.profile.signOutConfirm,
      icon: '🚪',
      buttons: [
        { text: t.profile.cancel, style: 'cancel' },
        { text: t.profile.signOut, style: 'destructive', onPress: signOut },
      ],
    });
  }

  const gmCampaigns     = campaigns.filter(c => c.my_role === 'game_master').length;
  const playerCampaigns = campaigns.filter(c => c.my_role === 'player').length;

  const ROLES: { key: 'player' | 'game_master' | 'both'; label: string }[] = [
    { key: 'player',      label: t.profile.roles.player },
    { key: 'game_master', label: t.profile.roles.game_master },
    { key: 'both',        label: t.profile.roles.both },
  ];

  const LANGS: { key: Locale; label: string }[] = [
    { key: 'fr', label: t.profile.french },
    { key: 'en', label: t.profile.english },
  ];

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Avatar section ─────────────────────────────────────────────── */}
        <View style={styles.profileBlock}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickAvatar} activeOpacity={0.8}>
            {profile?.avatar_url ? (
              <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarLetter}>
                  {profile?.username?.[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
            )}
            <View style={styles.avatarCameraBtn}>
              {saving ? (
                <ActivityIndicator size="small" color={colors.parchment} />
              ) : (
                <Text style={styles.avatarCameraIcon}>📷</Text>
              )}
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{profile?.username ?? 'Adventurer'}</Text>
          <Text style={[commonStyles.badge, commonStyles.badgePurple, { alignSelf: 'center', marginTop: 6 }]}>
            {t.profile.roles[profile?.role ?? 'player']}
          </Text>
        </View>

        {/* ── Stats bar ──────────────────────────────────────────────────── */}
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

        {/* ── Profile settings card ──────────────────────────────────────── */}
        <View style={styles.settingsCard}>
          <View style={styles.cardHeader}>
            <Text style={commonStyles.sectionTitle}>◆ {t.profile.settings}</Text>
            {!editMode && (
              <TouchableOpacity
                onPress={() => {
                  setEditMode(true);
                  setUsername(profile?.username ?? '');
                  setRole(profile?.role ?? 'player');
                }}
              >
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
                  placeholderTextColor={colors.muted}
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
                      <Text style={[styles.chipText, role === r.key && styles.chipTextActive]}>
                        {r.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <TouchableOpacity
                  style={[commonStyles.primaryCta, { flex: 1 }, saving && { opacity: 0.6 }]}
                  onPress={handleSave}
                  disabled={saving}
                >
                  {saving
                    ? <ActivityIndicator color={colors.parchment} />
                    : <Text style={commonStyles.primaryCtaText}>{t.profile.save}</Text>
                  }
                </TouchableOpacity>
                <TouchableOpacity style={commonStyles.ghostButton} onPress={() => setEditMode(false)}>
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
                  {profile?.created_at
                    ? new Date(profile.created_at).toLocaleDateString('fr-FR')
                    : '—'}
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* ── Language card ──────────────────────────────────────────────── */}
        <View style={styles.settingsCard}>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 14 }]}>
            ◆ {t.profile.language}
          </Text>
          <View style={styles.chipRow}>
            {LANGS.map(l => (
              <TouchableOpacity
                key={l.key}
                style={[styles.chip, locale === l.key && styles.chipActive]}
                onPress={() => setLocale(l.key)}
              >
                <Text style={[styles.chipText, locale === l.key && styles.chipTextActive]}>
                  {l.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Navigation cards ───────────────────────────────────────────── */}
        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate('Badges')}
          activeOpacity={0.75}
        >
          <Text style={styles.navCardIcon}>🏆</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.navCardTitle}>{t.profile.trophies}</Text>
          </View>
          <Text style={styles.navCardArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.navCard}
          onPress={() => navigation.navigate('Friends')}
          activeOpacity={0.75}
        >
          <Text style={styles.navCardIcon}>⚔️</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.navCardTitle}>{t.profile.companions}</Text>
          </View>
          <Text style={styles.navCardArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.navCard, styles.premiumNavCard]}
          onPress={() => navigation.navigate('Premium')}
          activeOpacity={0.75}
        >
          <Text style={[styles.navCardIcon, { color: colors.gold3 }]}>✦</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navCardTitle, { color: colors.gold3 }]}>{t.nav.premium}</Text>
            <Text style={[commonStyles.mutedText, { fontSize: 12, marginTop: 1 }]}>
              {t.premium.subtitle}
            </Text>
          </View>
          <Text style={[styles.navCardArrow, { color: colors.gold3 }]}>›</Text>
        </TouchableOpacity>

        {/* ── About card ─────────────────────────────────────────────────── */}
        <View style={styles.settingsCard}>
          <Text style={[commonStyles.sectionTitle, { marginBottom: 10 }]}>
            ◆ {t.profile.about}
          </Text>
          <Text style={[commonStyles.bodyText, { color: colors.muted, lineHeight: 22, fontSize: 14 }]}>
            {t.profile.appDescription}
          </Text>
          <Text style={[commonStyles.mutedText, { marginTop: 10, marginBottom: 14, fontSize: 12 }]}>
            {t.profile.version} 2.1.0
          </Text>
          <View style={styles.legalRow}>
            <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
              <Text style={styles.legalLink}>{t.profile.privacyPolicy}</Text>
            </TouchableOpacity>
            <Text style={styles.legalDot}>·</Text>
            <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
              <Text style={styles.legalLink}>{t.profile.terms}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Sign out ───────────────────────────────────────────────────── */}
        <TouchableOpacity
          style={[commonStyles.dangerButton, styles.signOutBtn]}
          onPress={handleSignOut}
        >
          <Text style={commonStyles.dangerButtonText}>{t.profile.signOut}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 28, paddingBottom: 48 },

  // ── Avatar ────────────────────────────────────────────────────────────────
  profileBlock: { alignItems: 'center', marginBottom: 24 },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatarImg: {
    width: 96, height: 96, borderRadius: 48,
    borderWidth: 2, borderColor: colors.border3,
  },
  avatarFallback: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: 'rgba(180,140,60,0.08)',
    borderWidth: 2, borderColor: colors.border3,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: typography.display,
    fontSize: 36,
    color: colors.gold2,
    fontWeight: '700',
  },
  avatarCameraBtn: {
    position: 'absolute', bottom: 0, right: -2,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.deep,
    borderWidth: 1, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarCameraIcon: { fontSize: 14 },

  displayName: {
    fontFamily: typography.display,
    fontSize: 22,
    color: colors.gold2,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 2,
  },

  // ── Stats bar ────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  statCard: { flex: 1, alignItems: 'center', paddingVertical: 18 },
  statNum: {
    fontFamily: typography.title,
    fontSize: 24,
    color: colors.gold2,
    fontWeight: '700',
  },
  statLab: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.muted,
    marginTop: 3,
    textTransform: 'uppercase',
    letterSpacing: 0.9,
  },
  statDiv: { width: 1, backgroundColor: colors.border, marginVertical: 10 },

  // ── Settings / language card ─────────────────────────────────────────────
  settingsCard: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  editBtn: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.0,
  },

  // Info rows (non-edit mode)
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.muted,
  },
  infoValue: {
    fontFamily: typography.title,
    fontSize: 13,
    color: colors.parchment,
    fontWeight: '600',
  },

  // Chips (role / language)
  chipRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 14,
    paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chipActive:    { borderColor: colors.gold2, backgroundColor: 'rgba(201,168,76,0.10)' },
  chipText:      {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  chipTextActive: { color: colors.gold2 },

  // ── Navigation cards ─────────────────────────────────────────────────────
  navCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 3,
  },
  premiumNavCard: {
    borderColor: colors.border2,
    backgroundColor: 'rgba(14,31,46,0.9)',
  },
  navCardIcon:   { fontSize: 22 },
  navCardTitle:  {
    fontFamily: typography.title,
    fontSize: 13,
    color: colors.parchment,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  navCardArrow:  { fontSize: 20, color: colors.gold2 },

  // ── Legal row ────────────────────────────────────────────────────────────
  legalRow:  { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legalLink: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.gold,
    textDecorationLine: 'underline',
  },
  legalDot:  { color: colors.muted, fontSize: 13 },

  // ── Sign out ─────────────────────────────────────────────────────────────
  signOutBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
});
