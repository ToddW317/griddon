import React, { createContext, useContext, useReducer } from 'react';
import { GameState, GameConfig } from '../types/game.types';

interface GameContextType {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  config: GameConfig;
}

type GameAction =
  | { type: 'START_GAME' }
  | { type: 'END_GAME' }
  | { type: 'UPDATE_SCORE'; payload: number }
  | { type: 'NEXT_LEVEL' };

const initialState: GameState = {
  score: 0,
  isPlaying: false,
  level: 1,
};

const defaultConfig: GameConfig = {
  initialLevel: 1,
  maxLevel: 10,
  difficulty: 'medium',
};

const gameReducer = (state: GameState, action: GameAction): GameState => {
  switch (action.type) {
    case 'START_GAME':
      return { ...state, isPlaying: true };
    case 'END_GAME':
      return { ...state, isPlaying: false };
    case 'UPDATE_SCORE':
      return { ...state, score: state.score + action.payload };
    case 'NEXT_LEVEL':
      return { ...state, level: state.level + 1 };
    default:
      return state;
  }
};

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  return (
    <GameContext.Provider value={{ state, dispatch, config: defaultConfig }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = () => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}; 