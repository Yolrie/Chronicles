// HomeScreen.tsx

import React from 'react';
import { View, Text, Button } from 'react-native';
import commonStyles from '../styles/common';

const HomeScreen = ({ navigation, route }) => {
  const { username } = route.params || {};

  const [characters, setCharacters] = React.useState([
    {
      id: 1,
      name: 'Aragorn',
      class: 'Rôdeur',
    }
  ]);

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

        {/* Info état de la liste */}
        <View style={{ marginTop: 16 }}>
          {characters.length === 0 ? (
            <View style={commonStyles.badge}>
              <Text style={commonStyles.badgeText}>
                Tu n’as encore créé aucun personnage.
              </Text>
            </View>
          ) : (
            <View>
              {characters.map((c) => (
                <View key={c.id} style={commonStyles.statCard}>
                  <Text style={commonStyles.statLabel}>{c.name}</Text>
                  <Text style={commonStyles.statValue}>{c.class}</Text>
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
