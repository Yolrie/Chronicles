// src/screens/SessionLogFormScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, ScrollView,
  KeyboardAvoidingView, Platform, ActivityIndicator, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useAuthStore } from '../stores/authStore';
import { useChroniclesAlert } from '../components/AlertProvider';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'SessionLogForm'>;

const SessionLogFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { campaignId, isGMJournal } = route.params;
  const { user } = useAuthStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { createSessionLog, loading } = useCampaignsStore();
  const { showAlert } = useChroniclesAlert();
  const { t } = useI18n();

  // ── Champs communs ──
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [notes, setNotes] = useState('');

  // ── Champs journal MJ ──
  const [title, setTitle] = useState('');

  // ── Champs log joueur ──
  const [characterId, setCharacterId] = useState('');
  const [xpGained, setXpGained] = useState('0');
  const [goldChanged, setGoldChanged] = useState('0');
  const [hpCurrent, setHpCurrent] = useState('');
  const [itemsGained, setItemsGained] = useState('');
  const [itemsLost, setItemsLost] = useState('');

  // Personnages liés à cette campagne ou tous les personnages du joueur
  const campaignChars = characters.filter(c => c.campaign_id === campaignId);
  const availableChars = campaignChars.length > 0 ? campaignChars : characters;

  useEffect(() => { fetchCharacters(); }, []);
  useEffect(() => {
    if (!isGMJournal && availableChars.length > 0 && !characterId) {
      setCharacterId(availableChars[0].id);
    }
  }, [availableChars.length]);

  async function handleSubmit() {
    if (!user) return;

    if (isGMJournal) {
      if (!title.trim()) {
        showAlert({ title: t.common.required, message: 'Donnez un titre à ce journal.', buttons: [{ text: 'OK' }] });
        return;
      }
      const log = await createSessionLog({
        campaign_id: campaignId,
        player_id: user.id,
        session_date: sessionDate,
        title: title.trim(),
        xp_gained: 0,
        gold_changed: 0,
        notes: notes.trim() || undefined,
        is_gm_journal: true,
      });
      if (log) {
        showAlert({ icon: '📖', title: 'Journal enregistré', message: 'Le journal MJ a été sauvegardé.', buttons: [{ text: 'OK', onPress: () => navigation.goBack() }] });
      }
    } else {
      if (!characterId) {
        showAlert({ title: t.common.required, message: t.sessionLog.character, buttons: [{ text: 'OK' }] });
        return;
      }
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
        showAlert({ icon: '✓', title: '', message: t.sessionLog.submitted, buttons: [{ text: 'OK', onPress: () => navigation.goBack() }] });
      }
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* ── En-tête ── */}
          <View style={styles.headerBanner}>
            <Text style={styles.headerIcon}>{isGMJournal ? '📖' : '⚔'}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.headerTitle}>
                {isGMJournal ? 'Journal du Maître' : t.sessionLog.logSession}
              </Text>
              <Text style={styles.headerSub}>
                {isGMJournal
                  ? 'Narration libre de la session — visible par les joueurs'
                  : 'Soumis au MJ pour approbation'}
              </Text>
            </View>
          </View>

          {/* Date */}
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

          {/* ── Journal MJ ── */}
          {isGMJournal && (
            <>
              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Titre de la session *</Text>
                <TextInput
                  style={commonStyles.input}
                  value={title}
                  onChangeText={setTitle}
                  placeholder="La Caverne des Ombres..."
                  placeholderTextColor={colors.muted}
                  maxLength={80}
                />
              </View>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>Récit de la session</Text>
                <Text style={[commonStyles.mutedText, { marginBottom: 8, fontSize: 11 }]}>
                  Narration de ce qui s'est passé, les événements clés, les révélations...
                </Text>
                <TextInput
                  style={[commonStyles.input, styles.bigTextarea]}
                  value={notes}
                  onChangeText={setNotes}
                  placeholder="Les héros arrivent à la lisière de la forêt maudite..."
                  placeholderTextColor={colors.muted}
                  multiline
                  textAlignVertical="top"
                />
              </View>
            </>
          )}

          {/* ── Log joueur ── */}
          {!isGMJournal && (
            <>
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
            </>
          )}

          <View style={styles.actions}>
            <TouchableOpacity
              style={[commonStyles.primaryCta, ((!characterId && !isGMJournal) || loading) && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading || (!isGMJournal && !characterId)}
            >
              {loading ? <ActivityIndicator color="#fce8e8" /> : (
                <Text style={commonStyles.primaryCtaText}>
                  {isGMJournal ? '📖 Enregistrer le journal' : t.sessionLog.submitLog}
                </Text>
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

  headerBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 14,
    backgroundColor: colors.deep,
    borderRadius: 10, borderWidth: 1, borderColor: colors.border2,
    padding: 14, marginBottom: 20,
  },
  headerIcon: { fontSize: 28 },
  headerTitle: { fontFamily: typography.title, fontSize: 14, color: colors.parchment, fontWeight: '700' },
  headerSub: { fontSize: 11, color: colors.muted, marginTop: 3, lineHeight: 16 },

  bigTextarea: { minHeight: 180, textAlignVertical: 'top' },

  rowFields: { flexDirection: 'row', gap: 10 },
  charRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  charChip: {
    borderRadius: 8, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  charChipActive: { borderColor: colors.crimson2, backgroundColor: 'rgba(196,40,64,0.08)' },
  charChipText: { fontFamily: typography.title, fontSize: 12, color: colors.muted, fontWeight: '700' },
  charChipSub: { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2 },
  charChipTextActive: { color: colors.parchment },
  actions: { gap: 8 },
});
