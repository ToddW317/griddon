import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { generatePlayer } from '../lib/generatePlayer'
import type { Player } from '../types/player'
import { useGameStore } from './gameStore'

interface RecruitmentState {
  prospects: Player[]
  filters: {
    position: string | null
    minRating: number | null
    search: string
  }
  refreshCost: number
  lastRefreshTime: number
  
  // Actions
  generateProspects: () => void
  refreshProspects: () => void
  setFilter: (key: keyof RecruitmentState['filters'], value: any) => void
  clearFilters: () => void
  calculateRecruitCost: (player: Player) => number
  recruitPlayer: (player: Player) => boolean
}

const PROSPECTS_COUNT = 6
const REFRESH_COOLDOWN = 5 * 60 * 1000 // 5 minutes in milliseconds
const BASE_REFRESH_COST = 100

export const useRecruitmentStore = create<RecruitmentState>()(
  persist(
    (set, get) => ({
      prospects: [],
      filters: {
        position: null,
        minRating: null,
        search: ''
      },
      refreshCost: BASE_REFRESH_COST,
      lastRefreshTime: 0,

      generateProspects: () => {
        const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S']
        const prospects = Array.from({ length: PROSPECTS_COUNT }, () => {
          const randomPosition = positions[Math.floor(Math.random() * positions.length)]
          return generatePlayer(randomPosition)
        })
        set({ prospects })
      },

      refreshProspects: () => {
        const now = Date.now()
        const { lastRefreshTime, refreshCost } = get()
        
        // Check cooldown
        if (now - lastRefreshTime < REFRESH_COOLDOWN) {
          return false
        }

        // TODO: Check if player has enough points
        
        get().generateProspects()
        set({
          lastRefreshTime: now,
          refreshCost: Math.floor(refreshCost * 1.2) // Increase cost by 20%
        })
        return true
      },

      setFilter: (key, value) => {
        set(state => ({
          filters: {
            ...state.filters,
            [key]: value
          }
        }))
      },

      clearFilters: () => {
        set({
          filters: {
            position: null,
            minRating: null,
            search: ''
          }
        })
      },

      calculateRecruitCost: (player: Player) => {
        const baseRating = Object.values(player.attributes)
          .reduce((acc, curr) => acc + curr.value, 0) / 12 // Average of all attributes
        
        return Math.floor(100 * Math.pow(1.1, baseRating - 50)) // Exponential scaling based on rating
      },

      recruitPlayer: (player: Player) => {
        const cost = get().calculateRecruitCost(player)
        const gameStore = useGameStore.getState()
        
        // Check if player can afford with recruitment points and has roster space
        if (!gameStore.spendRecruitmentPoints(cost)) return false
        if (!gameStore.addPlayerToRoster(player)) {
          // Refund points if roster is full
          gameStore.addRecruitmentPoints(cost)
          return false
        }
        
        // Remove from prospects
        set(state => ({
          prospects: state.prospects.filter(p => p.id !== player.id)
        }))
        
        return true
      }
    }),
    {
      name: 'griddon-recruitment'
    }
  )
) 