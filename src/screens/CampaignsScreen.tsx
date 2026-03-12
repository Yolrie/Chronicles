// src/screens/CampaignsScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet,
  RefreshControl, Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { Campaign } from '../types';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignsList'>;

const CampaignCard: React.FC<{ campaign: Campaign; onPress: () => void }> = ({ campaign, onPress }) => {
  const { t } = useI18n();
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.75}>
      <View style={styles.cardAvatar}>
        <Text style={styles.cardAvatarText}>{campaign.name[0]?.toUpperCase()}</Text>
      </View>
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.campName} numberOfLines={1}>{campaign.name}</Text>
          <Text style={[commonStyles.badge, campaign.my_role === 'game_master' ? commonStyles.badgePurple : commonStyles.badgeGreen]}>
            {campaign.my_role === 'game_master' ? t.campaigns.gm : t.campaigns.player}
          </Text>
        </View>
        {campaign.description ? <Text style={styles.campDesc} numberOfLines={2}>{campaign.description}</Text> : null}
        <Text style={styles.codeValue}>{campaign.invite_code}</Text>
      </View>
    </TouchableOpacity>
  );
};

const CampaignsScreen: React.FC<Props> = ({ navigation }) => {
  const { campaigns, loading, fetchCampaigns, joinCampaign } = useCampaignsStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { t } = useI18n();

  const [refreshing, setRefreshing] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [selectedCharId, setSelectedCharId] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => { fetchCampaigns(); fetchCharacters(); }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  }, []);

  async function handleJoin() {
    if (!inviteCode.trim()) { Alert.alert(t.common.error, t.campaigns.inviteCodeLabel); return; }
    setJoining(true);
    const result = await joinCampaign(inviteCode.trim(), selectedCharId || undefined);
    setJoining(false);
    setJoinModal(false);
    setInviteCode('');
    setSelectedCharId('');
    if (result === 'ok') Alert.alert('', t.campaigns.joined);
    else if (result === 'not_found') Alert.alert(t.common.error, t.campaigns.notFound);
    else if (result === 'already') Alert.alert('', t.campaigns.alreadyMember);
    else Alert.alert(t.common.error, t.campaigns.errorJoining);
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={campaigns}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing || loading} onRefresh={onRefresh} tintColor={colors.gold2} />}
        ListHeaderComponent={
          <View style={styles.actions}>
            <TouchableOpacity style={commonStyles.primaryCta} onPress={() => navigation.navigate('CampaignForm')}>
              <Text style={commonStyles.primaryCtaText}>{t.campaigns.createCampaign}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={commonStyles.goldCta} onPress={() => setJoinModal(true)}>
              <Text style={commonStyles.goldCtaText}>{t.campaigns.joinWithCode}</Text>
            </TouchableOpacity>
          </View>
        }
        ListEmptyComponent={
          !loading ? (
            <View style={[commonStyles.card, { alignItems: 'center', paddingVertical: 32 }]}>
              <Text style={[commonStyles.bodyText, { color: colors.muted, textAlign: 'center' }]}>
                {t.campaigns.noCampaigns}
              </Text>
            </View>
          ) : null
        }
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
          />
        )}
      />

      {/* Modal rejoindre */}
      <Modal visible={joinModal} transparent animationType="fade" onRequestClose={() => setJoinModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>{t.campaigns.joinWithCode}</Text>

            <Text style={commonStyles.fieldLabel}>{t.campaigns.inviteCodeLabel}</Text>
            <TextInput
              style={[commonStyles.input, styles.codeInput]}
              value={inviteCode}
              onChangeText={t => setInviteCode(t.toUpperCase())}
              placeholder={t.campaigns.inviteCodePlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="characters"
              maxLength={12}
            />

            {characters.length > 0 && (
              <>
                <Text style={[commonStyles.fieldLabel, { marginTop: 12 }]}>{t.campaigns.selectCharacter}</Text>
                <View style={styles.charList}>
                  {characters.map(c => (
                    <TouchableOpacity
                      key={c.id}
                      style={[styles.charChip, selectedCharId === c.id && styles.charChipActive]}
                      onPress={() => setSelectedCharId(selectedCharId === c.id ? '' : c.id)}
                    >
                      <Text style={[styles.charChipText, selectedCharId === c.id && styles.charChipTextActive]}>
                        {c.name} · Niv{c.level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </>
            )}

            <View style={styles.modalBtns}>
              <TouchableOpacity style={commonStyles.ghostButton} onPress={() => setJoinModal(false)}>
                <Text style={commonStyles.ghostButtonText}>{t.common.cancel}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[commonStyles.primaryCta, { flex: 1 }]} onPress={handleJoin} disabled={joining}>
                {joining ? <ActivityIndicator color="#fce8e8" /> : <Text style={commonStyles.primaryCtaText}>{t.campaigns.join}</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CampaignsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 32 },
  actions: { gap: 8, marginBottom: 16 },
  card: {
    backgroundColor: colors.deep, borderRadius: 12, borderWidth: 1, borderColor: colors.border,
    padding: 14, marginBottom: 12, flexDirection: 'row', gap: 12,
  },
  cardAvatar: { width: 48, height: 48, borderRadius: 12, backgroundColor: 'rgba(122,90,30,0.25)', borderWidth: 1, borderColor: 'rgba(201,152,58,0.3)', alignItems: 'center', justifyContent: 'center' },
  cardAvatarText: { fontFamily: typography.title, fontSize: 22, color: colors.gold2, fontWeight: '700' },
  cardBody: { flex: 1 },
  nameRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  campName: { fontFamily: typography.title, fontSize: 14, color: colors.parchment, fontWeight: '700', flex: 1, marginRight: 8 },
  campDesc: { fontFamily: typography.body, fontSize: 12, color: colors.muted, marginBottom: 6, lineHeight: 17 },
  codeValue: { fontFamily: typography.title, fontSize: 10, color: colors.gold2, letterSpacing: 1.5 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'center', padding: 24 },
  modalCard: { backgroundColor: colors.deep, borderRadius: 14, borderWidth: 1, borderColor: colors.border2, padding: 20 },
  modalTitle: { fontFamily: typography.title, fontSize: 16, color: colors.parchment, fontWeight: '700', marginBottom: 16, letterSpacing: 0.8 },
  codeInput: { fontSize: 20, letterSpacing: 4, textAlign: 'center' },
  charList: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  charChip: { borderRadius: 6, borderWidth: 1, borderColor: colors.border2, paddingHorizontal: 10, paddingVertical: 6, backgroundColor: 'rgba(255,255,255,0.02)' },
  charChipActive: { borderColor: colors.gold2, backgroundColor: 'rgba(232,192,96,0.08)' },
  charChipText: { fontFamily: typography.body, fontSize: 12, color: colors.muted },
  charChipTextActive: { color: colors.gold2 },
  modalBtns: { flexDirection: 'row', gap: 10, marginTop: 16 },
});
