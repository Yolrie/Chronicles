// src/screens/ProfileScreen.tsx
// Medieval fantasy style — stone dark + parchment accents

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

// ── Corner mark decorator ────────────────────────────────────────────────────
const CornerMarks: React.FC<{ color?: string; size?: number }> = ({
  color = colors.gold2,
  size = 10,
}) => (
  <>
    {/* TL */}
    <View style={[cmk.h, { top: 0, left: 0, width: size, backgroundColor: color }]} />
    <View style={[cmk.v, { top: 0, left: 0, height: size, backgroundColor: color }]} />
    {/* TR */}
    <View style={[cmk.h, { top: 0, right: 0, width: size, backgroundColor: color }]} />
    <View style={[cmk.v, { top: 0, right: 0, height: size, backgroundColor: color }]} />
    {/* BL */}
    <View style={[cmk.h, { bottom: 0, left: 0, width: size, backgroundColor: color }]} />
    <View style={[cmk.v, { bottom: 0, left: 0, height: size, backgroundColor: color }]} />
    {/* BR */}
    <View style={[cmk.h, { bottom: 0, right: 0, width: size, backgroundColor: color }]} />
    <View style={[cmk.v, { bottom: 0, right: 0, height: size, backgroundColor: color }]} />
  </>
);
const cmk = StyleSheet.create({
  h: { position: 'absolute', height: 1.5 },
  v: { position: 'absolute', width: 1.5 },
});

// ── Divider ornamental ────────────────────────────────────────────────────────
const GoldDivider: React.FC = () => (
  <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 16, opacity: 0.5 }}>
    <View style={{ flex: 1, height: 1, backgroundColor: colors.gold }} />
    <Text style={{ fontFamily: typography.title, fontSize: 10, color: colors.gold2, marginHorizontal: 10 }}>◆</Text>
    <View style={{ flex: 1, height: 1, backgroundColor: colors.gold }} />
  </View>
);

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
      allowsEditing: false,
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

        {/* ── Stone header strip ──────────────────────────────────────── */}
        <View style={styles.pageHeader}>
          <View style={styles.pageHeaderDecor}>
            <View style={styles.headerLine} />
            <Text style={styles.pageHeaderTitle}>◆ {t.profile.settings ?? 'Profil'} ◆</Text>
            <View style={styles.headerLine} />
          </View>
        </View>

        {/* ── Avatar portrait block ───────────────────────────────────── */}
        <View style={styles.profileBlock}>
          <TouchableOpacity onPress={handlePickAvatar} activeOpacity={0.8}>
            <View style={styles.portraitFrame}>
              <CornerMarks size={12} />
              {profile?.avatar_url ? (
                <Image source={{ uri: profile.avatar_url }} style={styles.portraitImg} />
              ) : (
                <View style={styles.portraitFallback}>
                  <Text style={styles.portraitSymbol}>◉</Text>
                  <Text style={styles.portraitLetter}>
                    {profile?.username?.[0]?.toUpperCase() ?? '?'}
                  </Text>
                </View>
              )}
              {/* Camera badge */}
              <View style={styles.cameraBadge}>
                {saving
                  ? <ActivityIndicator size="small" color={colors.parchment} />
                  : <Text style={{ fontSize: 11 }}>📷</Text>
                }
              </View>
            </View>
          </TouchableOpacity>

          <Text style={styles.displayName}>{profile?.username ?? 'Adventurer'}</Text>
          <Text style={[commonStyles.badge, commonStyles.badgePurple, { alignSelf: 'center', marginTop: 6 }]}>
            {t.profile.roles[profile?.role ?? 'player']}
          </Text>
          <Text style={styles.avatarHint}>Appuyez pour changer l'avatar</Text>
        </View>

        {/* ── Stats bar ──────────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <View style={styles.statCell}>
            <Text style={styles.statNum}>{characters.length}</Text>
            <Text style={styles.statLab}>{t.profile.heroes}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCell}>
            <Text style={styles.statNum}>{gmCampaigns}</Text>
            <Text style={styles.statLab}>{t.profile.gmd}</Text>
          </View>
          <View style={styles.statDiv} />
          <View style={styles.statCell}>
            <Text style={styles.statNum}>{playerCampaigns}</Text>
            <Text style={styles.statLab}>{t.profile.played}</Text>
          </View>
        </View>

        {/* ── Settings card ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardGoldBar} />
          <View style={styles.cardInner}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>◆ {t.profile.settings}</Text>
              {!editMode && (
                <TouchableOpacity onPress={() => { setEditMode(true); setUsername(profile?.username ?? ''); setRole(profile?.role ?? 'player'); }}>
                  <Text style={styles.editBtn}>{t.profile.edit}</Text>
                </TouchableOpacity>
              )}
            </View>

            {editMode ? (
              <>
                <View style={commonStyles.fieldWrap}>
                  <Text style={commonStyles.fieldLabel}>{t.profile.username}</Text>
                  <TextInput
                    style={styles.input}
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
                        <Text style={[styles.chipText, role === r.key && styles.chipTextActive]}>{r.label}</Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TouchableOpacity style={[commonStyles.primaryCta, { flex: 1 }, saving && { opacity: 0.6 }]} onPress={handleSave} disabled={saving}>
                    {saving ? <ActivityIndicator color={colors.parchment} /> : <Text style={commonStyles.primaryCtaText}>{t.profile.save}</Text>}
                  </TouchableOpacity>
                  <TouchableOpacity style={commonStyles.ghostButton} onPress={() => setEditMode(false)}>
                    <Text style={commonStyles.ghostButtonText}>{t.profile.cancel}</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <>
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
              </>
            )}
          </View>
        </View>

        {/* ── Language card ───────────────────────────────────────────── */}
        <View style={styles.card}>
          <View style={styles.cardGoldBar} />
          <View style={styles.cardInner}>
            <Text style={[styles.cardTitle, { marginBottom: 14 }]}>◆ {t.profile.language}</Text>
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
        </View>

        <GoldDivider />

        {/* ── Navigation cards ────────────────────────────────────────── */}
        <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Badges')} activeOpacity={0.75}>
          <View style={styles.navCardIcon}><Text style={{ fontSize: 20 }}>🏆</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navCardTitle}>{t.profile.trophies}</Text>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navCard} onPress={() => navigation.navigate('Friends')} activeOpacity={0.75}>
          <View style={styles.navCardIcon}><Text style={{ fontSize: 20 }}>⚔️</Text></View>
          <View style={{ flex: 1 }}>
            <Text style={styles.navCardTitle}>{t.profile.companions}</Text>
          </View>
          <Text style={styles.navArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.navCard, styles.premiumCard]} onPress={() => navigation.navigate('Premium')} activeOpacity={0.75}>
          <View style={[styles.navCardIcon, { backgroundColor: 'rgba(201,168,76,0.12)' }]}>
            <Text style={{ fontSize: 18, color: colors.gold3 }}>✦</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.navCardTitle, { color: colors.gold3 }]}>{t.nav.premium}</Text>
            <Text style={{ fontSize: 11, color: colors.muted, marginTop: 2 }}>{t.premium.subtitle}</Text>
          </View>
          <Text style={[styles.navArrow, { color: colors.gold3 }]}>›</Text>
        </TouchableOpacity>

        {/* ── About card ──────────────────────────────────────────────── */}
        <View style={[styles.card, { marginTop: 8 }]}>
          <View style={styles.cardGoldBar} />
          <View style={styles.cardInner}>
            <Text style={[styles.cardTitle, { marginBottom: 10 }]}>◆ {t.profile.about}</Text>
            <Text style={{ color: colors.muted, fontSize: 14, lineHeight: 22 }}>{t.profile.appDescription}</Text>
            <Text style={{ color: colors.subtle, marginTop: 10, marginBottom: 14, fontSize: 12 }}>{t.profile.version} 2.1.0</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <TouchableOpacity onPress={() => navigation.navigate('PrivacyPolicy')}>
                <Text style={styles.legalLink}>{t.profile.privacyPolicy}</Text>
              </TouchableOpacity>
              <Text style={{ color: colors.muted }}>·</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Terms')}>
                <Text style={styles.legalLink}>{t.profile.terms}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Sign out ────────────────────────────────────────────────── */}
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>{t.profile.signOut}</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 52 },

  // ── Page header ──────────────────────────────────────────────────────────
  pageHeader: { marginBottom: 24 },
  pageHeaderDecor: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  pageHeaderTitle: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold2,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },
  headerLine: { flex: 1, height: 1, backgroundColor: colors.border2 },

  // ── Portrait block ───────────────────────────────────────────────────────
  profileBlock: { alignItems: 'center', marginBottom: 20 },

  portraitFrame: {
    width: 100, height: 100,
    backgroundColor: colors.deep,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
    overflow: 'visible',
  },
  portraitImg: { width: 100, height: 100, borderRadius: 4 },
  portraitFallback: { alignItems: 'center', justifyContent: 'center', gap: 2 },
  portraitSymbol: {
    fontFamily: typography.title,
    fontSize: 30,
    color: colors.gold2,
    opacity: 0.6,
  },
  portraitLetter: {
    fontFamily: typography.display,
    fontSize: 24,
    color: colors.gold2,
    fontWeight: '700',
  },
  cameraBadge: {
    position: 'absolute', bottom: -10, right: -10,
    width: 28, height: 28, borderRadius: 14,
    backgroundColor: colors.deep,
    borderWidth: 1.5, borderColor: colors.border2,
    alignItems: 'center', justifyContent: 'center',
  },
  avatarHint: {
    fontSize: 10,
    color: colors.subtle,
    fontStyle: 'italic',
    marginTop: 6,
    letterSpacing: 0.3,
  },

  displayName: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.gold2,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // ── Stats bar ─────────────────────────────────────────────────────────────
  statsRow: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    overflow: 'hidden',
    marginBottom: 14,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  statCell: { flex: 1, alignItems: 'center', paddingVertical: 16 },
  statNum: { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  statLab: { fontSize: 9, color: colors.muted, marginTop: 3, textTransform: 'uppercase', letterSpacing: 0.9 },
  statDiv: { width: 1, backgroundColor: colors.border, marginVertical: 8 },

  // ── Stone card ────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border2,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGoldBar: { height: 2, backgroundColor: colors.gold2, opacity: 0.7 },
  cardInner: { padding: 16 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  cardTitle: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 2,
  },
  editBtn: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.amber,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },

  // Input
  input: {
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 12,
    paddingVertical: 11,
    color: colors.parchment,
    fontSize: 14,
    backgroundColor: 'rgba(7,8,10,0.6)',
  },

  // Info rows
  infoRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: colors.border,
  },
  infoLabel: { fontSize: 13, color: colors.muted },
  infoValue: { fontFamily: typography.title, fontSize: 12, color: colors.parchment, fontWeight: '600' },

  // Chips
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderRadius: 6, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 14, paddingVertical: 9,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(201,168,76,0.10)' },
  chipText: { fontFamily: typography.title, fontSize: 10, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.7 },
  chipTextActive: { color: colors.gold2 },

  // ── Navigation cards ──────────────────────────────────────────────────────
  navCard: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.deep,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.3, shadowRadius: 6, elevation: 3,
  },
  premiumCard: { borderColor: colors.border2, backgroundColor: 'rgba(14,20,32,0.9)' },
  navCardIcon: {
    width: 40, height: 40, borderRadius: 8,
    backgroundColor: 'rgba(201,168,76,0.07)',
    borderWidth: 1, borderColor: colors.border,
    alignItems: 'center', justifyContent: 'center',
  },
  navCardTitle: { fontFamily: typography.title, fontSize: 13, color: colors.parchment, fontWeight: '700', letterSpacing: 0.3 },
  navArrow: { fontSize: 20, color: colors.gold2 },

  // ── Legal / about ─────────────────────────────────────────────────────────
  legalLink: { fontSize: 13, color: colors.amber, textDecorationLine: 'underline' },

  // ── Sign out ──────────────────────────────────────────────────────────────
  signOutBtn: {
    marginTop: 14, borderRadius: 8,
    borderWidth: 1, borderColor: 'rgba(192,57,43,0.30)',
    paddingVertical: 13,
    backgroundColor: 'rgba(139,26,26,0.10)',
    alignItems: 'center',
  },
  signOutText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: '#E07070',
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
});
