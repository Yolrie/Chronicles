// HomeScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';
import { useCharacters } from '../context/CharactersContext';


const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params || {};

  const { characters } = useCharacters();

  return (
    <View style={commonStyles.screen}>
      <View style={commonStyles.card}>
        {/* Petit badge en haut */}
        <View style={commonStyles.pill}>
          <Text style={commonStyles.pillText}>Tableau de bord</Text>
        </View>

        {/* Titre + bienvenue */}
        <Text style={commonStyles.title}>Mes personnages</Text>

        {username && (
          <Text style={commonStyles.subtitle}>
            Bienvenue, {username}. Prépare tes fiches de héros.
          </Text>
        )}

        {!username && (
          <Text style={commonStyles.subtitle}>
            Crée et gère tes personnages de jeu de rôle depuis un seul endroit.
          </Text>
        )}

        {/* Statistiques rapides */}
        <Text style={commonStyles.sectionHeader}>Aperçu rapide</Text>
        <View style={commonStyles.statRow}>
          <View style={commonStyles.statCard}>
            <Text style={commonStyles.statLabel}>Personnages créés</Text>
            <Text style={commonStyles.statValue}>
              {characters.length}
            </Text>
          </View>
          <View style={commonStyles.statCard}>
            <Text style={commonStyles.statLabel}>Dernière activité</Text>
            <Text style={commonStyles.statValue}>—</Text>
          </View>
        </View>

        {/* Liste des personnages */}
        <View style={{ marginTop: 16 }}>
          {characters.length === 0 ? (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>
                Tu n’as encore créé aucun personnage.
              </Text>
            </View>
          ) : (
            <View>
              {/* En-têtes du tableau */}
              <View
                style={{
                  flexDirection: 'row',
                  paddingVertical: 8,
                  borderBottomWidth: 1,
                  borderColor: 'rgba(148, 163, 184, 0.4)',
                }}
              >
                <Text style={[commonStyles.statLabel, { flex: 2 }]}>Nom</Text>
                <Text style={[commonStyles.statLabel, { flex: 2 }]}>Classe</Text>
                <Text style={[commonStyles.statLabel, { flex: 2 }]}>Race</Text>
                <Text style={[commonStyles.statLabel, { flex: 1, textAlign: 'right' }]}>
                  Actions
                </Text>
              </View>

              {/* Lignes du tableau */}
              {characters.map((c) => (
                <View
                  key={c.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderColor: 'rgba(31, 41, 55, 0.7)',
                  }}
                >
                  <Text style={[commonStyles.statValue, { flex: 2 }]}>
                    {c.name}
                  </Text>
                  <Text style={[commonStyles.statLabel, { flex: 2 }]}>
                    {c.class}
                  </Text>
                  <Text style={[commonStyles.statLabel, { flex: 2 }]}>
                    {c.race || '—'}
                  </Text>
                  <View style={{ flex: 1, alignItems: 'flex-end' }}>
                    <Button
                      title="Modifier"
                      onPress={() => {
                        navigation.navigate('CharacterForm', { characterId: c.id });
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={commonStyles.actions}>
          <View style={commonStyles.actionsRow}>
            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  navigation.navigate('CharacterForm');
                }}
                title="Créer un personnage"
              />
            </View>

            <View style={{ flex: 1 }}>
              <Button
                onPress={() => {
                  // Plus tard : aller vers une future liste détaillée
                  navigation.navigate('CharacterForm');
                }}
                title="Voir la fiche type"
              />
            </View>
          </View>

          <Button
            onPress={() => {
              navigation.navigate('Login');
            }}
            title="Retour à l’écran de connexion"
          />
        </View>
      </View>
    </View>
  );
};

export default HomeScreen;
