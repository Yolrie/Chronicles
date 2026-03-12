// src/screens/PrivacyPolicyScreen.tsx
// Politique de confidentialité — obligatoire Google Play & Apple App Store

import React from 'react';
import { ScrollView, View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, commonStyles, typography } from '../styles/common';

const LAST_UPDATED = '12 mars 2026';

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.body}>{children}</Text>
);

const Bullet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Text style={styles.bullet}>· {children}</Text>
);

const PrivacyPolicyScreen: React.FC = () => (
  <SafeAreaView style={styles.safe} edges={['bottom']}>
    <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Politique de Confidentialité</Text>
      <Text style={styles.updated}>Dernière mise à jour : {LAST_UPDATED}</Text>

      <Section title="1. Introduction">
        <P>
          Bienvenue dans Chronicles (« l'Application »). Nous respectons votre vie privée et
          nous engageons à protéger vos données personnelles. Cette politique explique comment
          nous collectons, utilisons et protégeons vos informations.
        </P>
      </Section>

      <Section title="2. Données collectées">
        <P>Nous collectons uniquement les données nécessaires au fonctionnement de l'app :</P>
        <Bullet>Adresse e-mail et mot de passe (pour l'authentification)</Bullet>
        <Bullet>Pseudo et rôle (joueur / MJ)</Bullet>
        <Bullet>Photo de profil (si vous choisissez d'en ajouter une)</Bullet>
        <Bullet>Données de personnages et campagnes que vous créez</Bullet>
        <Bullet>Journaux de session soumis dans vos campagnes</Bullet>
        <P>Nous ne collectons PAS :</P>
        <Bullet>Données de localisation</Bullet>
        <Bullet>Contacts téléphoniques</Bullet>
        <Bullet>Données publicitaires ou de suivi tiers</Bullet>
      </Section>

      <Section title="3. Utilisation des données">
        <P>Vos données sont utilisées exclusivement pour :</P>
        <Bullet>Fournir les fonctionnalités de l'application</Bullet>
        <Bullet>Synchroniser vos personnages et campagnes entre appareils</Bullet>
        <Bullet>Permettre la collaboration entre joueurs et MJ</Bullet>
        <Bullet>Améliorer les performances et corriger les bugs</Bullet>
        <P>Nous ne vendons, ne louons et ne partageons pas vos données personnelles avec des tiers.</P>
      </Section>

      <Section title="4. Stockage et sécurité">
        <P>
          Vos données sont stockées sur les serveurs sécurisés de Supabase (UE ou US selon votre région).
          Toutes les communications sont chiffrées via HTTPS/TLS. Les mots de passe ne sont jamais
          stockés en clair — ils sont hachés par le système d'authentification de Supabase.
        </P>
      </Section>

      <Section title="5. Photos de profil">
        <P>
          Si vous choisissez d'ajouter une photo de profil, elle est stockée dans un bucket
          Supabase Storage sécurisé. Seule votre photo personnelle vous appartient. Les autres
          utilisateurs de vos campagnes peuvent voir votre photo de profil dans l'application.
        </P>
      </Section>

      <Section title="6. Calendrier et notifications">
        <P>
          L'application peut accéder à votre calendrier uniquement pour y ajouter des événements
          de session que vous acceptez explicitement. Les notifications locales sont utilisées
          pour vous rappeler les sessions programmées. Aucun accès à votre calendrier n'est
          effectué sans votre consentement explicite.
        </P>
      </Section>

      <Section title="7. Droits des utilisateurs (RGPD)">
        <P>Conformément au RGPD, vous avez le droit :</P>
        <Bullet>D'accéder à vos données personnelles</Bullet>
        <Bullet>De rectifier vos données (via les paramètres du profil)</Bullet>
        <Bullet>De supprimer votre compte et toutes vos données</Bullet>
        <Bullet>De vous opposer au traitement de vos données</Bullet>
        <Bullet>De la portabilité de vos données</Bullet>
        <P>Pour exercer ces droits, contactez-nous à l'adresse indiquée ci-dessous.</P>
      </Section>

      <Section title="8. Rétention des données">
        <P>
          Vos données sont conservées tant que votre compte est actif. À la suppression de
          votre compte, toutes vos données personnelles sont effacées dans un délai de 30 jours.
          Les données agrégées et anonymisées peuvent être conservées pour des statistiques.
        </P>
      </Section>

      <Section title="9. Enfants">
        <P>
          Chronicles est destinée aux utilisateurs âgés de 13 ans et plus. Nous ne collectons
          pas sciemment de données personnelles sur des enfants de moins de 13 ans.
        </P>
      </Section>

      <Section title="10. Modifications">
        <P>
          Nous pouvons mettre à jour cette politique. Toute modification significative sera
          notifiée dans l'application. L'utilisation continue de l'app après modification
          constitue votre acceptation.
        </P>
      </Section>

      <Section title="11. Contact">
        <P>Pour toute question relative à cette politique : privacy@chronicles.app</P>
      </Section>
    </ScrollView>
  </SafeAreaView>
);

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  safe:   { flex: 1, backgroundColor: colors.ink },
  scroll: { paddingHorizontal: 20, paddingTop: 20, paddingBottom: 48 },
  title:  { fontFamily: typography.title, fontSize: 18, color: colors.parchment, fontWeight: '700', marginBottom: 4 },
  updated:{ fontFamily: typography.body, fontSize: 12, color: colors.muted, marginBottom: 24 },
  section:{ marginBottom: 20 },
  sectionTitle: { fontFamily: typography.title, fontSize: 12, color: colors.gold, textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  body:   { fontFamily: typography.body, fontSize: 14, color: colors.parch2, lineHeight: 22, marginBottom: 8 },
  bullet: { fontFamily: typography.body, fontSize: 13, color: colors.muted, lineHeight: 20, paddingLeft: 8, marginBottom: 4 },
});
