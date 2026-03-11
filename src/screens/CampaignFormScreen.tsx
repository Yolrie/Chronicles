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
import { supabase } from '../lib/supabase';
import { GameSystem } from '../types';
import { colors, commonStyles, typography } from '../styles/common';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignForm'>;

const CampaignFormScreen: React.FC<Props> = ({ navigation }) => {
  const { createCampaign, loading } = useCampaignsStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [gameSystems, setGameSystems] = useState<GameSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState('');

  useEffect(() => {
    supabase.from('game_systems').select('*').eq('is_official', true).then(({ data }) => {
      setGameSystems(data ?? []);
    });
  }, []);

  async function handleCreate() {
    if (!name.trim()) { Alert.alert('Name required', 'Give your campaign a name.'); return; }
    const campaign = await createCampaign(name.trim(), description.trim() || undefined, selectedSystem || undefined);
    if (campaign) {
      Alert.alert(
        'Campaign created!',
        `Invite code: ${campaign.invite_code}\n\nShare this code with your players.`,
        [{ text: 'Got it', onPress: () => navigation.goBack() }],
      );
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Campaign Name *</Text>
            <TextInput
              style={commonStyles.input}
              value={name}
              onChangeText={setName}
              placeholder="The Shadows of Eldrith..."
              placeholderTextColor={colors.muted}
              maxLength={80}
            />
          </View>

          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>Description</Text>
            <TextInput
              style={[commonStyles.input, { height: 90, textAlignVertical: 'top' }]}
              value={description}
              onChangeText={setDescription}
              placeholder="A dark tale of ancient evils awakening..."
              placeholderTextColor={colors.muted}
              multiline
              maxLength={400}
            />
          </View>

          {gameSystems.length > 0 && (
            <View style={commonStyles.fieldWrap}>
              <Text style={commonStyles.fieldLabel}>Game System</Text>
              <View style={styles.sysRow}>
                {gameSystems.map(gs => (
                  <TouchableOpacity
                    key={gs.id}
                    style={[styles.sysChip, selectedSystem === gs.id && styles.sysChipActive]}
                    onPress={() => setSelectedSystem(selectedSystem === gs.id ? '' : gs.id)}
                  >
                    <Text style={[styles.sysChipText, selectedSystem === gs.id && styles.sysChipTextActive]}>{gs.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <View style={[commonStyles.card, { marginTop: 8 }]}>
            <Text style={styles.infoTitle}>As Game Master, you will:</Text>
            {[
              'Receive a unique invite code to share with players',
              'Manage player join requests',
              'Review and approve session logs',
              'Track campaign progress',
            ].map((item, i) => (
              <View key={i} style={styles.infoRow}>
                <Text style={styles.infoBullet}>·</Text>
                <Text style={styles.infoText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.actions}>
            <TouchableOpacity style={commonStyles.goldCta} onPress={handleCreate} disabled={loading}>
              {loading ? <ActivityIndicator color="#1a0e00" /> : (
                <Text style={commonStyles.goldCtaText}>Found this Campaign</Text>
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

export default CampaignFormScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },
  sysRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  sysChip: {
    borderRadius: 8, borderWidth: 1, borderColor: colors.border2,
    paddingHorizontal: 12, paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  sysChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  sysChipText: { fontFamily: typography.title, fontSize: 11, color: colors.muted, textTransform: 'uppercase', letterSpacing: 0.8 },
  sysChipTextActive: { color: colors.gold2 },
  infoTitle: { fontFamily: typography.title, fontSize: 12, color: colors.gold, marginBottom: 10, textTransform: 'uppercase', letterSpacing: 0.8 },
  infoRow: { flexDirection: 'row', gap: 6, marginBottom: 6 },
  infoBullet: { color: colors.gold2, fontFamily: typography.title, fontSize: 14 },
  infoText: { fontFamily: typography.body, fontSize: 13, color: colors.parchment, flex: 1, lineHeight: 19 },
  actions: { gap: 8, marginTop: 16 },
});
