// src/screens/BadgesScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useBadgesStore } from '../stores/badgesStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

type BadgeCategory = 'all' | 'general' | 'campaign' | 'character' | 'social' | 'milestone';

interface BadgeWithStatus {
  id: string;
  name_fr: string;
  name_en: string;
  desc_fr: string;
  desc_en: string;
  icon: string;
  category: string;
  is_rare: boolean;
  awarded_at?: string;
  earned: boolean;
}

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function BadgeCard({ badge, earnedOnLabel, lockedLabel, rareLabel }: { badge: BadgeWithStatus; earnedOnLabel: string; lockedLabel: string; rareLabel: string }) {
  return (
    <View
      style={[
        styles.badgeCard,
        badge.is_rare && styles.badgeCardRare,
        !badge.earned && styles.badgeCardLocked,
      ]}
    >
      {/* Icon */}
      <View style={[styles.iconWrap, badge.is_rare && styles.iconWrapRare]}>
        <Text style={styles.icon}>{badge.icon}</Text>
      </View>

      {/* Name */}
      <Text style={[styles.badgeName, !badge.earned && styles.badgeNameLocked]} numberOfLines={2}>
        {badge.name_fr}
      </Text>

      {/* Description */}
      <Text style={styles.badgeDesc} numberOfLines={3}>
        {badge.desc_fr}
      </Text>

      {/* Date ou verrou */}
      {badge.earned && badge.awarded_at ? (
        <View style={styles.dateWrap}>
          <Text style={styles.dateLabel}>{earnedOnLabel}</Text>
          <Text style={styles.dateValue}>{formatDate(badge.awarded_at)}</Text>
        </View>
      ) : !badge.earned ? (
        <View style={styles.lockedOverlay}>
          <Text style={styles.lockIcon}>🔒</Text>
          <Text style={styles.lockedText}>{lockedLabel}</Text>
        </View>
      ) : null}

      {/* Rare indicator */}
      {badge.is_rare && badge.earned && (
        <View style={styles.rarePill}>
          <Text style={styles.rarePillText}>✦ {rareLabel}</Text>
        </View>
      )}
    </View>
  );
}

const BadgesScreen: React.FC = () => {
  const { badges, fetchBadges } = useBadgesStore() as {
    badges: BadgeWithStatus[];
    fetchBadges: () => Promise<void>;
  };
  const { t } = useI18n();

  const categoryFilters: { key: BadgeCategory; label: string }[] = [
    { key: 'all', label: t.badges.categories.all },
    { key: 'general', label: t.badges.categories.general },
    { key: 'campaign', label: t.badges.categories.campaign },
    { key: 'character', label: t.badges.categories.character },
    { key: 'social', label: t.badges.categories.social },
    { key: 'milestone', label: t.badges.categories.milestone },
  ];

  const [filter, setFilter] = useState<BadgeCategory>('all');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    await fetchBadges();
    setLoading(false);
  }

  async function onRefresh() {
    setRefreshing(true);
    await fetchBadges();
    setRefreshing(false);
  }

  const filtered = filter === 'all' ? badges : badges.filter(b => b.category === filter);
  const earnedCount = badges.filter(b => b.earned).length;

  if (loading && badges.length === 0) {
    return (
      <View style={styles.center}>
        <ActivityIndicator color={colors.gold2} size="large" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>{t.badges.title}</Text>
          <Text style={styles.headerSubtitle}>
            {earnedCount} / {badges.length} obtenus
          </Text>
        </View>
        <View style={styles.trophyWrap}>
          <Text style={styles.trophyIcon}>🏆</Text>
          <Text style={styles.trophyCount}>{earnedCount}</Text>
        </View>
      </View>

      {/* Filter chips */}
      <View style={styles.filtersWrap}>
        <FlatList
          data={categoryFilters}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={item => item.key}
          contentContainerStyle={styles.filters}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[styles.filterChip, filter === item.key && styles.filterChipActive]}
              onPress={() => setFilter(item.key)}
            >
              <Text style={[styles.filterText, filter === item.key && styles.filterTextActive]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {/* Badge grid */}
      {filtered.length === 0 ? (
        <View style={[commonStyles.card, styles.empty]}>
          <Text style={styles.emptyIcon}>🎖</Text>
          <Text style={styles.emptyText}>{t.badges.empty}</Text>
        </View>
      ) : (
        <FlatList
          data={filtered}
          numColumns={2}
          keyExtractor={item => item.id}
          columnWrapperStyle={styles.gridRow}
          contentContainerStyle={styles.grid}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.gold2} />
          }
          renderItem={({ item }) => <BadgeCard badge={item} earnedOnLabel={t.badges.earnedOn} lockedLabel={t.badges.locked} rareLabel={t.badges.rare} />}
        />
      )}
    </SafeAreaView>
  );
};

export default BadgesScreen;

const CARD_SIZE = '48%';

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  center: { flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' },

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
  headerSubtitle: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    marginTop: 3,
  },
  trophyWrap: {
    alignItems: 'center',
    backgroundColor: 'rgba(184,146,42,0.10)',
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  trophyIcon: { fontSize: 20 },
  trophyCount: {
    fontFamily: typography.title,
    fontSize: 16,
    color: colors.gold2,
    fontWeight: '700',
  },

  filtersWrap: {
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    marginBottom: 4,
  },
  filters: { paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  filterChip: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  filterChipActive: {
    borderColor: colors.gold2,
    backgroundColor: 'rgba(212,168,64,0.10)',
  },
  filterText: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  filterTextActive: { color: colors.gold2 },

  grid: { paddingHorizontal: 12, paddingTop: 10, paddingBottom: 40 },
  gridRow: { justifyContent: 'space-between', marginBottom: 12 },

  badgeCard: {
    width: CARD_SIZE,
    backgroundColor: colors.deep,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.24,
    shadowRadius: 5,
    elevation: 3,
    position: 'relative',
    overflow: 'hidden',
  },
  badgeCardRare: {
    borderWidth: 1.5,
    borderColor: colors.gold2,
    backgroundColor: 'rgba(24,19,16,1)',
  },
  badgeCardLocked: {
    opacity: 0.6,
  },

  iconWrap: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  iconWrapRare: {
    backgroundColor: 'rgba(184,146,42,0.12)',
    borderColor: colors.gold2,
  },
  icon: { fontSize: 30 },

  badgeName: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.parchment,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 0.3,
    marginBottom: 6,
  },
  badgeNameLocked: { color: colors.muted },

  badgeDesc: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.muted,
    textAlign: 'center',
    lineHeight: 15,
    marginBottom: 8,
  },

  dateWrap: { alignItems: 'center' },
  dateLabel: {
    fontFamily: typography.body,
    fontSize: 9,
    color: colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  dateValue: {
    fontFamily: typography.title,
    fontSize: 10,
    color: colors.gold,
    marginTop: 1,
  },

  lockedOverlay: {
    alignItems: 'center',
    marginTop: 4,
  },
  lockIcon: { fontSize: 16, marginBottom: 2 },
  lockedText: {
    fontFamily: typography.body,
    fontSize: 10,
    color: colors.subtle,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },

  rarePill: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(184,146,42,0.18)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 1,
    borderColor: colors.gold3,
  },
  rarePillText: {
    fontFamily: typography.title,
    fontSize: 8,
    color: colors.gold2,
    letterSpacing: 0.5,
  },

  empty: {
    margin: 16,
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyIcon: { fontSize: 36, marginBottom: 10 },
  emptyText: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
  },
});
