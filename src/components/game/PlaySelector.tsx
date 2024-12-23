import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Play, OFFENSIVE_PLAYS } from './PlayBook';

interface PlaySelectorProps {
  onPlaySelected: (play: Play) => void;
}

export const PlaySelector: React.FC<PlaySelectorProps> = ({ onPlaySelected }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Play</Text>
      <ScrollView horizontal>
        {OFFENSIVE_PLAYS.map(play => (
          <TouchableOpacity
            key={play.id}
            style={styles.playCard}
            onPress={() => onPlaySelected(play)}
          >
            <Text style={styles.playName}>{play.name}</Text>
            <Text style={styles.playDescription}>{play.description}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#1a1a1a',
  },
  title: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  playCard: {
    backgroundColor: '#333',
    padding: 10,
    marginRight: 10,
    borderRadius: 8,
    width: 150,
  },
  playName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  playDescription: {
    color: '#ccc',
    fontSize: 12,
    marginTop: 5,
  },
}); 