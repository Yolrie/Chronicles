// src/components/AlertProvider.tsx
// Composant de notification stylisé "Chronicles" — remplace les Alert.alert natifs

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, typography } from '../styles/common';

// ── Types ──────────────────────────────────────────────────────────────────────

export interface AlertButton {
  text: string;
  style?: 'default' | 'cancel' | 'destructive';
  onPress?: () => void;
}

export interface AlertOptions {
  title: string;
  message?: string;
  buttons?: AlertButton[];
  /** Icône emoji optionnelle affichée au-dessus du titre */
  icon?: string;
}

interface AlertContextType {
  showAlert: (opts: AlertOptions) => void;
}

// ── Contexte ──────────────────────────────────────────────────────────────────

const AlertContext = createContext<AlertContextType>({ showAlert: () => {} });

export function useChroniclesAlert() {
  return useContext(AlertContext);
}

// ── Provider ──────────────────────────────────────────────────────────────────

export function AlertProvider({ children }: { children: ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [opts, setOpts] = useState<AlertOptions>({ title: '' });

  function showAlert(options: AlertOptions) {
    setOpts(options);
    setVisible(true);
  }

  function handlePress(btn: AlertButton) {
    setVisible(false);
    // Court délai pour laisser l'animation de fermeture se terminer
    setTimeout(() => btn.onPress?.(), 100);
  }

  const buttons = opts.buttons ?? [{ text: 'OK' }];
  const isColumn = buttons.length > 2;

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() => setVisible(false)}
        statusBarTranslucent
      >
        <View style={styles.overlay}>
          <View style={styles.box}>
            {/* Trait décoratif en haut */}
            <View style={styles.topBar} />

            {/* Icône optionnelle */}
            {opts.icon ? (
              <Text style={styles.icon}>{opts.icon}</Text>
            ) : null}

            {/* Titre */}
            <Text style={styles.title}>{opts.title}</Text>

            {/* Message */}
            {opts.message ? (
              <Text style={styles.message}>{opts.message}</Text>
            ) : null}

            {/* Séparateur */}
            <View style={styles.divider} />

            {/* Boutons */}
            <View style={[styles.btnRow, isColumn && { flexDirection: 'column' }]}>
              {buttons.map((btn, i) => (
                <TouchableOpacity
                  key={i}
                  style={[
                    styles.btn,
                    btn.style === 'destructive' && styles.btnDestructive,
                    btn.style === 'cancel' && styles.btnCancel,
                    isColumn && { width: '100%', marginLeft: 0 },
                    !isColumn && i > 0 && { marginLeft: 8 },
                  ]}
                  onPress={() => handlePress(btn)}
                  activeOpacity={0.75}
                >
                  <Text style={[
                    styles.btnText,
                    btn.style === 'destructive' && styles.btnTextDestructive,
                    btn.style === 'cancel' && styles.btnTextCancel,
                  ]}>
                    {btn.text}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </AlertContext.Provider>
  );
}

// ── Styles ────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.72)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  box: {
    width: '100%',
    backgroundColor: '#1c1510',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.35)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },
  topBar: {
    height: 3,
    backgroundColor: colors.gold2,
  },
  icon: {
    fontSize: 28,
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 4,
  },
  title: {
    fontFamily: typography.title,
    fontSize: 15,
    color: colors.parchment,
    fontWeight: '700',
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 2,
    letterSpacing: 0.4,
  },
  message: {
    fontFamily: typography.body,
    fontSize: 14,
    color: colors.muted,
    textAlign: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    lineHeight: 20,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(201,152,58,0.18)',
    marginHorizontal: 0,
  },
  btnRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  btn: {
    flex: 1,
    paddingVertical: 11,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'rgba(201,152,58,0.10)',
    borderWidth: 1,
    borderColor: 'rgba(201,152,58,0.35)',
  },
  btnCancel: {
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderColor: colors.border2,
  },
  btnDestructive: {
    backgroundColor: 'rgba(139,26,42,0.15)',
    borderColor: 'rgba(196,40,64,0.45)',
  },
  btnText: {
    fontFamily: typography.title,
    fontSize: 12,
    color: colors.gold2,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    fontWeight: '700',
  },
  btnTextCancel: {
    color: colors.muted,
  },
  btnTextDestructive: {
    color: '#e07070',
  },
});
