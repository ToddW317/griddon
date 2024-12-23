import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { GameField } from '../game/GameField';
import { PlaySelector } from '../game/PlaySelector';
import { Play } from '../game/PlayBook';

export const HomeScreen: React.FC = () => {
  const [selectedPlay, setSelectedPlay] = useState<Play | undefined>(undefined);
  const [isPlaying, setIsPlaying] = useState(false);
  const [down, setDown] = useState(1);
  const [yardsToGo, setYardsToGo] = useState(10);
  const [ballOn, setBallOn] = useState(20); // Starting at the 20-yard line

  const handlePlaySelected = (play: Play) => {
    setSelectedPlay(play);
    setIsPlaying(true);
  };

  const handlePlayComplete = () => {
    setIsPlaying(false);
  };

  const handleDownComplete = (yardsGained: number) => {
    setBallOn(prev => prev + yardsGained);
    setYardsToGo(prev => prev - yardsGained);
    setDown(prev => prev + 1);
    
    // Check for first down
    if (yardsToGo - yardsGained <= 0) {
      setDown(1);
      setYardsToGo(10);
    }
    
    // Check for turnover on downs
    if (down === 4) {
      // Handle turnover
      setDown(1);
      setYardsToGo(10);
      // Maybe add turnover logic here
    }
  };

  return (
    <View style={styles.container}>
      <GameField 
        gridSize={{
          rows: 20,
          cols: 10,
        }}
        selectedPlay={selectedPlay}
        isPlaying={isPlaying}
        onPlayComplete={handlePlayComplete}
        onDownComplete={handleDownComplete}
      />
      <PlaySelector onPlaySelected={handlePlaySelected} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
}); 