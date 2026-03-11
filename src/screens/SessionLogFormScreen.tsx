// src/screens/SessionLogFormScreen.tsx

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
import { useCharactersStore } from '../stores/charactersStore';
import { useAuthStore } from '../stores/authStore';
import { colors, commonStyles, typography } from '../styles/common';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'SessionLogForm'>;

const SessionLogFormScreen: React.FC<Props> = ({ route, navigation }) => {
  const { campaignId } = route.params;
  const { user } = useAuthStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { createSessionLog, loading } = useCampaignsStore();

  const [characterId, setCharacterId] = useState('');
  const [sessionDate, setSessionDate] = useState(new Date().toISOString().slice(0, 10));
  const [xpGained, setXpGained] = useState('0');
  const [goldChanged, setGoldChanged] = useState('0');
  const [hpCurrent, setHpCurrent] = useState('');
  const [notes, setNotes] = useState('');
  const [itemsGained, setItemsGained] = useState('');
  const [itemsLost, setItemsLost] = useState('');

  useEffect(() => {
    fetchCharacters();
  }, []);

  // Pre-select first character
  useEffect(() => {
    if (characters.length > 0 && !characterId) {
      setCharacterId(characters[0].id);
    }
  }, [characters]);

  async function handleSubmit() {
    if (!characterId) { Alert.alert('Select character', 'Please select a character for this session.'); return; }
    if (!user) return;

    const parseItems = (raw: string): string[] =>
      raw.split(',').map(s => s.trim()).filter(Boolean);

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
      Alert.alert('Session logged', 'Your session log has been submitted for GM review.');
      navigation.goBack();
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
          {/* Character selection */}
          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Character *</Text>
            {characters.length === 0 ? (
              <Text style={commonStyles.mutedText}>No characters found. Create one first.</Text>
            ) : (
              <View style={styles.charRow}>
                {characters.map(c => (
                  <TouchableOpacity
                    key={c.id}
                    style={[styles.charChip, characterId === c.id && styles.charChipActive]}
                    onPress={() => setCharacterId(c.id)}
                  >
                    <Text style={[styles.charChipText, characterId === c.id && styles.charChipTextActive]}>
                      {c.name}
                    </Text>
                    <Text style={[styles.charChipSub, characterId === c.id && styles.charChipTextActive]}>
                      Lv{c.level}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Session Date</Text>
            <TextInput
              style={commonStyles.input}
              value={sessionDate}
              onChangeText={setSessionDate}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={colors.muted}
              maxLength={10}
            />
          </View>

          <View style={styles.rowFields}>
            <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
              <Text style={commonStyles.fieldLabel}>XP Gained</Text>
              <TextInput
                style={commonStyles.input}
                value={xpGained}
                onChangeText={setXpGained}
                keyboardType="number-pad"
                placeholderTextColor={colors.muted}
              />
            </View>
            <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
              <Text style={commonStyles.fieldLabel}>Gold Change</Text>
              <TextInput
                style={commonStyles.input}
                value={goldChanged}
                onChangeText={setGoldChanged}
                keyboardType="default"
                placeholder="+50 or -10"
                placeholderTextColor={colors.muted}
              />
            </View>
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>HP at End of Session</Text>
            <TextInput
              style={commonStyles.input}
              value={hpCurrent}
              onChangeText={setHpCurrent}
              keyboardType="number-pad"
              placeholder="e.g. 24"
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Items Gained (comma separated)</Text>
            <TextInput
              style={commonStyles.input}
              value={itemsGained}
              onChangeText={setItemsGained}
              placeholder="Longsword, Potion of Healing..."
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Items Lost (comma separated)</Text>
            <TextInput
              style={commonStyles.input}
              value={itemsLost}
              onChangeText={setItemsLost}
              placeholder="2x Arrow, Rope..."
              placeholderTextColor={colors.muted}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Session Notes</Text>
            <TextInput
              style={[commonStyles.input, { height: 100, textAlignVertical: 'top' }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="What happened this session..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={1000}
            />
          </View>

          <View style={[commonStyles.card, { marginBottom: 16 }]}>
            <Text style={styles.infoText}>
              This session log will be submitted to your Game Master for review. It will be marked as pending until approved.
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={commonStyles.primaryCta} onPress={handleSubmit} disabled={loading || !characterId}>
              {loading ? <ActivityIndicator color="#fce8e8" /> : (
                <Text style={commonStyles.primaryCtaText}>Submit Session Log</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.ghostButton} onPress={() => navigation.goBack()}>
              <Text style={commonStyles.ghostButtonText}>Cancel</Text>
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
  charChip: {
    borderRadius: 8, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 12, paddingVertical: 8, alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  charChipActive: { borderColor: colors.crimson2, backgroundColor: 'rgba(196,40,64,0.08)' },
  charChipText: { fontFamily: typography.title, fontSize: 12, color: colors.muted, fontWeight: '700' },
  charChipSub: { fontFamily: typography.body, fontSize: 10, color: colors.muted, marginTop: 2 },
  charChipTextActive: { color: colors.parchment },
  infoText: { fontFamily: typography.body, fontSize: 12, color: colors.muted, lineHeight: 18 },
  actions: { gap: 8 },
});
