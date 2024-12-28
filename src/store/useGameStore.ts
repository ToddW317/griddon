import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface GameState {
  // Resources
  trainingPoints: number
  
  // Actions
  addTrainingPoints: (amount: number) => void
  resetGame: () => void
}

export const useGameStore = create<GameState>()(
  persist(
    (set) => ({
      // Initial state
      trainingPoints: 0,

      // Actions
      addTrainingPoints: (amount) => 
        set((state) => ({ trainingPoints: state.trainingPoints + amount })),
      
      resetGame: () => 
        set({ trainingPoints: 0 }),
    }),
    {
      name: 'griddon-storage',
    }
  )
) 