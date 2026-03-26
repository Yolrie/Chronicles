// src/screens/CampaignFormScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { supabase } from '../lib/supabase';
import { GameSystem } from '../types';
import { colors, commonStyles, typography } from '../styles/common';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignForm'>;

const CampaignFormScreen: React.FC<Props> = ({ navigation }) => {
  const { createCampaign, loading, error, clearError } = useCampaignsStore();
  const { t } = useI18n();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gameSystems, setGameSystems] = useState<GameSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState('');

  useEffect(() => {
    supabase.from('game_systems').select('*').eq('is_official', true).then(({ data, error }) => {
      if (!error) setGameSystems(data ?? []);
    });
    return () => { clearError(); };
  }, []);

  async function handleCreate() {
    clearError();
    if (!name.trim()) {
      Alert.alert(t.common.nameRequired, t.campaigns.campaignName.replace(' *', ''));
      return;
    }
    const campaign = await createCampaign(
      name.trim(),
      description.trim() || undefined,
      selectedSystem || undefined,
    );
    if (campaign) {
      Alert.alert(
        t.campaigns.campaignCreated,
        t.campaigns.inviteCodeInfo(campaign.invite_code),
        [{ text: t.campaigns.gotIt, onPress: () => navigation.goBack() }],
      );
    }
    // Si campaign est null, l'erreur est affichée via le bloc error ci-dessous
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Erreur visible */}
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.campaignName}</Text>
            <TextInput
              style={commonStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="Les Ombres d'Eldrith..."
              placeholderTextColor={colors.muted}
              maxLength={80}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.campaigns.descriptionLabel}</Text>
            <TextInput
              style={[commonStyles.input, { minHeight: 90, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="Une sombre histoire d'anciens maléfices..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={400}
            />
          </View>

          {gameSystems.length > 0 && (
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>{t.campaigns.gameSystem}</Text>
              <View style={styles.sysRow}>
                {gameSystems.map(gs => (
                  <TouchableOpacity
                    key={gs.id}
                    style={[styles.sysChip, selectedSystem === gs.id && styles.sysChipActive]}
                    onPress={() => setSelectedSystem(selectedSystem === gs.id ? '' : gs.id)}
                  >
                    <Text style={[styles.sysChipText, selectedSystem === gs.id && styles.sysChipTextActive]}>
                      {gs.name}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={[commonStyles.card, { marginTop: 8 }]}>
            <Text style={styles.infoTitle}>En tant que Maître du Jeu, vous pourrez :</Text>
            {t.campaigns.gmRoles.map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.infoBullet}>·</Text>
                <Text style={styles.infoText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[commonStyles.goldCta, loading && { opacity: 0.6 }]}
              onPress={handleCreate}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#1a0e00" />
                : <Text style={commonStyles.goldCtaText}>{t.campaigns.foundCampaign}</Text>
              }
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.ghostButton} onPress={() => navigation.goBack()}>
              <Text style={commonStyles.ghostButtonText}>{t.common.cancel}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default CampaignFormScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  errorBox: {
    backgroundColor: 'rgba(196,40,64,0.1)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(196,40,64,0.3)',
    padding: 12,
    marginBottom: 14,
  },
  errorText: { fontFamily: typography.body, fontSize: 13, color: '#e07070', lineHeight: 18 },
  sysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sysChip: {
    borderRadius: 8, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sysChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  sysChipText: { fontFamily: typography.title, fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  sysChipTextActive: { color: colors.gold2 },
  infoTitle: { fontFamily: typography.title, fontSize: 11, color: colors.gold, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  infoBullet: { color: colors.gold2, fontFamily: typography.title, fontSize: 14 },
  infoText: { fontFamily: typography.body, fontSize: 13, color: colors.parchment, flex: 1, lineHeight: 19 },
  actions: { gap: 8, marginTop: 16 },
});
