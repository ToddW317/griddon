import React from 'react';
import { Animated, StyleSheet, Text } from 'react-native';
import { Football } from './Football';

export interface PlayerPosition {
  x: number;
  y: number;
}

interface PlayerProps {
  position: Animated.ValueXY;
  gridSize: {
    rows: number;
    cols: number;
  };
  team: 'offense' | 'defense';
  role: string;
  hasBall?: boolean;
}

export const Player: React.FC<PlayerProps> = ({ position, gridSize, team, role, hasBall }) => {
  const left = position.x.interpolate({
    inputRange: [0, gridSize.cols],
    outputRange: ['0%', '100%'],
  });

  const top = position.y.interpolate({
    inputRange: [0, gridSize.rows],
    outputRange: ['0%', '100%'],
  });

  // Get zIndex based on role
  const getZIndex = (role: string): number => {
    switch (role.toLowerCase()) {
      case 'qb':
        return 4;
      case 'rb':
        return 3;
      case 'wr':
        return 2;
      default:
        return 1;
    }
  };

  return (
    <Animated.View
      style={[
        styles.player,
        {
          left,
          top,
          zIndex: getZIndex(role), // Apply role-specific zIndex
        },
        team === 'offense' ? styles.offense : styles.defense,
      ]}
    >
      <Text style={styles.playerNumber}>
        {role[0]}
      </Text>
      {hasBall && <Football />}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  player: {
    position: 'absolute',
    width: 16,
    height: 16,
    borderRadius: 8,
    margin: -8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  offense: {
    backgroundColor: '#FF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  defense: {
    backgroundColor: '#4444FF',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  playerNumber: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
}); 