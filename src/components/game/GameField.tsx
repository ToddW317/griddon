import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Dimensions } from 'react-native';
import { Player, PlayerPosition } from './Player';
import { Play, OFFENSIVE_PLAYS, DEFENSIVE_PLAYS, getDefensiveReaction } from './PlayBook';

interface GameFieldProps {
  gridSize: {
    rows: number;
    cols: number;
  };
  selectedPlay?: Play;
  isPlaying: boolean;
  onPlayComplete?: () => void;
  onDownComplete?: (yardsGained: number) => void;
}

interface InitialPosition {
  x: number;
  y: number;
}

interface PlayerState {
  position: Animated.ValueXY;
  team: 'offense' | 'defense';
  role: string;
  initialPosition: InitialPosition;
}

interface GameFieldState {
  lineOfScrimmage: number;
  ballPosition: PlayerPosition;
  yardsToGo: number;
  down: number;
  firstDownLine: number;
}

// Add these utility functions before the GameField component
const yardLineToGridPosition = (yardLine: number) => {
  return 20 - (yardLine / 5); // 20 total grid positions
};

const gridPositionToYardLine = (gridPos: number) => {
  return (20 - gridPos) * 5;
};

export const GameField: React.FC<GameFieldProps> = ({ gridSize, selectedPlay, isPlaying, onPlayComplete, onDownComplete }) => {
  const [players, setPlayers] = useState<PlayerState[]>([]);
  const [ballCarrier, setBallCarrier] = useState<number | null>(null);
  const animationRefs = useRef<Animated.CompositeAnimation[]>([]);
  const [gameState, setGameState] = useState<GameFieldState>({
    lineOfScrimmage: 16,
    ballPosition: { x: 5, y: 16 },
    yardsToGo: 10,
    down: 1,
    firstDownLine: 14,
  });

  const resetToInitialFormation = () => {
    players.forEach(player => {
      const yOffset = player.team === 'offense' 
        ? (player.role === 'QB' ? 0 : // QB on the LoS
           player.role === 'RB' ? +1 : // RB 1 yard behind QB
           0) // WRs on the LoS
        : player.role === 'MLB' ? -3 // MLB 3 yards back
          : player.role === 'S' ? -4 // Safety 4 yards back
          : -2; // CBs 2 yards back
      
      const newPosition = {
        x: player.initialPosition.x,
        y: gameState.lineOfScrimmage + yOffset,
      };
      
      player.position.setValue(newPosition);
    });
    setBallCarrier(null);
  };

  useEffect(() => {
    const initialPlayers: PlayerState[] = [
      // Offense (relative to line of scrimmage)
      { 
        position: new Animated.ValueXY({ x: 5, y: gameState.lineOfScrimmage }), // QB on LoS
        team: 'offense', 
        role: 'QB',
        initialPosition: { x: 5, y: gameState.lineOfScrimmage }
      },
      { 
        position: new Animated.ValueXY({ x: 5, y: gameState.lineOfScrimmage + 1 }), // RB 1 yard behind QB
        team: 'offense', 
        role: 'RB',
        initialPosition: { x: 5, y: gameState.lineOfScrimmage + 1 }
      },
      { 
        position: new Animated.ValueXY({ x: 2, y: gameState.lineOfScrimmage }), 
        team: 'offense', 
        role: 'WR',
        initialPosition: { x: 2, y: gameState.lineOfScrimmage }
      },
      { 
        position: new Animated.ValueXY({ x: 8, y: gameState.lineOfScrimmage }), 
        team: 'offense', 
        role: 'WR',
        initialPosition: { x: 8, y: gameState.lineOfScrimmage }
      },
      
      // Defense (positioned relative to line of scrimmage)
      { 
        position: new Animated.ValueXY({ x: 5, y: gameState.lineOfScrimmage - 3 }), 
        team: 'defense', 
        role: 'MLB',
        initialPosition: { x: 5, y: gameState.lineOfScrimmage - 3 }
      },
      { 
        position: new Animated.ValueXY({ x: 3, y: gameState.lineOfScrimmage - 2 }), 
        team: 'defense', 
        role: 'CB',
        initialPosition: { x: 3, y: gameState.lineOfScrimmage - 2 }
      },
      { 
        position: new Animated.ValueXY({ x: 7, y: gameState.lineOfScrimmage - 2 }), 
        team: 'defense', 
        role: 'CB',
        initialPosition: { x: 7, y: gameState.lineOfScrimmage - 2 }
      },
      { 
        position: new Animated.ValueXY({ x: 5, y: gameState.lineOfScrimmage - 4 }), 
        team: 'defense', 
        role: 'S',
        initialPosition: { x: 5, y: gameState.lineOfScrimmage - 4 }
      },
    ];
    setPlayers(initialPlayers);
  }, [gameState.lineOfScrimmage]);

  const renderGrid = () => {
    const grid = [];
    const cellWidth = 100 / gridSize.cols;
    const cellHeight = 100 / gridSize.rows;

    for (let row = 0; row < gridSize.rows; row++) {
      const rowCells = [];
      for (let col = 0; col < gridSize.cols; col++) {
        rowCells.push(
          <View
            key={`${row}-${col}`}
            style={[
              styles.cell,
              {
                width: `${cellWidth}%`,
                height: `${cellHeight}%`,
              },
            ]}
          />
        );
      }
      grid.push(
        <View key={`row-${row}`} style={styles.row}>
          {rowCells}
        </View>
      );
    }
    return grid;
  };

  const renderYardLines = () => {
    const yardLines = [];
    const spacing = 100 / 10; // 10 yard lines

    for (let i = 1; i < 10; i++) {
      yardLines.push(
        <View
          key={`yard-${i}`}
          style={[
            styles.yardLine,
            {
              top: `${spacing * i}%`,
            },
          ]}
        />
      );
    }
    return yardLines;
  };

  useEffect(() => {
    if (selectedPlay && isPlaying) {
      runPlay(selectedPlay);
    }
  }, [selectedPlay, isPlaying]);

  const runPlay = (play: Play) => {
    resetToInitialFormation();

    const ballCarrierRoute = play.routes.find(route => route.isBallCarrier);
    if (ballCarrierRoute) {
      setBallCarrier(ballCarrierRoute.playerId);
    }

    animationRefs.current.forEach(anim => anim.stop());
    animationRefs.current = [];

    const defensiveRoutes = getDefensiveReaction(play);
    const allRoutes = [...play.routes, ...defensiveRoutes];

    // Adjust routes based on current line of scrimmage while maintaining formation
    const adjustedRoutes = allRoutes.map(route => {
      const player = players[route.playerId];
      const isQB = player.role === 'QB';
      const isRB = player.role === 'RB';
      const isHandoff = ballCarrierRoute && players[ballCarrierRoute.playerId].role === 'RB';

      // If this is the QB and it's a running back play, add handoff motion
      if (isQB && isHandoff) {
        const rbPosition = players.find(p => p.role === 'RB')?.position;
        if (rbPosition) {
          return {
            ...route,
            route: [
              { x: player.position.x._value, y: player.position.y._value, timing: 0 }, // Start
              { x: rbPosition.x._value, y: rbPosition.y._value, timing: 400 }, // Move to RB (shortened from 500)
              { x: player.position.x._value, y: player.position.y._value, timing: 1000 }, // Return to position (shortened from 1000)
              ...route.route.slice(1).map(point => ({
                ...point,
                y: point.y + (gameState.lineOfScrimmage - 18),
                timing: point.timing + 350 // Delay subsequent movements (shortened from 1000)
              }))
            ]
          };
        }
      }

      return {
        ...route,
        route: route.route.map((point, index) => ({
          ...point,
          y: index === 0 ? 
            player.position.y._value : 
            point.y + (gameState.lineOfScrimmage - 18),
          timing: isHandoff && !isQB ? point.timing + 250 : point.timing // Delay RB movement until after handoff
        }))
      };
    });

    // Create and run animations
    const animations = adjustedRoutes.map(route => {
      const player = players[route.playerId];
      if (!player) return null;

      const routeAnimations = route.route.map((point, index) => {
        return Animated.timing(player.position, {
          toValue: { x: point.x, y: point.y },
          duration: point.timing - (index > 0 ? route.route[index - 1].timing : 0),
          useNativeDriver: false,
        });
      });

      return Animated.sequence(routeAnimations);
    }).filter(Boolean);

    Animated.parallel(animations).start(() => {
      if (ballCarrierRoute) {
        const finalPosition = adjustedRoutes
          .find(r => r.playerId === ballCarrierRoute.playerId)!
          .route[ballCarrierRoute.route.length - 1];
        
        const yardsGained = gameState.lineOfScrimmage - finalPosition.y;
        
        setGameState(prevState => {
          const newLineOfScrimmage = finalPosition.y;
          
          // First down is achieved if we reach or pass the first down line
          const firstDownAchieved = newLineOfScrimmage <= prevState.firstDownLine;
          
          // Calculate new first down line position - should be 10 yards (2 grid positions) ahead
          const newFirstDownLine = firstDownAchieved ? 
            Math.max(0, newLineOfScrimmage - 2) : // Subtract 2 grid positions (10 yards)
            prevState.firstDownLine;
          
          console.log('Debug Info:', {
            oldLoS: prevState.lineOfScrimmage,
            newLoS: newLineOfScrimmage,
            oldFirstDown: prevState.firstDownLine,
            newFirstDown: newFirstDownLine,
            yardsGained,
            firstDownAchieved,
            actualYardLine: gridPositionToYardLine(newLineOfScrimmage),
          });

          return {
            ...prevState,
            lineOfScrimmage: newLineOfScrimmage,
            ballPosition: finalPosition,
            down: firstDownAchieved ? 1 : prevState.down + 1,
            yardsToGo: firstDownAchieved ? 10 : Math.max(0, prevState.yardsToGo - yardsGained),
            firstDownLine: newFirstDownLine,
          };
        });

        onDownComplete?.(yardsGained);
      }
      onPlayComplete?.();
    });
  };

  const renderLineOfScrimmage = () => (
    <View
      style={[
        styles.lineOfScrimmage,
        {
          top: `${(gameState.lineOfScrimmage / gridSize.rows) * 100}%`,
        },
      ]}
    />
  );

  const renderFirstDownLine = () => {
    const topPosition = (gameState.firstDownLine / gridSize.rows) * 100;
    
    console.log('First Down Line Debug:', {
      firstDownLine: gameState.firstDownLine,
      gridRows: gridSize.rows,
      calculatedTop: topPosition,
      actualYardLine: gridPositionToYardLine(gameState.firstDownLine),
    });

    return (
      <View
        style={[
          styles.firstDownLine,
          {
            top: `${topPosition}%`,
          },
        ]}
      />
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.field}>
        <View style={styles.endZone} />
        <View style={[styles.endZone, styles.endZoneBottom]} />
        {renderYardLines()}
        <View style={styles.gridContainer}>
          {renderGrid()}
        </View>
        {renderLineOfScrimmage()}
        {renderFirstDownLine()}
        {players.map((player, index) => (
          <Player
            key={index}
            position={player.position}
            team={player.team}
            role={player.role}
            gridSize={gridSize}
            hasBall={index === ballCarrier}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  field: {
    flex: 1,
    backgroundColor: '#2E7D32',
    borderWidth: 2,
    borderColor: 'white',
    position: 'relative',
    aspectRatio: 0.5, // Make the field taller than wide
  },
  gridContainer: {
    flex: 1,
    flexDirection: 'column',
  },
  row: {
    flex: 1,
    flexDirection: 'row',
  },
  cell: {
    borderWidth: 0.5,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  yardLine: {
    position: 'absolute',
    height: 2,
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    zIndex: 1,
  },
  endZone: {
    position: 'absolute',
    width: '100%',
    height: '10%',
    backgroundColor: '#1B5E20',
    zIndex: 0,
    top: 0,
  },
  endZoneBottom: {
    top: 'auto',
    bottom: 0,
  },
  lineOfScrimmage: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#0066FF', // Changed to blue
    zIndex: 1,
  },
  firstDownLine: {
    position: 'absolute',
    width: '100%',
    height: 2,
    backgroundColor: '#FFFF00',
    zIndex: 10,
    opacity: 0.8,
  },
});