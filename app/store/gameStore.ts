import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Player } from '../types/player'
import type { Upgrade } from '../types/game'
import { formatNumber, roundNumber } from '../lib/utils'

interface GameState {
  trainingPoints: number
  recruitmentPoints: number
  roster: Player[]
  rosterLimit: number
  upgrades: Upgrade[]
  totalClicks: number
  totalPointsEarned: number
  isHydrated: boolean
  lastTickTime: number
  setLastTickTime: (time: number) => void
  
  // Actions
  addTrainingPoints: (amount: number) => void
  spendTrainingPoints: (amount: number) => boolean
  addRecruitmentPoints: (amount: number) => void
  spendRecruitmentPoints: (amount: number) => boolean
  convertTrainingToRecruitment: (amount: number) => boolean
  addPlayerToRoster: (player: Player) => boolean
  removePlayerFromRoster: (playerId: string) => void
  purchaseUpgrade: (upgradeId: string) => boolean
  getUpgradeCost: (upgradeId: string) => number
  getUpgradeEffect: (upgradeId: string) => number
  incrementTotalClicks: () => void
  setHydrated: (state: boolean) => void
}

const INITIAL_UPGRADES: Upgrade[] = [
  {
    id: 'click',
    name: 'Training Power',
    level: 1,
    baseCost: 10,
    costMultiplier: 1.5,
    baseEffect: 1,
    description: 'Increase points per click',
    icon: 'zap'
  },
  {
    id: 'passive',
    name: 'Assistant Coach',
    level: 0,
    baseCost: 25,
    costMultiplier: 1.8,
    baseEffect: 0.5,
    description: 'Generate points automatically',
    icon: 'clock'
  },
  {
    id: 'roster',
    name: 'Roster Expansion',
    level: 0,
    baseCost: 100,
    costMultiplier: 2,
    baseEffect: 1,
    description: 'Increase roster size limit',
    icon: 'users'
  },
  {
    id: 'training',
    name: 'Training Facility',
    level: 0,
    baseCost: 50,
    costMultiplier: 1.6,
    baseEffect: 0.2,
    description: 'Boost all training gains',
    icon: 'dumbbell'
  },
  {
    id: 'recruitment',
    name: 'Scouting Network',
    level: 0,
    baseCost: 75,
    costMultiplier: 1.7,
    baseEffect: 0.1,
    description: 'Improve recruitment point conversion rate',
    icon: 'target'
  },
  {
    id: 'prestige',
    name: 'Team Prestige',
    level: 0,
    baseCost: 200,
    costMultiplier: 2.5,
    baseEffect: 0.5,
    description: 'Increase all gains and unlock better prospects',
    icon: 'trophy'
  },
  {
    id: 'momentum',
    name: 'Team Momentum',
    level: 0,
    baseCost: 150,
    costMultiplier: 1.9,
    baseEffect: 0.15,
    description: 'Clicking generates bonus points based on passive income',
    icon: 'flame'
  },
  {
    id: 'synergy',
    name: 'Team Synergy',
    level: 0,
    baseCost: 300,
    costMultiplier: 2.2,
    baseEffect: 0.25,
    description: 'Each roster member increases training gains',
    icon: 'users-2'
  },
  {
    id: 'efficiency',
    name: 'Training Efficiency',
    level: 0,
    baseCost: 250,
    costMultiplier: 2.0,
    baseEffect: 0.2,
    description: 'Reduce all upgrade costs',
    icon: 'percent'
  }
]

export const useGameStore = create<GameState>()(
  persist(
    (set, get) => ({
      trainingPoints: 0,
      recruitmentPoints: 0,
      roster: [],
      rosterLimit: 10,
      upgrades: INITIAL_UPGRADES,
      totalClicks: 0,
      totalPointsEarned: 0,
      isHydrated: false,
      lastTickTime: Date.now(),

      setLastTickTime: (time) => {
        set({ lastTickTime: time })
      },

      setHydrated: (state) => {
        set({ isHydrated: state })
      },

      addTrainingPoints: (amount) => {
        set(state => ({
          trainingPoints: roundNumber(state.trainingPoints + amount),
          totalPointsEarned: roundNumber(state.totalPointsEarned + amount)
        }))
      },

      spendTrainingPoints: (amount) => {
        const { trainingPoints } = get()
        if (trainingPoints < amount) return false

        set(state => ({
          trainingPoints: state.trainingPoints - amount
        }))
        return true
      },

      addRecruitmentPoints: (amount) => {
        set(state => ({
          recruitmentPoints: state.recruitmentPoints + amount
        }))
      },

      spendRecruitmentPoints: (amount) => {
        const { recruitmentPoints } = get()
        if (recruitmentPoints < amount) return false

        set(state => ({
          recruitmentPoints: state.recruitmentPoints - amount
        }))
        return true
      },

      convertTrainingToRecruitment: (amount) => {
        const { trainingPoints } = get()
        if (trainingPoints < amount) return false

        set(state => ({
          trainingPoints: state.trainingPoints - amount,
          recruitmentPoints: state.recruitmentPoints + Math.floor(amount * 0.8)
        }))
        return true
      },

      addPlayerToRoster: (player) => {
        const { roster, rosterLimit } = get()
        if (roster.length >= rosterLimit) return false

        set(state => ({
          roster: [...state.roster, player]
        }))
        return true
      },

      removePlayerFromRoster: (playerId) => {
        set(state => ({
          roster: state.roster.filter(p => p.id !== playerId)
        }))
      },

      purchaseUpgrade: (upgradeId) => {
        const { upgrades, trainingPoints } = get()
        const upgrade = upgrades.find(u => u.id === upgradeId)
        if (!upgrade) return false

        const cost = get().getUpgradeCost(upgradeId)
        if (trainingPoints < cost) return false

        set(state => ({
          trainingPoints: state.trainingPoints - cost,
          upgrades: state.upgrades.map(u =>
            u.id === upgradeId ? { ...u, level: u.level + 1 } : u
          )
        }))
        return true
      },

      getUpgradeCost: (upgradeId) => {
        const { upgrades } = get()
        const upgrade = upgrades.find(u => u.id === upgradeId)
        if (!upgrade) return 0
        
        const baseCost = upgrade.baseCost * Math.pow(upgrade.costMultiplier, upgrade.level - 1)
        const efficiencyLevel = upgrades.find(u => u.id === 'efficiency')?.level ?? 0
        const discount = efficiencyLevel * 0.05 // 5% discount per level
        
        return Math.floor(baseCost * (1 - discount))
      },

      getUpgradeEffect: (upgradeId) => {
        const { upgrades, roster } = get()
        const upgrade = upgrades.find(u => u.id === upgradeId)
        if (!upgrade) return 0
        
        const baseEffect = upgrade.baseEffect * upgrade.level
        const prestigeBonus = upgrades.find(u => u.id === 'prestige')?.level ?? 0
        const trainingBonus = upgrades.find(u => u.id === 'training')?.level ?? 0
        const synergyBonus = (upgrades.find(u => u.id === 'synergy')?.level ?? 0) * roster.length * 0.05
        
        let totalEffect = baseEffect * (1 + (prestigeBonus * 0.1) + (trainingBonus * 0.05) + synergyBonus)
        
        // Special case for click power with momentum
        if (upgradeId === 'click') {
          const momentumLevel = upgrades.find(u => u.id === 'momentum')?.level ?? 0
          const passiveIncome = get().getUpgradeEffect('passive')
          totalEffect += passiveIncome * (momentumLevel * 0.15)
        }
        
        return totalEffect
      },

      incrementTotalClicks: () => {
        set(state => ({
          totalClicks: state.totalClicks + 1
        }))
      }
    }),
    {
      name: 'griddon-game',
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHydrated(true)
          state.lastTickTime = Date.now()
        }
      },
    }
  )
) 