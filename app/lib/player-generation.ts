import { generateName } from './name-generation'
import { ABILITIES } from '../data/abilities'
import type { Player, PlayerAttribute } from '../types/player'
import type { Ability } from '../types/ability'

function getEligibleAbilities(position: string, attributes: Record<string, number>): Ability[] {
  return ABILITIES.filter(ability => {
    // Check if ability is for this position
    if (!ability.positions.includes(position)) return false
    
    // Check stat requirements
    if (ability.statRequirement) {
      const stat = attributes[ability.statRequirement.stat]
      if (!stat || stat < ability.statRequirement.minimum) return false
    }
    
    return true
  })
}

function assignAbilities(player: Player): Player {
  const eligibleAbilities = getEligibleAbilities(player.position, player.attributes)
  
  // Randomly select 1-2 abilities based on player rating
  const numAbilities = player.rating >= 80 ? 2 : 1
  const selectedAbilities = eligibleAbilities
    .sort(() => Math.random() - 0.5)
    .slice(0, numAbilities)
    .map(ability => ({
      ...ability,
      isActive: false,
      activationsThisGame: 0
    }))

  return {
    ...player,
    abilities: selectedAbilities
  }
}

export function generatePlayer(position: string): Player {
  const attributes = generateAttributes(position)
  const player = {
    id: Math.random().toString(36).substr(2, 9),
    name: generateName(),
    position,
    attributes,
    abilities: [], // Initialize empty array
    rating: calculateRating(attributes)
  }

  // Assign abilities after creating the player
  return assignAbilities(player)
}

function calculateRating(attributes: Record<string, PlayerAttribute>): number {
  const values = Object.values(attributes).map(attr => attr.value)
  return Math.floor(values.reduce((a, b) => a + b, 0) / values.length)
} 