// app.config.js
// Configuration Expo — conformité Google Play + Apple App Store

import 'dotenv/config';

export default {
  expo: {
    name:    'Chronicles',
    slug:    'chronicles',
    version: '2.1.0',
    // Minimum SDK : Android 6 (API 23) / iOS 14
    orientation: 'portrait',
    icon:    './assets/icon.png',
    scheme:  'chronicles',   // deep linking : chronicles://...
    userInterfaceStyle: 'dark',

    splash: {
      image:           './assets/splash-icon.png',
      resizeMode:      'contain',
      backgroundColor: '#0e0c09',
    },

    assetBundlePatterns: ['**/*'],

    // ── iOS ───────────────────────────────────────────────────────────────────
    ios: {
      supportsTablet:    true,
      bundleIdentifier: 'com.chronicles.app',
      buildNumber:       '1',
      deploymentTarget:  '14.0',

      // Déclarations de confidentialité obligatoires (App Store)
      infoPlist: {
        NSPhotoLibraryUsageDescription:
          'Chronicles utilise votre bibliothèque de photos pour personnaliser votre photo de profil.',
        NSCameraUsageDescription:
          'Chronicles peut utiliser la caméra pour prendre une photo de profil.',
        NSPhotoLibraryAddUsageDescription:
          'Chronicles peut enregistrer des images dans votre bibliothèque.',
        NSCalendarUsageDescription:
          'Chronicles ajoute les sessions de jeu à votre calendrier.',
        NSCalendarWriteOnlyAccessUsageDescription:
          'Chronicles crée des événements de session dans votre calendrier.',
        NSUserNotificationsUsageDescription:
          'Chronicles vous notifie des sessions programmées et invitations.',
        // Déclarations de suivi (ATT — iOS 14.5+)
        NSUserTrackingUsageDescription:
          'Chronicles n\'utilise pas de suivi publicitaire. Vos données restent privées.',
      },

      // Politique de confidentialité requise par l'App Store
      privacyManifest: {
        NSPrivacyAccessedAPITypes: [
          {
            NSPrivacyAccessedAPIType: 'NSPrivacyAccessedAPICategoryUserDefaults',
            NSPrivacyAccessedAPITypeReasons: ['CA92.1'],
          },
        ],
        NSPrivacyCollectedDataTypes: [],
        NSPrivacyTracking: false,
      },
    },

    // ── Android ───────────────────────────────────────────────────────────────
    android: {
      adaptiveIcon: {
        foregroundImage:   './assets/adaptive-icon.png',
        backgroundColor:   '#0e0c09',
      },
      package:     'com.chronicles.app',
      versionCode:  1,
      minSdkVersion: 23,   // Android 6.0
      targetSdkVersion: 34,

      permissions: [
        'android.permission.READ_MEDIA_IMAGES',
        'android.permission.READ_EXTERNAL_STORAGE',
        'android.permission.WRITE_EXTERNAL_STORAGE',
        'android.permission.CAMERA',
        'android.permission.READ_CALENDAR',
        'android.permission.WRITE_CALENDAR',
        'android.permission.POST_NOTIFICATIONS',
        'android.permission.RECEIVE_BOOT_COMPLETED',
        'android.permission.VIBRATE',
        'android.permission.INTERNET',
        'android.permission.ACCESS_NETWORK_STATE',
      ],

      // Filtres d'intent deep linking
      intentFilters: [
        {
          action: 'VIEW',
          autoVerify: true,
          data: [
            { scheme: 'https', host: 'chronicles.app', pathPrefix: '/join' },
            { scheme: 'chronicles' },
          ],
          category: ['BROWSABLE', 'DEFAULT'],
        },
      ],
    },

    // ── Web ───────────────────────────────────────────────────────────────────
    web: {
      favicon: './assets/favicon.png',
      bundler: 'metro',
    },

    // ── Plugins Expo ──────────────────────────────────────────────────────────
    plugins: [
      [
        'expo-image-picker',
        {
          photosPermission: 'Chronicles utilise vos photos pour la photo de profil.',
          cameraPermission: 'Chronicles utilise la caméra pour la photo de profil.',
        },
      ],
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#d4a840',
          sounds: [],
        },
      ],
      'expo-secure-store',
    ],

    // ── EAS ───────────────────────────────────────────────────────────────────
    // projectId sera injecté par "eas init" (UUID valide depuis expo.dev)
    extra: {
      eas: { projectId: process.env.EAS_PROJECT_ID ?? undefined },
    },
  },
};
