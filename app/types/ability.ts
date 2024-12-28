export type AbilityTrigger = 'onTackle' | 'onCatch' | 'onBlock' | 'onRush' | 'onCoverage' | 'onSnap' | 'onKick'
export type AbilityTarget = 'self' | 'teammate' | 'opponent' | 'ball'
export type AbilityDuration = 'instant' | 'play' | 'drive' | 'game'

export interface Ability {
  id: string
  name: string
  description: string
  trigger: AbilityTrigger
  target: AbilityTarget
  duration: AbilityDuration
  positions: string[]  // Which positions can have this ability
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary'
  statRequirement?: {
    stat: string
    minimum: number
  }
  chanceToActivate: (playerStats: Record<string, number>) => number
  effect: string
  icon: string  // Lucide icon name
  color: string // Tailwind color class
}

export interface PlayerAbility extends Ability {
  isActive: boolean
  activationsThisGame: number
  cooldown?: number
} 