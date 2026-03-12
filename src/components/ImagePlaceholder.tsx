// src/components/ImagePlaceholder.tsx
// Zone réservée pour une future image — remplacée par Image quand l'asset est disponible

import React from 'react';
import { View, Text, Image, StyleSheet, ImageStyle, ViewStyle } from 'react-native';
import { colors, typography } from '../styles/common';

interface Props {
  /** Uri de l'image si disponible */
  uri?: string;
  width?: number | string;
  height?: number;
  borderRadius?: number;
  label?: string;
  style?: ViewStyle | ImageStyle;
}

const ImagePlaceholder: React.FC<Props> = ({
  uri,
  width = '100%',
  height = 140,
  borderRadius = 10,
  label,
  style,
}) => {
  if (uri) {
    return (
      <Image
        source={{ uri }}
        style={[{ width: width as number, height, borderRadius }, style as ImageStyle]}
        resizeMode="cover"
      />
    );
  }

  return (
    <View style={[styles.container, { width: width as number, height, borderRadius }, style as ViewStyle]}>
      {/* Icone caméra unicode — pas de dépendance externe */}
      <Text style={styles.icon}>⬜</Text>
      <Text style={styles.label}>{label ?? 'Image à venir'}</Text>
    </View>
  );
};

export default ImagePlaceholder;

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  icon: {
    fontSize: 28,
    opacity: 0.25,
  },
  label: {
    fontFamily: typography.body,
    fontSize: 11,
    color: colors.subtle,
    letterSpacing: 0.4,
  },
});
