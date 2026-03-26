// src/screens/SessionLogFormScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useAuthStore } from '../stores/authStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'SessionLogForm'>;

const SessionLogFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user } = useAuthStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { createSessionLog, loading } = useCampaignsStore();
  const { t } = useI18n();

  const [characterId, setCharacterId] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [xpGained, setXpGained] = useState('0');
  const [goldChanged, setGoldChanged] = useState('0');
  const [hpCurrent, setHpCurrent] = useState('');
  const [notes, setNotes] = useState('');
  const [itemsGained, setItemsGained] = useState('');
  const [itemsLost, setItemsLost] = useState('');

  // Personnages liés à cette campagne ou tous les personnages du joueur
  const campaignChars = characters.filter(c => c.campaign_id === campaignId);
  const availableChars = campaignChars.length > 0 ? campaignChars : characters;

  useEffect(() => { fetchCharacters(); }, []);
  useEffect(() => {
    if (availableChars.length > 0 && !characterId) {
      setCharacterId(availableChars[0].id);
    }
  }, [availableChars]);

  async function handleSubmit() {
    if (!characterId) { Alert.alert(t.common.required, t.sessionLog.character); return; }
    if (!user) return;

    const parseItems = (raw: string): string[] => raw.split(',').map(s => s.trim()).filter(Boolean);

    const log = await createSessionLog({
      campaign_id: campaignId,
      character_id: characterId,
      player_id: user.id,
      session_date: sessionDate,
      xp_gained: parseInt(xpGained) || 0,
      gold_changed: parseInt(goldChanged) || 0,
      hp_current: hpCurrent ? parseInt(hpCurrent) : undefined,
      notes: notes.trim() || undefined,
      items_gained: itemsGained ? parseItems(itemsGained) : undefined,
      items_lost: itemsLost ? parseItems(itemsLost) : undefined,
    });

    if (log) {
      Alert.alert('', t.sessionLog.submitted);
      navigation.goBack();
    } else {
      Alert.alert(t.common.error, t.common.error);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.character}</Text>
            {availableChars.length === 0 ? (
              <Text style={commonStyles.mutedText}>{t.sessionLog.noCharacters}</Text>
            ) : (
              <View style={styles.charRow}>
                {availableChars.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.charChip, characterId === c.id && styles.charChipActive]}
                    onPress={() => setCharacterId(c.id)}
                  >
                    <Text style={[styles.charChipText, characterId === c.id && styles.charChipTextActive]}>{c.name}</Text>
                    <Text style={[styles.charChipSub, characterId === c.id && styles.charChipTextActive]}>Niv {c.level}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.sessionDate}</Text>
            <TextInput
              style={commonStyles.input}
              value={sessionDate}
              onChangeText={setSessionDate}
              placeholder="AAAA-MM-JJ"
              placeholderTextColor={colors.muted}
              maxLength={10}
            />
          </View>

          <View style={styles.rowFields}>
            <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
              <Text style={commonStyles.fieldLabel}>{t.sessionLog.xpGained}</Text>
              <TextInput style={commonStyles.input} value={xpGained} onChangeText={setXpGained} keyboardType="number-pad" placeholderTextColor={colors.muted} />
            </View>
            <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
              <Text style={commonStyles.fieldLabel}>{t.sessionLog.goldChange}</Text>
              <TextInput style={commonStyles.input} value={goldChanged} onChangeText={setGoldChanged} placeholder="+50 ou -10" placeholderTextColor={colors.muted} />
            </View>
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.hpAtEnd}</Text>
            <TextInput style={commonStyles.input} value={hpCurrent} onChangeText={setHpCurrent} keyboardType="number-pad" placeholder="ex. 24" placeholderTextColor={colors.muted} />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.itemsGained}</Text>
            <TextInput style={commonStyles.input} value={itemsGained} onChangeText={setItemsGained} placeholder="Épée longue, Potion..." placeholderTextColor={colors.muted} />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.itemsLost}</Text>
            <TextInput style={commonStyles.input} value={itemsLost} onChangeText={setItemsLost} placeholder="2x Flèche, Corde..." placeholderTextColor={colors.muted} />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessionLog.sessionNotes}</Text>
            <TextInput
              style={[commonStyles.input, { minHeight: 100, textAlignVertical: 'top' }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Ce qui s'est passé cette session..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={1000}
            />
          </View>

          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={[commonStyles.mutedText, { lineHeight: 18 }]}>{t.sessionLog.pendingReview}</Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[commonStyles.primaryCta, (!characterId || loading) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading || !characterId}
            >
              {loading ? <ActivityIndicator color="#fce8e8" /> : (
                <Text style={commonStyles.primaryCtaText}>{t.sessionLog.submitLog}</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.ghostButton} onPress={() => navigation.goBack()}>
              <Text style={commonStyles.ghostButtonText}>{t.sessionLog.cancel}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default SessionLogFormScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  rowFields: { flexDirection: 'row', gap: 10 },
  charRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  charChip: { borderRadius: 8, borderWidth: 1, borderColor: colors.border2, paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.02)' },
  charChipActive: { borderColor: colors.crimson2, backgroundColor: 'rgba(196,40,64,0.08)' },
  charChipText: { fontFamily: typography.title, fontSize: 12, color: colors.muted, fontWeight: '700' },
  charChipSub: { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2 },
  charChipTextActive: { color: colors.parchment },
  actions: { gap: 8 },
});
