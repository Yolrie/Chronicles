// src/screens/CampaignsScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
  TextInput,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { CampaignsStackParamList } from '../navigation/AppNavigator';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useCharactersStore } from '../stores/charactersStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import { Campaign } from '../types';
import { useChroniclesAlert } from '../components/AlertProvider';

type Props = NativeStackScreenProps<CampaignsStackParamList, 'CampaignsList'>;

// ── Portrait Corner Marks ─────────────────────────────────────────────────────

const PortraitCorners: React.FC = () => (
  <>
    <View style={[cStyles.hLine, cStyles.tlH]} />
    <View style={[cStyles.vLine, cStyles.tlV]} />
    <View style={[cStyles.hLine, cStyles.trH]} />
    <View style={[cStyles.vLine, cStyles.trV]} />
    <View style={[cStyles.hLine, cStyles.blH]} />
    <View style={[cStyles.vLine, cStyles.blV]} />
    <View style={[cStyles.hLine, cStyles.brH]} />
    <View style={[cStyles.vLine, cStyles.brV]} />
  </>
);

const cStyles = StyleSheet.create({
  hLine: { position: 'absolute', width: 8, height: 1.5, backgroundColor: colors.gold2 },
  vLine: { position: 'absolute', width: 1.5, height: 8, backgroundColor: colors.gold2 },
  tlH: { top: 0, left: 0 },
  tlV: { top: 0, left: 0 },
  trH: { top: 0, right: 0 },
  trV: { top: 0, right: 0 },
  blH: { bottom: 0, left: 0 },
  blV: { bottom: 0, left: 0 },
  brH: { bottom: 0, right: 0 },
  brV: { bottom: 0, right: 0 },
});

// ── Campaign Card ─────────────────────────────────────────────────────────────

const CampaignCard: React.FC<{ campaign: Campaign; onPress: () => void }> = ({
  campaign,
  onPress,
}) => {
  const { t } = useI18n();
  const isGM = campaign.my_role === 'game_master';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.72}>
      {/* Left — 64px square portrait placeholder */}
      <View style={styles.cardPortrait}>
        <PortraitCorners />
        <Text style={styles.cardPortraitIcon}>🏰</Text>
        <Text style={styles.cardPortraitInitial}>
          {campaign.name[0]?.toUpperCase() ?? '?'}
        </Text>
      </View>

      {/* Body */}
      <View style={styles.cardBody}>
        <View style={styles.nameRow}>
          <Text style={styles.campName} numberOfLines={1}>
            {campaign.name}
          </Text>
          {/* Role badge */}
          <Text
            style={[
              commonStyles.badge,
              isGM ? commonStyles.badgePurple : commonStyles.badgeGreen,
            ]}
          >
            {isGM ? t.campaigns.gm : t.campaigns.player}
          </Text>
        </View>

        {campaign.description ? (
          <Text style={styles.campDesc} numberOfLines={2}>
            {campaign.description}
          </Text>
        ) : null}

        {/* Invite code as parchment chip */}
        <View style={styles.codeChip}>
          <Text style={styles.codeChipLabel}>CODE</Text>
          <Text style={styles.codeChipValue}>{campaign.invite_code}</Text>
        </View>
      </View>

      {/* Right arrow */}
      <Text style={styles.cardArrow}>›</Text>
    </TouchableOpacity>
  );
};

// ── Empty state ───────────────────────────────────────────────────────────────

const EmptyState: React.FC = () => {
  const { t } = useI18n();
  return (
    <View style={styles.emptyCard}>
      <Text style={styles.emptyDiamond}>◆</Text>
      <Text style={styles.emptyText}>{t.campaigns.noCampaigns}</Text>
    </View>
  );
};

// ── Main Screen ───────────────────────────────────────────────────────────────

const CampaignsScreen: React.FC<Props> = ({ navigation }) => {
  const { campaigns, loading, fetchCampaigns, joinCampaign } = useCampaignsStore();
  const { characters, fetchCharacters } = useCharactersStore();
  const { t } = useI18n();
  const { showAlert } = useChroniclesAlert();

  const [refreshing, setRefreshing] = useState(false);
  const [joinModal, setJoinModal] = useState(false);
  const [inviteCode, setInviteCode] = useState('');
  const [selectedCharId, setSelectedCharId] = useState('');
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchCampaigns();
    fetchCharacters();
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchCampaigns();
    setRefreshing(false);
  }, [fetchCampaigns]);

  function openJoinModal() {
    setInviteCode('');
    setSelectedCharId('');
    setJoinModal(true);
  }

  async function handleJoin() {
    if (!inviteCode.trim()) {
      showAlert({
        title: t.common.error,
        message: t.campaigns.inviteCodeLabel,
        icon: '⚠️',
      });
      return;
    }
    setJoining(true);
    const result = await joinCampaign(inviteCode.trim(), selectedCharId || undefined);
    setJoining(false);
    setJoinModal(false);
    setInviteCode('');
    setSelectedCharId('');

    if (result === 'ok') {
      showAlert({ title: t.campaigns.joined, icon: '⚔️' });
    } else if (result === 'not_found') {
      showAlert({ title: t.common.error, message: t.campaigns.notFound, icon: '⚠️' });
    } else if (result === 'already') {
      showAlert({ title: t.campaigns.alreadyMember, icon: '◆' });
    } else {
      showAlert({ title: t.common.error, message: t.campaigns.errorJoining, icon: '⚠️' });
    }
  }

  const ListHeader = (
    <View style={styles.actions}>
      {/* Crimson CTA — create */}
      <TouchableOpacity
        style={commonStyles.primaryCta}
        onPress={() => navigation.navigate('CampaignForm')}
        activeOpacity={0.8}
      >
        <Text style={commonStyles.primaryCtaText}>{t.campaigns.createCampaign}</Text>
      </TouchableOpacity>

      {/* Parchment info banner between CTAs */}
      <View style={styles.parchmentInfoBanner}>
        <Text style={styles.parchmentInfoText}>◆ {t.campaigns.joinWithCode} ◆</Text>
        <Text style={styles.parchmentInfoSub}>Rejoignez une aventure avec un code d'invitation</Text>
      </View>

      {/* Gold CTA — join */}
      <TouchableOpacity
        style={commonStyles.goldCta}
        onPress={openJoinModal}
        activeOpacity={0.8}
      >
        <Text style={commonStyles.goldCtaText}>{t.campaigns.joinWithCode}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <FlatList
        data={campaigns}
        keyExtractor={c => c.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing || loading}
            onRefresh={onRefresh}
            tintColor={colors.gold2}
            colors={[colors.gold2]}
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={!loading ? <EmptyState /> : null}
        renderItem={({ item }) => (
          <CampaignCard
            campaign={item}
            onPress={() => navigation.navigate('CampaignDetail', { campaignId: item.id })}
          />
        )}
      />

      {/* ── Join Modal ───────────────────────────────────────────────────────── */}
      <Modal
        visible={joinModal}
        transparent
        animationType="fade"
        onRequestClose={() => setJoinModal(false)}
        statusBarTranslucent
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            {/* Thick gold top bar (4px) */}
            <View style={styles.modalTopBar} />

            {/* Ornamental title row */}
            <View style={styles.modalTitleRow}>
              <View style={styles.modalTitleLine} />
              <Text style={styles.modalTitle}>{t.campaigns.joinWithCode}</Text>
              <View style={styles.modalTitleLine} />
            </View>

            <View style={styles.modalInner}>
              {/* Code input */}
              <Text style={commonStyles.fieldLabel}>{t.campaigns.inviteCodeLabel}</Text>
              <TextInput
                style={styles.codeInput}
                value={inviteCode}
                onChangeText={v => setInviteCode(v.toUpperCase())}
                placeholder={t.campaigns.inviteCodePlaceholder}
                placeholderTextColor={colors.subtle}
                autoCapitalize="characters"
                maxLength={12}
                autoCorrect={false}
              />

              {/* Character chips */}
              {characters.length > 0 && (
                <>
                  <Text style={[commonStyles.fieldLabel, { marginTop: 14 }]}>
                    {t.campaigns.selectCharacter}
                  </Text>
                  <View style={styles.charList}>
                    {characters.map(c => {
                      const active = selectedCharId === c.id;
                      return (
                        <TouchableOpacity
                          key={c.id}
                          style={[styles.charChip, active && styles.charChipActive]}
                          onPress={() =>
                            setSelectedCharId(active ? '' : c.id)
                          }
                          activeOpacity={0.75}
                        >
                          <Text
                            style={[
                              styles.charChipText,
                              active && styles.charChipTextActive,
                            ]}
                          >
                            {c.name}
                            {c.level ? ` · Niv ${c.level}` : ''}
                          </Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                </>
              )}

              {/* Buttons */}
              <View style={styles.modalBtns}>
                <TouchableOpacity
                  style={[commonStyles.ghostButton, { flex: 1 }]}
                  onPress={() => setJoinModal(false)}
                  activeOpacity={0.8}
                >
                  <Text style={commonStyles.ghostButtonText}>{t.common.cancel}</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[commonStyles.primaryCta, { flex: 1 }, joining && { opacity: 0.6 }]}
                  onPress={handleJoin}
                  disabled={joining}
                  activeOpacity={0.8}
                >
                  {joining ? (
                    <ActivityIndicator color="#F2E8C6" />
                  ) : (
                    <Text style={commonStyles.primaryCtaText}>{t.campaigns.join}</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default CampaignsScreen;

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.ink,
  },

  list: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 36,
  },

  // ── Header action buttons ─────────────────────────────────────────────────

  actions: {
    gap: 10,
    marginBottom: 20,
  },

  // Parchment info banner between CTAs
  parchmentInfoBanner: {
    backgroundColor: colors.parchment,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: '#8B7350',
    paddingVertical: 10,
    paddingHorizontal: 14,
    alignItems: 'center',
  },
  parchmentInfoText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.parchmentInk,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  parchmentInfoSub: {
    fontSize: 12,
    color: '#5C4030',
    textAlign: 'center',
  },

  // ── Campaign card ─────────────────────────────────────────────────────────

  card: {
    backgroundColor: '#0E1420',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border2,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },

  // 64px square portrait placeholder with corner marks
  cardPortrait: {
    width: 64,
    height: 64,
    backgroundColor: colors.deep,
    borderWidth: 1,
    borderColor: colors.border2,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    borderRadius: 4,
    flexShrink: 0,
  },
  cardPortraitIcon: {
    fontSize: 24,
    lineHeight: 28,
  },
  cardPortraitInitial: {
    fontFamily: typography.title,
    fontSize: 11,
    color: colors.gold2,
    fontWeight: '700',
    marginTop: 2,
  },

  cardBody: {
    flex: 1,
  },

  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
    gap: 8,
  },
  campName: {
    fontFamily: typography.title,
    fontSize: 14,
    color: colors.parchment,
    fontWeight: '700',
    flex: 1,
    letterSpacing: 0.3,
  },
  campDesc: {
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 6,
  },

  // Parchment chip for invite code
  codeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(242,232,198,0.08)',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'rgba(242,232,198,0.18)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  codeChipLabel: {
    fontFamily: typography.title,
    fontSize: 7,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },
  codeChipValue: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold2,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },

  cardArrow: {
    fontFamily: typography.title,
    fontSize: 22,
    color: colors.border2,
    lineHeight: 26,
    flexShrink: 0,
  },

  // ── Empty state ───────────────────────────────────────────────────────────

  emptyCard: {
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 40,
    paddingHorizontal: 24,
    alignItems: 'center',
    gap: 14,
  },
  emptyDiamond: {
    fontFamily: typography.title,
    fontSize: 28,
    color: colors.border2,
  },
  emptyText: {
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 22,
  },

  // ── Join modal ────────────────────────────────────────────────────────────

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },

  modalCard: {
    backgroundColor: '#090C14',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border2,
    overflow: 'hidden',
    shadowColor: colors.gold2,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 16,
  },

  // 4px gold accent bar at top — thicker for modal
  modalTopBar: {
    height: 4,
    backgroundColor: colors.gold2,
  },

  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 22,
    paddingTop: 16,
    paddingBottom: 4,
    gap: 10,
  },
  modalTitleLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border2,
    opacity: 0.5,
  },
  modalTitle: {
    fontFamily: typography.title,
    fontSize: 13,
    color: colors.gold2,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },

  modalInner: {
    padding: 22,
    paddingTop: 14,
  },

  codeInput: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 14,
    paddingVertical: 14,
    color: colors.parchment,
    fontFamily: typography.title,
    fontSize: 22,
    backgroundColor: 'rgba(14,20,32,0.9)',
    letterSpacing: 5,
    textAlign: 'center',
    marginBottom: 4,
  },

  charList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 6,
  },

  charChip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 12,
    paddingVertical: 7,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  charChipActive: {
    borderColor: colors.gold2,
    backgroundColor: 'rgba(201,168,76,0.1)',
  },
  charChipText: {
    fontSize: 13,
    color: colors.muted,
  },
  charChipTextActive: {
    color: colors.gold2,
    fontWeight: '600',
  },

  modalBtns: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 20,
  },
});
