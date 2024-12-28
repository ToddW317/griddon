import type { PlayerAbility } from './ability'

export interface Player {
  id: string
  name: string
  position: string
  attributes: Record<string, PlayerAttribute>
  abilities: PlayerAbility[]
  rating?: number
}

export interface PlayerAttribute {
  value: number
  potential: number
} 