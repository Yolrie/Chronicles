// src/screens/LoginScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { commonStyles, colors } from '../styles/common';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  function handleSignIn() {
    if (!username.trim()) {
      // v1 simple : on demande juste un pseudo
      return;
    }
    navigation.navigate('Home', {
      username: username.trim(),
      email: email.trim(),
      password,
    });
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.ink }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={[commonStyles.screen, { justifyContent: 'center' }]}>
          <View style={[commonStyles.card, { paddingVertical: 24 }]}>
            {/* Logo / titre */}
            <View style={{ marginBottom: 20, alignItems: 'center' }}>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 16,
                  backgroundColor: colors.deep,
                  borderWidth: 1,
                  borderColor: colors.border2,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    fontFamily: 'Cinzel',
                    fontSize: 28,
                    color: colors.gold2,
                  }}
                >
                  C
                </Text>
              </View>
              <Text
                style={{
                  fontFamily: 'Cinzel Decorative',
                  fontSize: 26,
                  color: colors.gold2,
                  letterSpacing: 1,
                }}
              >
                Chronicles
              </Text>
              <Text
                style={{
                  fontFamily: 'Cinzel',
                  fontSize: 11,
                  color: '#9ca3af',
                  letterSpacing: 2,
                  textTransform: 'uppercase',
                  marginTop: 4,
                }}
              >
                Forge de personnages
              </Text>
            </View>

            {/* Formulaire */}
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Username</Text>
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder="Your adventurer name..."
                placeholderTextColor={colors.muted}
                style={commonStyles.input}
              />
            </View>

            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Email (optional)</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="you@realm.com"
                placeholderTextColor={colors.muted}
                style={commonStyles.input}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Password (optional)</Text>
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                placeholderTextColor={colors.muted}
                style={commonStyles.input}
                secureTextEntry
              />
            </View>

            {/* CTA */}
            <View style={{ marginTop: 12 }}>
              <TouchableOpacity
                style={commonStyles.primaryCta}
                onPress={handleSignIn}
              >
                <Text style={commonStyles.primaryCtaText}>Enter the realm</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;
