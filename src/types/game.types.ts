export interface GameState {
  score: number;
  isPlaying: boolean;
  level: number;
}

export interface GameConfig {
  initialLevel: number;
  maxLevel: number;
  difficulty: 'easy' | 'medium' | 'hard';
} 