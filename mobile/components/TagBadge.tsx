import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../constants/colors';

interface TagBadgeProps {
  label: string;
  color?: string;
  textColor?: string;
}

export default function TagBadge({ label, color, textColor }: TagBadgeProps) {
  return (
    <View style={[styles.pill, { backgroundColor: color ?? Colors.brandBg }]}>
      <Text style={[styles.label, { color: textColor ?? Colors.brand }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    marginRight: 6,
    marginBottom: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
});
