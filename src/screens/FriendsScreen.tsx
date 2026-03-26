// src/screens/FriendsScreen.tsx

import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFriendsStore } from '../stores/friendsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

interface Profile {
  id: string;
  username: string;
  avatar_url?: string;
}

interface FriendEntry {
  id: string;
  friend: Profile;
  status: 'pending' | 'accepted';
  direction: 'sent' | 'received';
  mutual_campaigns_count?: number;
}

function AvatarLetter({ name, size = 42 }: { name: string; size?: number }) {
  return (
    <View
      style={[
        styles.avatarWrap,
        { width: size, height: size, borderRadius: size / 2 },
      ]}
    >
      <Text style={[styles.avatarLetter, { fontSize: size * 0.4 }]}>
        {name[0]?.toUpperCase() ?? '?'}
      </Text>
    </View>
  );
}

const FriendsScreen: React.FC = () => {
  const {
    friends,
    pendingReceived,
    pendingSent,
    searchResults,
    loading,
    fetchFriends,
    sendFriendRequest,
    acceptFriendRequest,
    declineFriendRequest,
    removeFriend,
    searchUsers,
  } = useFriendsStore() as {
    friends: FriendEntry[];
    pendingReceived: FriendEntry[];
    pendingSent: FriendEntry[];
    searchResults: Profile[];
    loading: boolean;
    fetchFriends: () => Promise<void>;
    sendFriendRequest: (username: string) => Promise<'ok' | 'not_found' | 'already' | 'error'>;
    acceptFriendRequest: (friendshipId: string) => Promise<void>;
    declineFriendRequest: (friendshipId: string) => Promise<void>;
    removeFriend: (friendshipId: string) => Promise<void>;
    searchUsers: (q: string) => Promise<void>;
  };

  const { t } = useI18n();

  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addUsername, setAddUsername] = useState('');
  const [addLoading, setAddLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchFriends();
  }, []);

  async function onRefresh() {
    setRefreshing(true);
    await fetchFriends();
    setRefreshing(false);
  }

  // Debounced search
  useEffect(() => {
    if (searchQuery.trim().length < 2) return;
    const timer = setTimeout(() => {
      searchUsers(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const displayedFriends = searchQuery.trim().length >= 2
    ? friends.filter(f =>
        f.friend.username.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : friends;

  async function handleSendRequest() {
    if (!addUsername.trim()) return;
    setAddLoading(true);
    const result = await sendFriendRequest(addUsername.trim());
    setAddLoading(false);

    if (result === 'ok') {
      const sentTo = addUsername.trim();
      setAddUsername('');
      setShowAddModal(false);
      Alert.alert(t.friends.successSent, sentTo);
    } else if (result === 'not_found') {
      Alert.alert(t.common.error, t.friends.errorNotFound);
    } else if (result === 'already') {
      Alert.alert(t.common.error, t.friends.errorAlreadyFriend);
    } else {
      Alert.alert(t.common.error, t.common.error);
    }
  }

  function handleRemoveFriend(entry: FriendEntry) {
    Alert.alert(
      t.friends.removeConfirmTitle,
      `${entry.friend.username} — ${t.friends.removeConfirmMsg}`,
      [
        { text: t.friends.cancel, style: 'cancel' },
        {
          text: t.friends.remove,
          style: 'destructive',
          onPress: () => removeFriend(entry.id),
        },
      ],
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t.friends.title}</Text>
        <TouchableOpacity
          style={commonStyles.goldCta}
          onPress={() => setShowAddModal(true)}
        >
          <Text style={commonStyles.goldCtaText}>{t.friends.add}</Text>
        </TouchableOpacity>
      </View>

      {/* Search bar */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t.friends.searchPlaceholder}
          placeholderTextColor={colors.muted}
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Text style={styles.searchClear}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />
        }
      >
        {/* ── Demandes reçues ── */}
        {pendingReceived.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeaderRow}>
              <Text style={commonStyles.sectionTitle}>{t.friends.received}</Text>
              <View style={styles.countPill}>
                <Text style={styles.countPillText}>{pendingReceived.length}</Text>
              </View>
            </View>
            {pendingReceived.map(entry => (
              <View key={entry.id} style={[commonStyles.card, styles.pendingCard]}>
                <AvatarLetter name={entry.friend.username} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{entry.friend.username}</Text>
                  <Text style={styles.friendMeta}>{t.friends.wants}</Text>
                </View>
                <View style={styles.pendingActions}>
                  <TouchableOpacity
                    style={styles.acceptBtn}
                    onPress={() => acceptFriendRequest(entry.id)}
                  >
                    <Text style={styles.acceptBtnText}>✓</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.declineBtn}
                    onPress={() => declineFriendRequest(entry.id)}
                  >
                    <Text style={styles.declineBtnText}>✕</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Demandes envoyées ── */}
        {pendingSent.length > 0 && (
          <View style={styles.section}>
            <Text style={commonStyles.sectionTitle}>{t.friends.sent}</Text>
            {pendingSent.map(entry => (
              <View key={entry.id} style={[commonStyles.card, styles.pendingCard]}>
                <AvatarLetter name={entry.friend.username} />
                <View style={{ flex: 1 }}>
                  <Text style={styles.friendName}>{entry.friend.username}</Text>
                  <Text style={styles.friendMeta}>{t.friends.waiting}</Text>
                </View>
                <View style={styles.sentPill}>
                  <Text style={styles.sentPillText}>{t.friends.sentBadge}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* ── Mes amis ── */}
        <View style={styles.section}>
          <Text style={commonStyles.sectionTitle}>
            {t.friends.myFriends} ({displayedFriends.length})
          </Text>

          {loading && friends.length === 0 ? (
            <View style={styles.loadingWrap}>
              <ActivityIndicator color={colors.gold2} />
            </View>
          ) : displayedFriends.length === 0 ? (
            <View style={[commonStyles.card, styles.emptyCard]}>
              <Text style={styles.emptyIcon}>⚔️</Text>
              <Text style={styles.emptyTitle}>
                {searchQuery.trim() ? t.common.error : t.friends.emptyFriends}
              </Text>
              <Text style={styles.emptySubtitle}>
                {searchQuery.trim()
                  ? `"${searchQuery}"`
                  : t.friends.emptyFriends}
              </Text>
            </View>
          ) : (
            displayedFriends.map(entry => (
              <TouchableOpacity
                key={entry.id}
                style={commonStyles.card}
                onLongPress={() => handleRemoveFriend(entry)}
                activeOpacity={0.75}
              >
                <View style={styles.friendRow}>
                  <AvatarLetter name={entry.friend.username} />
                  <View style={{ flex: 1 }}>
                    <Text style={styles.friendName}>{entry.friend.username}</Text>
                    {entry.mutual_campaigns_count !== undefined &&
                      entry.mutual_campaigns_count > 0 && (
                        <Text style={styles.friendMeta}>
                          {entry.mutual_campaigns_count} campagne
                          {entry.mutual_campaigns_count > 1 ? 's' : ''} en commun
                        </Text>
                      )}
                  </View>
                  <Text style={styles.friendArrow}>›</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>

        <Text style={styles.hint}>
          {t.friends.longPressHint}
        </Text>
      </ScrollView>

      {/* ── Modal: Ajouter un ami ── */}
      <Modal
        visible={showAddModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddModal(false)}
      >
        <Pressable style={styles.modalScrim} onPress={() => setShowAddModal(false)}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalKav}
          >
            <Pressable style={styles.modalSheet} onPress={e => e.stopPropagation()}>
              <View style={styles.modalHandle} />
              <Text style={styles.modalTitle}>{t.friends.addTitle}</Text>
              <Text style={styles.modalSubtitle}>
                {t.friends.addSubtitle}
              </Text>

              <View style={commonStyles.fieldWrap}>
                <Text style={commonStyles.fieldLabel}>{t.friends.usernameLabel}</Text>
                <TextInput
                  style={commonStyles.input}
                  value={addUsername}
                  onChangeText={setAddUsername}
                  placeholder={t.friends.usernamePlaceholder}
                  placeholderTextColor={colors.muted}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoFocus
                  onSubmitEditing={handleSendRequest}
                  returnKeyType="send"
                />
              </View>

              <TouchableOpacity
                style={[commonStyles.primaryCta, addLoading && { opacity: 0.6 }]}
                onPress={handleSendRequest}
                disabled={addLoading || !addUsername.trim()}
              >
                {addLoading ? (
                  <ActivityIndicator color="#f5e0e0" />
                ) : (
                  <Text style={commonStyles.primaryCtaText}>{t.friends.sendRequest}</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[commonStyles.ghostButton, { marginTop: 10 }]}
                onPress={() => setShowAddModal(false)}
              >
                <Text style={commonStyles.ghostButtonText}>{t.friends.cancel}</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

export default FriendsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingBottom: 40 },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 12,
  },
  headerTitle: {
    fontFamily: typography.title,
    fontSize: 20,
    color: colors.parchment,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 12,
  },
  searchIcon: { fontSize: 14, marginRight: 8, color: colors.muted },
  searchInput: {
    flex: 1,
    fontFamily: typography.body,
    fontSize: 15,
    color: colors.parchment,
    paddingVertical: 11,
  },
  searchClear: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.muted,
    paddingLeft: 8,
  },

  section: { marginBottom: 20 },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },

  pendingCard: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  pendingActions: { flexDirection: 'row', gap: 8 },
  acceptBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(20,80,40,0.2)',
    borderWidth: 1,
    borderColor: 'rgba(50,160,80,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtnText: { fontSize: 15, color: '#70c090', fontWeight: '700' },
  declineBtn: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: 'rgba(120,24,40,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(158,44,60,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  declineBtnText: { fontSize: 15, color: '#e07070', fontWeight: '700' },

  sentPill: {
    backgroundColor: 'rgba(58,90,120,0.12)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(58,90,120,0.35)',
  },
  sentPillText: {
    fontFamily: typography.title,
    fontSize: 9,
    color: '#7090b8',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  friendRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  friendName: {
    fontFamily: typography.title,
    fontSize: 14,
    color: colors.parchment,
    fontWeight: '700',
  },
  friendMeta: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.muted,
    marginTop: 2,
  },
  friendArrow: {
    fontFamily: typography.title,
    fontSize: 20,
    color: colors.muted,
  },

  avatarWrap: {
    backgroundColor: 'rgba(80,20,120,0.20)',
    borderWidth: 1,
    borderColor: 'rgba(160,100,220,0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarLetter: {
    fontFamily: typography.title,
    color: '#b080e0',
    fontWeight: '700',
  },

  countPill: {
    backgroundColor: colors.crimson2,
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 5,
  },
  countPillText: {
    fontFamily: typography.title,
    fontSize: 9,
    color: '#fff',
    fontWeight: '700',
  },

  loadingWrap: { paddingVertical: 24, alignItems: 'center' },

  emptyCard: { alignItems: 'center', paddingVertical: 32 },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyTitle: {
    fontFamily: typography.title,
    fontSize: 14,
    color: colors.parchment,
    fontWeight: '700',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 18,
  },

  hint: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.subtle,
    textAlign: 'center',
    marginBottom: 20,
    fontStyle: 'italic',
  },

  // Modal
  modalScrim: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    justifyContent: 'flex-end',
  },
  modalKav: { justifyContent: 'flex-end' },
  modalSheet: {
    backgroundColor: colors.deep,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderBottomWidth: 0,
    borderColor: colors.border2,
    padding: 24,
    paddingBottom: 32,
  },
  modalHandle: {
    alignSelf: 'center',
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: colors.border2,
    marginBottom: 20,
  },
  modalTitle: {
    fontFamily: typography.title,
    fontSize: 17,
    color: colors.parchment,
    fontWeight: '700',
    marginBottom: 6,
    letterSpacing: 0.4,
  },
  modalSubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
    marginBottom: 18,
  },
});
