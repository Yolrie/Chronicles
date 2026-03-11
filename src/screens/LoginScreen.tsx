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
  Alert,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuthStore } from '../stores/authStore';
import { colors, commonStyles, typography } from '../styles/common';

type Mode = 'signin' | 'signup';

const LoginScreen: React.FC = () => {
  const { signIn, signUp, loading, error, clearError } = useAuthStore();

  const [mode, setMode] = useState<Mode>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState<'player' | 'game_master'>('player');

  const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const passwordValid = password.length >= 8;

  async function handleSubmit() {
    clearError();
    if (!emailValid) { Alert.alert('Invalid email', 'Please enter a valid email address.'); return; }
    if (!passwordValid) { Alert.alert('Weak password', 'Password must be at least 8 characters.'); return; }

    if (mode === 'signup') {
      if (!username.trim()) { Alert.alert('Username required', 'Please choose a username.'); return; }
      if (username.trim().length < 3) { Alert.alert('Username too short', 'Username must be at least 3 characters.'); return; }
      if (password !== confirmPassword) { Alert.alert('Password mismatch', 'Passwords do not match.'); return; }
      try {
        await signUp(email.trim(), password, username.trim(), role);
        Alert.alert('Account created', 'Welcome to Chronicles! Sign in to begin your adventure.');
        setMode('signin');
      } catch {
        // error is set in store
      }
    } else {
      try {
        await signIn(email.trim(), password);
      } catch {
        // error is set in store
      }
    }
  }

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
          {/* Header */}
          <View style={styles.headerBlock}>
            <Text style={styles.logoTitle}>CHRONICLES</Text>
            <Text style={styles.logoSub}>Tabletop RPG Companion</Text>
            <View style={styles.divider} />
          </View>

          {/* Card */}
          <View style={commonStyles.card}>
            <Text style={styles.cardTitle}>
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Text>

            {error ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            ) : null}

            {mode === 'signup' && (
              <>
                <View style={commonStyles.fieldWrap}>
                  <Text style={commonStyles.fieldLabel}>Username</Text>
                  <TextInput
                    style={commonStyles.input}
                    value={username}
                    onChangeText={setUsername}
                    placeholder="HeroOfLight"
                    placeholderTextColor={colors.muted}
                    autoCapitalize="none"
                    autoCorrect={false}
                    maxLength={24}
                  />
                </View>

                <View style={commonStyles.fieldWrap}>
                  <Text style={commonStyles.fieldLabel}>I am a...</Text>
                  <View style={styles.roleRow}>
                    {(['player', 'game_master'] as const).map(r => (
                      <TouchableOpacity
                        key={r}
                        style={[styles.roleChip, role === r && styles.roleChipActive]}
                        onPress={() => setRole(r)}
                      >
                        <Text style={[styles.roleChipText, role === r && styles.roleChipTextActive]}>
                          {r === 'player' ? 'Player' : 'Game Master'}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              </>
            )}

            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Email</Text>
              <TextInput
                style={commonStyles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="you@example.com"
                placeholderTextColor={colors.muted}
                autoCapitalize="none"
                keyboardType="email-address"
                textContentType="emailAddress"
                autoCorrect={false}
              />
            </View>

            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Password</Text>
              <TextInput
                style={commonStyles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                secureTextEntry
                textContentType={mode === 'signup' ? 'newPassword' : 'password'}
              />
            </View>

            {mode === 'signup' && (
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Confirm Password</Text>
                <TextInput
                  style={commonStyles.input}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="••••••••"
                  placeholderTextColor={colors.muted}
                  secureTextEntry
                  textContentType="newPassword"
                />
              </View>
            )}

            <TouchableOpacity
              style={[commonStyles.primaryCta, { marginTop: 8 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fce8e8" />
              ) : (
                <Text style={commonStyles.primaryCtaText}>
                  {mode === 'signin' ? 'Enter the Chronicles' : 'Forge My Legend'}
                </Text>
              )}
            </TouchableOpacity>
          </View>

          {/* Toggle */}
          <TouchableOpacity
            style={styles.toggleWrap}
            onPress={() => { clearError(); setMode(mode === 'signin' ? 'signup' : 'signin'); }}
          >
            <Text style={styles.toggleText}>
              {mode === 'signin'
                ? "No account yet? Create one"
                : 'Already have an account? Sign in'}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 48, paddingBottom: 32 },
  headerBlock: { alignItems: 'center', marginBottom: 32 },
  logoTitle: {
    fontFamily: typography.display,
    fontSize: 28,
    color: colors.gold2,
    letterSpacing: 6,
    fontWeight: '700',
  },
  logoSub: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    letterSpacing: 2,
    marginTop: 6,
    textTransform: 'uppercase',
  },
  divider: { width: 60, height: 1, backgroundColor: colors.gold3, marginTop: 16 },
  cardTitle: {
    fontFamily: typography.title,
    fontSize: 16,
    color: colors.parchment,
    fontWeight: '700',
    marginBottom: 16,
    letterSpacing: 0.8,
  },
  errorBox: {
    backgroundColor: 'rgba(196,40,64,0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(196,40,64,0.3)',
    padding: 10,
    marginBottom: 12,
  },
  errorText: { fontFamily: typography.body, fontSize: 13, color: '#e07070' },
  roleRow: { flexDirection: 'row', gap: 8 },
  roleChip: {
    flex: 1,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  roleChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  roleChipText: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  roleChipTextActive: { color: colors.gold2 },
  toggleWrap: { alignItems: 'center', marginTop: 20, padding: 8 },
  toggleText: { fontFamily: typography.body, fontSize: 14, color: colors.steel },
});
