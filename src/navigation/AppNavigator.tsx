// src/navigation/AppNavigator.tsx

import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useAuthStore } from '../stores/authStore';
import { useI18n } from '../i18n';
import { colors } from '../styles/common';

import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import CharactersScreen from '../screens/CharactersScreen';
import CharacterFormScreen from '../screens/CharacterFormScreen';
import CampaignsScreen from '../screens/CampaignsScreen';
import CampaignDetailScreen from '../screens/CampaignDetailScreen';
import CampaignFormScreen from '../screens/CampaignFormScreen';
import SessionLogFormScreen from '../screens/SessionLogFormScreen';
import ProfileScreen from '../screens/ProfileScreen';
import PremiumScreen from '../screens/PremiumScreen';

// ── Param lists ───────────────────────────────────────────────────────────────

export type CharactersStackParamList = {
  CharactersList: undefined;
  CharacterForm: { characterId?: string; campaignId?: string } | undefined;
};

export type CampaignsStackParamList = {
  CampaignsList: undefined;
  CampaignForm: undefined;
  CampaignDetail: { campaignId: string };
  SessionLogForm: { campaignId: string };
};

export type MainTabParamList = {
  HomeTab: undefined;
  CharactersTab: undefined;
  CampaignsTab: undefined;
  ProfileTab: undefined;
};

// ── Navigateurs de pile ───────────────────────────────────────────────────────

const CharStack = createNativeStackNavigator<CharactersStackParamList>();
const CampStack = createNativeStackNavigator<CampaignsStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();
const RootStack = createNativeStackNavigator();

const headerOpts = {
  headerStyle: { backgroundColor: colors.deep },
  headerTintColor: colors.parchment,
  headerTitleStyle: { fontFamily: 'Cinzel', fontSize: 14, fontWeight: '700' as const },
  headerShadowVisible: false,
};

// ── Icônes textuelles légères (pas de dépendance native externe) ──────────────
// Remplacer par @expo/vector-icons Ionicons si disponible après npm install
type IconName = 'home' | 'shield' | 'map' | 'person' | 'star';

function TabIcon({ name, color, size }: { name: IconName; color: string; size: number }) {
  const MAP: Record<IconName, string> = {
    home:   '⌂',
    shield: '⛨',
    map:    '⚔',
    person: '◎',
    star:   '✦',
  };
  return <Text style={{ fontSize: size * 0.85, color, lineHeight: size * 1.2 }}>{MAP[name]}</Text>;
}

function CharactersNavigator() {
  const { t } = useI18n();
  return (
    <CharStack.Navigator screenOptions={headerOpts}>
      <CharStack.Screen
        name="CharactersList"
        component={CharactersScreen}
        options={{ title: t.characters.myCharacters }}
      />
      <CharStack.Screen
        name="CharacterForm"
        component={CharacterFormScreen}
        options={{ title: t.characters.identity }}
      />
    </CharStack.Navigator>
  );
}

function CampaignsNavigator() {
  const { t } = useI18n();
  return (
    <CampStack.Navigator screenOptions={headerOpts}>
      <CampStack.Screen
        name="CampaignsList"
        component={CampaignsScreen}
        options={{ title: t.campaigns.campaigns }}
      />
      <CampStack.Screen
        name="CampaignForm"
        component={CampaignFormScreen}
        options={{ title: t.campaigns.foundCampaign }}
      />
      <CampStack.Screen
        name="CampaignDetail"
        component={CampaignDetailScreen}
        options={{ title: '' }}
      />
      <CampStack.Screen
        name="SessionLogForm"
        component={SessionLogFormScreen}
        options={{ title: t.sessionLog.logSession }}
      />
    </CampStack.Navigator>
  );
}

function MainNavigator() {
  const insets = useSafeAreaInsets();
  const { t } = useI18n();

  // Sur Android (particulièrement MagicOS/EMUI/ColorOS), les insets peuvent
  // être sous-rapportés. On applique un padding minimum garanti.
  const bottomInset = Math.max(insets.bottom, Platform.OS === 'android' ? 16 : 0);
  const TAB_BASE_HEIGHT = 56;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.deep,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: TAB_BASE_HEIGHT + bottomInset,
          paddingBottom: bottomInset,
          paddingTop: 8,
        },
        tabBarActiveTintColor: colors.gold2,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: {
          fontFamily: 'Cinzel',
          fontSize: 9,
          letterSpacing: 0.5,
          textTransform: 'uppercase',
          marginTop: 2,
        },
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{
          tabBarLabel: t.nav?.home ?? 'Accueil',
          tabBarIcon: ({ color, size }) => <TabIcon name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CharactersTab"
        component={CharactersNavigator}
        options={{
          tabBarLabel: t.nav?.heroes ?? 'Héros',
          tabBarIcon: ({ color, size }) => <TabIcon name="shield" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="CampaignsTab"
        component={CampaignsNavigator}
        options={{
          tabBarLabel: t.nav?.campaigns ?? 'Campagnes',
          tabBarIcon: ({ color, size }) => <TabIcon name="map" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: t.nav?.profile ?? 'Profil',
          tabBarIcon: ({ color, size }) => <TabIcon name="person" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}

// ── Écran Premium (modal) ─────────────────────────────────────────────────────

const PremiumStack = createNativeStackNavigator();

function RootNavigator() {
  return (
    <PremiumStack.Navigator screenOptions={{ headerShown: false, presentation: 'modal' }}>
      <PremiumStack.Screen name="Main" component={MainNavigator} />
      <PremiumStack.Screen
        name="Premium"
        component={PremiumScreen}
        options={{ headerShown: true, ...headerOpts, title: 'Chronicles Premium' }}
      />
    </PremiumStack.Navigator>
  );
}

// ── Root ──────────────────────────────────────────────────────────────────────

const AppNavigator: React.FC = () => {
  const { session, loading, initialize } = useAuthStore();
  const { initialize: initI18n } = useI18n();

  useEffect(() => {
    initialize();
    initI18n();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.ink, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator color={colors.gold2} size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        {session ? (
          <RootStack.Screen name="App" component={RootNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
