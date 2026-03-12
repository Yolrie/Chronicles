// src/screens/PremiumScreen.tsx
// Écran "Fonctionnalités Premium" — aperçu des features à venir, sans prix ni date

import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useI18n } from '../i18n';
import { colors, commonStyles, typography } from '../styles/common';
import ImagePlaceholder from '../components/ImagePlaceholder';

const PremiumScreen: React.FC = () => {
  const { t } = useI18n();
  const features = t.premium.features;

  return (
    <SafeAreaView style={styles.safe} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Bannière illustrée — emplacement image premium */}
        <ImagePlaceholder
          height={160}
          borderRadius={12}
          label="Illustration Premium"
          style={{ marginBottom: 20 }}
        />

        {/* En-tête */}
        <View style={styles.header}>
          <Text style={styles.title}>{t.premium.title}</Text>
          <Text style={styles.subtitle}>{t.premium.subtitle}</Text>
          <Text style={[commonStyles.mutedText, { marginTop: 10, lineHeight: 20 }]}>
            {t.premium.description}
          </Text>
        </View>

        {/* Bandeau "En cours de développement" */}
        <View style={styles.devBanner}>
          <Text style={styles.devBannerIcon}>⚗</Text>
          <Text style={styles.devBannerText}>{t.premium.inDev}</Text>
        </View>

        {/* Liste des fonctionnalités */}
        <Text style={[commonStyles.sectionTitle, { marginTop: 8, marginBottom: 12 }]}>
          Ce qui arrive
        </Text>

        {features.map((f, i) => (
          <View key={i} style={styles.featureCard}>
            <View style={styles.featureIconWrap}>
              <Text style={styles.featureIcon}>{f.icon}</Text>
            </View>
            <View style={styles.featureBody}>
              <View style={styles.featureTitleRow}>
                <Text style={styles.featureTitle}>{f.title}</Text>
                <View style={styles.inDevChip}>
                  <Text style={styles.inDevChipText}>{t.premium.inDev}</Text>
                </View>
              </View>
              <Text style={styles.featureDesc}>{f.desc}</Text>
            </View>
          </View>
        ))}

        {/* Emplacement image de bas de page */}
        <ImagePlaceholder
          height={100}
          borderRadius={10}
          label="Illustration à venir"
          style={{ marginTop: 8 }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default PremiumScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 40 },

  header: {
    marginBottom: 20,
  },
  title: {
    fontFamily: typography.display,
    fontSize: 20,
    color: colors.parchment,
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
  },

  devBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(180,140,60,0.08)',
    borderWidth: 1,
    borderColor: colors.border2,
    borderRadius: 10,
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginBottom: 20,
  },
  devBannerIcon: { fontSize: 20 },
  devBannerText: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold2,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },

  featureCard: {
    flexDirection: 'row',
    gap: 14,
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 14,
    marginBottom: 10,
  },
  featureIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: 'rgba(180,140,60,0.08)',
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  featureIcon: { fontSize: 22 },
  featureBody: { flex: 1 },
  featureTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  featureTitle: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.parchment,
    fontWeight: '700',
    flex: 1,
  },
  inDevChip: {
    backgroundColor: 'rgba(120,24,40,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(158,44,60,0.30)',
    borderRadius: 99,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  inDevChipText: {
    fontFamily: typography.title,
    fontSize: 8,
    color: '#c87070',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  featureDesc: {
    fontFamily: typography.body,
    fontSize: 13,
    color: colors.muted,
    lineHeight: 18,
  },
});
