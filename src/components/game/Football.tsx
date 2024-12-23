import React from 'react';
import { View, StyleSheet } from 'react-native';

export const Football = () => (
  <View style={styles.football} />
);

const styles = StyleSheet.create({
  football: {
    width: 8,
    height: 12,
    backgroundColor: '#8B4513',
    borderRadius: 4,
    transform: [{ rotate: '45deg' }],
    position: 'absolute',
    right: -4,
    top: -4,
  },
}); 