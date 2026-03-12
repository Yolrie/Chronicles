// src/screens/SessionScheduleScreen.tsx

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Linking,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useCampaignsStore } from '../stores/campaignsStore';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';

type RouteParams = { campaignId: string };

const DURATION_OPTIONS = [60, 90, 120, 180, 240];

function durationLabel(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h${m}`;
}

const SessionScheduleScreen: React.FC = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<{ params: RouteParams }, 'params'>>();
  const { campaignId } = route.params;
  const { createCampaignSession } = useCampaignsStore() as any;
  const { t } = useI18n();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(120);
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [isOnline, setIsOnline] = useState(false);
  const [meetingLink, setMeetingLink] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [createdSession, setCreatedSession] = useState<any>(null);

  function buildCalendarUrl() {
    // Encodes event data into a calurl:// deep link for native calendar apps
    const startIso = `${date}T${time || '00:00'}`.replace(/[-:]/g, '');
    const endDate = date;
    const params = new URLSearchParams({
      title: title || 'Session de jeu',
      dtstart: startIso,
      dtend: startIso,
      description: description || '',
      location: isOnline ? (meetingLink || 'En ligne') : location,
    });
    return `calurl://event?${params.toString()}`;
  }

  async function handleOpenCalendar() {
    const url = buildCalendarUrl();
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert(t.sessions.openLink, t.sessions.successMsg);
      }
    } catch {
      Alert.alert(t.common.error, t.common.error);
    }
  }

  async function handleSubmit() {
    if (!title.trim()) {
      Alert.alert(t.sessions.errorTitle, t.sessions.errorTitle);
      return;
    }
    if (!date.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      Alert.alert(t.common.error, t.sessions.errorDate);
      return;
    }
    if (!time.trim() || !/^\d{2}:\d{2}$/.test(time)) {
      Alert.alert(t.common.error, t.sessions.errorTime);
      return;
    }

    setSubmitting(true);
    try {
      const session = await createCampaignSession({
        campaign_id: campaignId,
        title: title.trim(),
        scheduled_date: date,
        scheduled_time: time,
        duration_minutes: duration,
        description: description.trim() || undefined,
        location: location.trim() || undefined,
        is_online: isOnline,
        meeting_link: isOnline ? meetingLink.trim() || undefined : undefined,
      });
      setCreatedSession(session);
      setSubmitted(true);
      Alert.alert(
        t.sessions.successTitle,
        t.sessions.successMsg,
        [{ text: 'OK' }],
      );
    } catch (err: any) {
      Alert.alert('Erreur', err?.message ?? 'Une erreur est survenue.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{t.sessions.scheduleTitle}</Text>
          <Text style={styles.headerSubtitle}>{t.sessions.scheduleSubtitle}</Text>
        </View>

        {/* ── Titre ── */}
        <View style={commonStyles.fieldWrap}>
          <Text style={commonStyles.fieldLabel}>{t.sessions.sessionTitleLabel}</Text>
          <TextInput
            style={commonStyles.input}
            value={title}
            onChangeText={setTitle}
            placeholder={t.sessions.sessionTitlePlaceholder}
            placeholderTextColor={colors.muted}
          />
        </View>

        {/* ── Date ── */}
        <View style={styles.row}>
          <View style={[commonStyles.fieldWrap, { flex: 1, marginRight: 8 }]}>
            <Text style={commonStyles.fieldLabel}>{t.sessions.dateLabel}</Text>
            <TextInput
              style={commonStyles.input}
              value={date}
              onChangeText={setDate}
              placeholder={t.sessions.datePlaceholder}
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              maxLength={10}
            />
          </View>

          {/* ── Heure ── */}
          <View style={[commonStyles.fieldWrap, { flex: 1 }]}>
            <Text style={commonStyles.fieldLabel}>{t.sessions.timeLabel}</Text>
            <TextInput
              style={commonStyles.input}
              value={time}
              onChangeText={setTime}
              placeholder={t.sessions.timePlaceholder}
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
              maxLength={5}
            />
          </View>
        </View>

        {/* ── Durée ── */}
        <View style={commonStyles.fieldWrap}>
          <Text style={commonStyles.fieldLabel}>{t.sessions.durationLabel}</Text>
          <View style={styles.chipRow}>
            {DURATION_OPTIONS.map(d => (
              <TouchableOpacity
                key={d}
                style={[styles.chip, duration === d && styles.chipActive]}
                onPress={() => setDuration(d)}
              >
                <Text style={[styles.chipText, duration === d && styles.chipTextActive]}>
                  {durationLabel(d)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Description ── */}
        <View style={commonStyles.fieldWrap}>
          <Text style={commonStyles.fieldLabel}>{t.sessions.descriptionLabel}</Text>
          <TextInput
            style={[commonStyles.input, { minHeight: 80, textAlignVertical: 'top' }]}
            value={description}
            onChangeText={setDescription}
            placeholder={t.sessions.descriptionPlaceholder}
            placeholderTextColor={colors.muted}
            multiline
          />
        </View>

        {/* ── En ligne toggle ── */}
        <View style={commonStyles.fieldWrap}>
          <Text style={commonStyles.fieldLabel}>{t.sessions.formatLabel}</Text>
          <View style={styles.toggleRow}>
            <TouchableOpacity
              style={[styles.chip, !isOnline && styles.chipActive]}
              onPress={() => setIsOnline(false)}
            >
              <Text style={[styles.chipText, !isOnline && styles.chipTextActive]}>{t.sessions.inPerson}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.chip, isOnline && styles.chipActive]}
              onPress={() => setIsOnline(true)}
            >
              <Text style={[styles.chipText, isOnline && styles.chipTextActive]}>{t.sessions.online}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Lieu (présentiel) ── */}
        {!isOnline && (
          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessions.locationLabel}</Text>
            <TextInput
              style={commonStyles.input}
              value={location}
              onChangeText={setLocation}
              placeholder={t.sessions.locationPlaceholder}
              placeholderTextColor={colors.muted}
            />
          </View>
        )}

        {/* ── Lien de réunion (en ligne) ── */}
        {isOnline && (
          <View style={commonStyles.fieldWrap}>
            <Text style={commonStyles.fieldLabel}>{t.sessions.meetingLinkLabel}</Text>
            <TextInput
              style={commonStyles.input}
              value={meetingLink}
              onChangeText={setMeetingLink}
              placeholder={t.sessions.meetingLinkPlaceholder}
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="url"
            />
          </View>
        )}

        {/* ── Carte info notifications ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoIcon}>🔔</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.infoTitle}>{t.sessions.notificationsTitle}</Text>
            <Text style={styles.infoBody}>{t.sessions.notificationsDesc}</Text>
          </View>
        </View>

        {/* ── Bouton planifier ── */}
        <TouchableOpacity
          style={[commonStyles.primaryCta, { marginBottom: 12 }, submitting && { opacity: 0.6 }]}
          onPress={handleSubmit}
          disabled={submitting || submitted}
        >
          {submitting ? (
            <ActivityIndicator color="#f5e0e0" />
          ) : (
            <Text style={commonStyles.primaryCtaText}>
              {submitted ? `✓ ${t.sessions.successTitle}` : t.sessions.schedule}
            </Text>
          )}
        </TouchableOpacity>

        {/* ── Bouton ajouter au calendrier ── */}
        {submitted && (
          <TouchableOpacity
            style={[commonStyles.goldCta, { marginBottom: 12 }]}
            onPress={handleOpenCalendar}
          >
            <Text style={commonStyles.goldCtaText}>📅 Ajouter au calendrier</Text>
          </TouchableOpacity>
        )}

        {submitted && (
          <View style={styles.calNote}>
            <Text style={styles.calNoteText}>
              Le bouton "Ajouter au calendrier" ouvre l'application Calendrier native de votre appareil via le schéma{' '}
              <Text style={{ color: colors.gold }}>calurl://</Text>. Sur certains appareils, cette redirection peut ne pas être disponible.
            </Text>
          </View>
        )}

        {/* ── Retour ── */}
        <TouchableOpacity
          style={[commonStyles.ghostButton, { marginBottom: 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Text style={commonStyles.ghostButtonText}>← Retour</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SessionScheduleScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 20, paddingBottom: 40 },

  header: {
    marginBottom: 20,
  },
  headerTitle: {
    fontFamily: typography.title,
    fontSize: 20,
    color: colors.parchment,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  headerSubtitle: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.muted,
    lineHeight: 20,
  },

  row: {
    flexDirection: 'row',
  },

  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  toggleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  chipActive: {
    borderColor: colors.gold2,
    backgroundColor: 'rgba(212,168,64,0.10)',
  },
  chipText: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
  },
  chipTextActive: {
    color: colors.gold2,
    fontWeight: '600',
  },

  infoCard: {
    flexDirection: 'row',
    gap: 12,
    backgroundColor: 'rgba(58,90,120,0.12)',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(58,90,120,0.35)',
    padding: 14,
    marginBottom: 20,
  },
  infoIcon: {
    fontSize: 22,
    marginTop: 2,
  },
  infoTitle: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.parchment,
    fontWeight: '700',
    letterSpacing: 0.4,
    marginBottom: 4,
  },
  infoBody: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 19,
  },

  calNote: {
    backgroundColor: colors.deep,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 16,
  },
  calNoteText: {
    fontFamily: typography.body,
    fontSize: 12,
    color: colors.muted,
    lineHeight: 18,
  },
});
