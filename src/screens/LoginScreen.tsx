// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

type Mode = 'signin' | 'signup';

const LoginScreen: React.FC = () => {
  const { signIn, signUp, loading, error, clearError } = useAuthStore();
  const { t } = useI18n();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'player' | 'game_master'>('player');
  const [inlineError, setInlineError] = useState<string | null>(null);

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 8;

  function showError(msg: string) {
    setInlineError(msg);
  }

  async function handleSubmit() {
    clearError();
    setInlineError(null);

    if (!emailValid) { showError(t.auth.invalidEmail); return; }
    if (!passwordValid) { showError(t.auth.weakPassword); return; }

    if (mode === 'signup') {
      if (!username.trim()) { showError(t.auth.usernameRequired); return; }
      if (username.trim().length < 3) { showError(t.auth.usernameTooShort); return; }
      if (password !== confirmPassword) { showError(t.auth.passwordMismatch); return; }
      try {
        await signUp(email.trim(), password, username.trim(), role);
        setInlineError(null);
        setMode('signin');
        setPassword('');
        setConfirmPassword('');
      } catch {
        // error set in store
      }
    } else {
      try {
        await signIn(email.trim(), password);
      } catch {
        // error set in store
      }
    }
  }

  function switchMode(next: Mode) {
    clearError();
    setInlineError(null);
    setMode(next);
  }

  const displayError = inlineError ?? error ?? null;

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── Header / Logo ───────────────────────────────────────────── */}
          <View style={styles.headerBlock}>

            {/* Top decorative rune row */}
            <View style={styles.runeRow}>
              <Text style={styles.runeDecor}>ᚱ</Text>
              <View style={styles.runeLine} />
              <Text style={styles.runeDecor}>◆</Text>
              <View style={styles.runeLine} />
              <Text style={styles.runeDecor}>ᚹ</Text>
            </View>

            {/* App name */}
            <Text style={styles.logoTitle}>CHRONICLES</Text>

            {/* Gold divider with diamond */}
            <View style={styles.runeRowBottom}>
              <View style={styles.runeLine} />
              <Text style={styles.runeAccent}>◆</Text>
              <View style={styles.runeLine} />
            </View>

            {/* Subtitle */}
            <Text style={styles.logoSub}>Tabletop RPG Companion</Text>

            {/* Subtle rune row below subtitle */}
            <View style={styles.runeRowSmall}>
              <Text style={styles.runeSmall}>᛭</Text>
              <Text style={styles.runeSmall}>{'  '}ᚠ{'  '}</Text>
              <Text style={styles.runeSmall}>᛭</Text>
            </View>
          </View>

          {/* ── Card with double-border simulation ──────────────────────── */}
          {/* Outer border frame */}
          <View style={styles.cardOuter}>
            {/* Corner diamonds — absolute positioned */}
            <Text style={[styles.cornerDiamond, styles.cornerTL]}>◆</Text>
            <Text style={[styles.cornerDiamond, styles.cornerTR]}>◆</Text>
            <Text style={[styles.cornerDiamond, styles.cornerBL]}>◆</Text>
            <Text style={[styles.cornerDiamond, styles.cornerBR]}>◆</Text>

            {/* Inner card */}
            <View style={styles.card}>
              {/* Gold accent bar at top of card */}
              <View style={styles.cardTopBar} />

              {/* Mode toggle tabs */}
              <View style={styles.toggleTabs}>
                <TouchableOpacity
                  style={[styles.toggleTab, mode === 'signin' && styles.toggleTabActive]}
                  onPress={() => switchMode('signin')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleTabText, mode === 'signin' && styles.toggleTabTextActive]}>
                    {t.auth.signIn}
                  </Text>
                  {mode === 'signin' && <View style={styles.toggleTabUnderline} />}
                </TouchableOpacity>

                <View style={styles.toggleTabDivider} />

                <TouchableOpacity
                  style={[styles.toggleTab, mode === 'signup' && styles.toggleTabActive]}
                  onPress={() => switchMode('signup')}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.toggleTabText, mode === 'signup' && styles.toggleTabTextActive]}>
                    {t.auth.signUp}
                  </Text>
                  {mode === 'signup' && <View style={styles.toggleTabUnderline} />}
                </TouchableOpacity>
              </View>

              {/* ── Inline error ── */}
              {displayError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorIcon}>◆</Text>
                  <Text style={styles.errorText}>{displayError}</Text>
                </View>
              ) : null}

              {/* ── Signup-only fields ── */}
              {mode === 'signup' && (
                <>
                  {/* Username */}
                  <View style={commonStyles.fieldWrap}>
                    <Text style={commonStyles.fieldLabel}>{t.auth.username}</Text>
                    <TextInput
                      style={commonStyles.input}
                      value={username}
                      onChangeText={setUsername}
                      placeholder="HeroOfLight"
                      placeholderTextColor={colors.subtle}
                      autoCapitalize="none"
                      autoCorrect={false}
                      maxLength={24}
                    />
                  </View>

                  {/* Role chips */}
                  <View style={commonStyles.fieldWrap}>
                    <Text style={commonStyles.fieldLabel}>{t.auth.iAmA}</Text>
                    <View style={styles.roleRow}>
                      {(['player', 'game_master'] as const).map(r => (
                        <TouchableOpacity
                          key={r}
                          style={[styles.roleChip, role === r && styles.roleChipActive]}
                          onPress={() => setRole(r)}
                          activeOpacity={0.75}
                        >
                          <Text style={styles.roleChipEmoji}>
                            {r === 'player' ? '⚔' : '📜'}
                          </Text>
                          <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                            {r === 'player' ? t.auth.player : t.auth.gameMaster}
                          </Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  </View>
                </>
              )}

              {/* Email */}
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.auth.email}</Text>
                <TextInput
                  style={commonStyles.input}
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.subtle}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoCorrect={false}
                />
              </View>

              {/* Password */}
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.auth.password}</Text>
                <TextInput
                  style={commonStyles.input}
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.subtle}
                  secureTextEntry
                  textContentType={mode === 'signup' ? 'newPassword' : 'password'}
                />
              </View>

              {/* Confirm password — signup only */}
              {mode === 'signup' && (
                <View style={commonStyles.fieldWrap}>
                  <Text style={commonStyles.fieldLabel}>{t.auth.confirmPassword}</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    placeholder="••••••••"
                    placeholderTextColor={colors.subtle}
                    secureTextEntry
                    textContentType="newPassword"
                  />
                </View>
              )}

              {/* Submit button */}
              <TouchableOpacity
                style={[
                  mode === 'signin' ? commonStyles.primaryCta : commonStyles.goldCta,
                  styles.submitBtn,
                ]}
                onPress={handleSubmit}
                disabled={loading}
                activeOpacity={0.82}
              >
                {loading ? (
                  <ActivityIndicator color={mode === 'signin' ? '#F2E8C6' : colors.deeper} />
                ) : (
                  <Text style={mode === 'signin' ? commonStyles.primaryCtaText : commonStyles.goldCtaText}>
                    {mode === 'signin' ? t.auth.enterChronicles : t.auth.forgeLegend}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>

          {/* ── Decorative rune pattern between card and toggle ─────────── */}
          <View style={styles.midRune}>
            <View style={styles.runeLine} />
            <Text style={styles.midRuneText}>᛭ ᚠ ᛭</Text>
            <View style={styles.runeLine} />
          </View>

          {/* ── Toggle link ─────────────────────────────────────────────── */}
          <TouchableOpacity
            style={styles.toggleWrap}
            onPress={() => switchMode(mode === 'signin' ? 'signup' : 'signin')}
            activeOpacity={0.7}
          >
            <Text style={styles.toggleText}>
              {mode === 'signin' ? t.auth.noAccount : t.auth.alreadyAccount}
            </Text>
          </TouchableOpacity>

          {/* ── Decorative footer rune ──────────────────────────────────── */}
          <View style={styles.footerRune}>
            <Text style={styles.footerRuneText}>᛭</Text>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 44,
    paddingBottom: 36,
  },

  // ── Header ──────────────────────────────────────────────────────────────────
  headerBlock: {
    alignItems: 'center',
    marginBottom: 32,
  },

  // Top rune row with lines flanking the rune symbols
  runeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    marginBottom: 10,
    opacity: 0.35,
  },
  runeRowBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '55%',
    marginTop: 8,
    marginBottom: 12,
    opacity: 0.4,
  },
  runeRowSmall: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    opacity: 0.22,
  },
  runeLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.gold,
    opacity: 0.7,
  },
  runeDecor: {
    fontFamily: typography.title,
    fontSize: 16,
    color: colors.gold2,
    marginHorizontal: 8,
  },
  runeAccent: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold3,
    marginHorizontal: 8,
  },
  runeSmall: {
    fontFamily: typography.title,
    fontSize: 14,
    color: colors.gold2,
    letterSpacing: 2,
  },

  // "CHRONICLES" display title
  logoTitle: {
    fontFamily: typography.display,
    fontSize: 32,
    color: colors.gold2,
    letterSpacing: 6,
    fontWeight: '700',
    textShadowColor: 'rgba(201,168,76,0.30)',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 14,
  },
  // "Tabletop RPG Companion"
  logoSub: {
    fontSize: 12,
    color: colors.muted,
    letterSpacing: 2.5,
    textTransform: 'uppercase',
  },

  // ── Card outer frame (double-border simulation) ───────────────────────────
  cardOuter: {
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 5,
    position: 'relative',
    marginBottom: 0,
  },

  // Corner diamond decorators
  cornerDiamond: {
    position: 'absolute',
    fontSize: 11,
    color: colors.gold2,
    zIndex: 10,
    opacity: 0.75,
  },
  cornerTL: { top: -6, left: -2 },
  cornerTR: { top: -6, right: -2 },
  cornerBL: { bottom: -6, left: -2 },
  cornerBR: { bottom: -6, right: -2 },

  // ── Card ────────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    overflow: 'hidden',
    paddingHorizontal: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.5,
    shadowRadius: 16,
    elevation: 8,
  },
  // 3px gold bar pinned to card top
  cardTopBar: {
    height: 3,
    backgroundColor: colors.gold2,
    marginHorizontal: -20,
    marginBottom: 18,
    opacity: 0.85,
  },

  // ── Mode toggle tabs ──────────────────────────────────────────────────────
  toggleTabs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  toggleTab: {
    flex: 1,
    alignItems: 'center',
    paddingBottom: 10,
    position: 'relative',
  },
  toggleTabActive: {},
  toggleTabText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  toggleTabTextActive: {
    color: colors.gold2,
  },
  toggleTabUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '15%',
    right: '15%',
    height: 2,
    backgroundColor: colors.gold2,
    borderRadius: 2,
  },
  toggleTabDivider: {
    width: 1,
    height: 18,
    backgroundColor: colors.border,
    marginHorizontal: 4,
  },

  // ── Error box ────────────────────────────────────────────────────────────
  errorBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    backgroundColor: 'rgba(192,57,43,0.10)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(192,57,43,0.32)',
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
  errorIcon: {
    fontSize: 10,
    color: '#E07070',
    marginTop: 3,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#E07070',
    lineHeight: 19,
  },

  // ── Role chips ───────────────────────────────────────────────────────────
  roleRow: {
    flexDirection: 'row',
    gap: 10,
  },
  roleChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 11,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  roleChipActive: {
    borderColor: colors.gold2,
    backgroundColor: 'rgba(201,168,76,0.09)',
  },
  roleChipEmoji: {
    fontSize: 14,
  },
  roleChipText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  roleChipTextActive: {
    color: colors.gold2,
  },

  // ── Submit button ────────────────────────────────────────────────────────
  submitBtn: {
    marginTop: 8,
  },

  // ── Mid decorative rune (between card and toggle link) ───────────────────
  midRune: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
    marginBottom: 4,
    opacity: 0.25,
  },
  midRuneText: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold2,
    letterSpacing: 3,
    marginHorizontal: 10,
  },

  // ── Toggle link ──────────────────────────────────────────────────────────
  toggleWrap: {
    alignItems: 'center',
    marginTop: 10,
    padding: 8,
  },
  toggleText: {
    fontSize: 14,
    color: colors.muted,
    textDecorationLine: 'underline',
    textDecorationColor: 'rgba(122,155,181,0.4)',
  },

  // ── Footer rune ──────────────────────────────────────────────────────────
  footerRune: {
    alignItems: 'center',
    marginTop: 28,
    opacity: 0.15,
  },
  footerRuneText: {
    fontFamily: typography.title,
    fontSize: 20,
    color: colors.gold2,
    letterSpacing: 4,
  },
});
