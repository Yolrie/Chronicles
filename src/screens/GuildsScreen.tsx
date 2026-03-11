// src/screens/GuildsScreen.tsx

import React, { useMemo, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

import { RootStackParamList } from '../navigation/AppNavigator';
import { useGuilds } from '../context/GuildsContext';
import { commonStyles, colors } from '../styles/common';

type Props = NativeStackScreenProps<RootStackParamList, 'Guilds'>;

// v1 : user local fictif, à remplacer par l'utilisateur logué
const CURRENT_USER_ID = 'local-user';

const GuildsScreen: React.FC<Props> = () => {
  const { guilds, createGuild, requestJoin } = useGuilds();

  const [view, setView] = useState<'home' | 'join' | 'create'>('home');
  const [code, setCode] = useState('');
  const [gname, setGname] = useState('');

  const myGuilds = useMemo(
    () =>
      guilds.filter(
        g =>
          g.members.includes(CURRENT_USER_ID) ||
          g.pending.includes(CURRENT_USER_ID),
      ),
    [guilds],
  );

  function handleCreate() {
    if (!gname.trim()) {
      Alert.alert('Erreur', 'Nomme ta confrérie avant de la créer.');
      return;
    }
    const guild = createGuild(gname.trim(), CURRENT_USER_ID);
    setGname('');
    setView('home');
    Alert.alert(
      'Confrérie fondée',
      `“${guild.name}” créée.\nCode d’invitation : ${guild.code}`,
    );
  }

  function handleJoin() {
    if (!code.trim()) {
      Alert.alert('Erreur', 'Entre un code de confrérie.');
      return;
    }
    const result = requestJoin(code, CURRENT_USER_ID);
    if (result === 'error') {
      Alert.alert('Erreur', 'Code de confrérie introuvable.');
    } else if (result === 'warn') {
      Alert.alert(
        'Info',
        'Tu es déjà membre ou ta demande est déjà en attente.',
      );
    } else {
      Alert.alert(
        'Demande envoyée',
        'Ta demande a été envoyée. En attente d’approbation.',
      );
      setCode('');
      setView('home');
    }
  }

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 32 }}
      >
        {/* Titre + sous-titre */}
        <Text style={commonStyles.headerTitle}>Guilds / Confréries</Text>
        <Text style={commonStyles.headerSubtitle}>
          Crée ta confrérie ou rejoins celle de ton Maître du Jeu avec un code.
        </Text>

        {/* Mes confréries */}
        {myGuilds.length > 0 && (
          <View style={{ marginTop: 16 }}>
            <Text style={commonStyles.sectionTitle}>Mes confréries</Text>
            {myGuilds.map(g => {
              const isMaster = g.masterId === CURRENT_USER_ID;
              const isPending = g.pending.includes(CURRENT_USER_ID);
              return (
                <View key={g.id} style={styles.guildCard}>
                  <View style={styles.guildAvatar}>
                    <Text style={styles.guildAvatarText}>
                      {g.name[0]?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                  <View style={styles.guildInfo}>
                    <Text style={styles.guildName}>{g.name}</Text>
                    <Text style={styles.guildMeta}>
                      {g.members.length} membre
                      {g.members.length > 1 ? 's' : ''}
                    </Text>
                    <Text style={styles.guildCode}>Code: {g.code}</Text>
                  </View>
                  <View style={styles.badgesCol}>
                    {isMaster && (
                      <Text
                        style={[commonStyles.badge, commonStyles.badgePurple]}
                      >
                        Maître
                      </Text>
                    )}
                    {isPending && (
                      <Text
                        style={[commonStyles.badge, commonStyles.badgeCrimson]}
                      >
                        En attente
                      </Text>
                    )}
                    {!isMaster && !isPending && (
                      <Text
                        style={[commonStyles.badge, commonStyles.badgeGreen]}
                      >
                        Membre
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* Actions */}
        <View style={{ marginTop: 16 }}>
          <TouchableOpacity
            style={commonStyles.goldCta}
            onPress={() => setView(view === 'join' ? 'home' : 'join')}
          >
            <Text style={commonStyles.goldCtaText}>
              Rejoindre une confrérie
            </Text>
          </TouchableOpacity>

          <View style={{ height: 8 }} />

          <TouchableOpacity
            style={commonStyles.ghostButton}
            onPress={() => setView(view === 'create' ? 'home' : 'create')}
          >
            <Text style={commonStyles.ghostButtonText}>
              Fonder une confrérie
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bloc rejoindre */}
        {view === 'join' && (
          <View style={[commonStyles.card, { marginTop: 16 }]}>
            <Text style={styles.cardTitle}>Rejoindre avec un code</Text>
            <Text style={commonStyles.fieldLabel}>Code de confrérie</Text>
            <TextInput
              value={code}
              onChangeText={t => setCode(t.toUpperCase())}
              placeholder="Ex: SHADOW42"
              placeholderTextColor={colors.muted}
              style={styles.inputCode}
              autoCapitalize="characters"
            />
            <TouchableOpacity
              style={[commonStyles.primaryCta, { marginTop: 8 }]}
              onPress={handleJoin}
            >
              <Text style={commonStyles.primaryCtaText}>
                Envoyer la demande
              </Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bloc créer */}
        {view === 'create' && (
          <View style={[commonStyles.card, { marginTop: 16 }]}>
            <Text style={styles.cardTitle}>Fonder une confrérie</Text>
            <Text style={styles.cardHint}>
              En fondant une confrérie, tu deviens son Maître du Jeu et tu
              gères les membres.
            </Text>
            <Text style={commonStyles.fieldLabel}>Nom de la confrérie</Text>
            <TextInput
              value={gname}
              onChangeText={setGname}
              placeholder="Les Héros de l'Ombre..."
              placeholderTextColor={colors.muted}
              style={commonStyles.input}
            />
            <TouchableOpacity
              style={[commonStyles.goldCta, { marginTop: 8 }]}
              onPress={handleCreate}
            >
              <Text style={commonStyles.goldCtaText}>
                Fonder la confrérie
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default GuildsScreen;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.ink,
  },
  guildCard: {
    flexDirection: 'row',
    backgroundColor: colors.deep,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 12,
    marginBottom: 8,
  },
  guildAvatar: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: 'rgba(139,26,42,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  guildAvatarText: {
    color: colors.crimson2,
    fontSize: 18,
    fontWeight: '700',
  },
  guildInfo: {
    flex: 1,
  },
  guildName: {
    color: colors.parchment,
    fontSize: 14,
    fontWeight: '700',
  },
  guildMeta: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 2,
  },
  guildCode: {
    color: colors.gold2,
    fontSize: 11,
    marginTop: 2,
  },
  badgesCol: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 4,
  },
  cardTitle: {
    fontFamily: 'Cinzel',
    fontSize: 14,
    fontWeight: '700',
    color: colors.gold2,
    marginBottom: 10,
  },
  cardHint: {
    fontFamily: 'EB Garamond',
    fontSize: 13,
    color: '#9ca3af',
    marginBottom: 12,
  },
  inputCode: {
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.border2,
    paddingHorizontal: 12,
    paddingVertical: 12,
    color: colors.parchment,
    fontSize: 18,
    letterSpacing: 4,
    textAlign: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
  },
});
