// src/navigation/AppNavigator.tsx

import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { useAuthStore } from '../stores/authStore';
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

// ── Param lists ──────────────────────────────────────────────────────────────

export type AuthStackParamList = {
  Login: undefined;
};

export type CharactersStackParamList = {
  CharactersList: undefined;
  CharacterForm: { characterId?: string } | undefined;
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

// ── Navigators ───────────────────────────────────────────────────────────────

const AuthStack = createNativeStackNavigator<AuthStackParamList>();
const CharStack = createNativeStackNavigator<CharactersStackParamList>();
const CampStack = createNativeStackNavigator<CampaignsStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const screenOpts = {
  headerStyle: { backgroundColor: colors.deep },
  headerTintColor: colors.parchment,
  headerTitleStyle: { fontFamily: 'Cinzel', fontSize: 14, fontWeight: '700' as const },
  headerShadowVisible: false,
};

function CharactersNavigator() {
  return (
    <CharStack.Navigator screenOptions={screenOpts}>
      <CharStack.Screen name="CharactersList" component={CharactersScreen} options={{ title: 'My Characters' }} />
      <CharStack.Screen name="CharacterForm" component={CharacterFormScreen} options={{ title: 'Character Sheet' }} />
    </CharStack.Navigator>
  );
}

function CampaignsNavigator() {
  return (
    <CampStack.Navigator screenOptions={screenOpts}>
      <CampStack.Screen name="CampaignsList" component={CampaignsScreen} options={{ title: 'Campaigns' }} />
      <CampStack.Screen name="CampaignForm" component={CampaignFormScreen} options={{ title: 'New Campaign' }} />
      <CampStack.Screen name="CampaignDetail" component={CampaignDetailScreen} options={{ title: 'Campaign' }} />
      <CampStack.Screen name="SessionLogForm" component={SessionLogFormScreen} options={{ title: 'Log Session' }} />
    </CampStack.Navigator>
  );
}

function TabIcon({ label, focused }: { label: string; focused: boolean }) {
  const icons: Record<string, string> = {
    HomeTab: '⚔',
    CharactersTab: '📜',
    CampaignsTab: '🏰',
    ProfileTab: '👤',
  };
  return (
    <View style={{ alignItems: 'center' }}>
      <View style={{
        width: 28, height: 28, alignItems: 'center', justifyContent: 'center',
        opacity: focused ? 1 : 0.45,
      }}>
        <View style={{ fontSize: 20 } as any}>
          {/* Fallback text icon */}
        </View>
      </View>
    </View>
  );
}

function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colors.deep,
          borderTopColor: colors.border,
          borderTopWidth: 1,
          height: 60,
          paddingBottom: 8,
          paddingTop: 6,
        },
        tabBarActiveTintColor: colors.gold2,
        tabBarInactiveTintColor: colors.muted,
        tabBarLabelStyle: { fontFamily: 'Cinzel', fontSize: 9, letterSpacing: 0.8, textTransform: 'uppercase' },
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Home', tabBarLabel: 'Home' }}
      />
      <Tab.Screen
        name="CharactersTab"
        component={CharactersNavigator}
        options={{ title: 'Characters', tabBarLabel: 'Heroes' }}
      />
      <Tab.Screen
        name="CampaignsTab"
        component={CampaignsNavigator}
        options={{ title: 'Campaigns', tabBarLabel: 'Campaigns' }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{ title: 'Profile', tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

// ── Root ─────────────────────────────────────────────────────────────────────

const RootStack = createNativeStackNavigator();

const AppNavigator: React.FC = () => {
  const { session, loading, initialize } = useAuthStore();

  useEffect(() => {
    initialize();
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
          <RootStack.Screen name="Main" component={MainNavigator} />
        ) : (
          <RootStack.Screen name="Auth" component={LoginScreen} />
        )}
      </RootStack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
