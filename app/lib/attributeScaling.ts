import { PlayerAttributes } from '../types/player'
import { positionAttributeWeights, calculateAttributeCost } from './positionWeights'

type ScalingTier = {
  threshold: number
  multiplier: number
  color: string // For visual feedback
}

// Define scaling tiers for visual feedback and cost multipliers
const SCALING_TIERS: ScalingTier[] = [
  { threshold: 90, multiplier: 3.0, color: 'text-purple-400' },    // Elite
  { threshold: 80, multiplier: 2.0, color: 'text-blue-400' },      // Exceptional
  { threshold: 70, multiplier: 1.5, color: 'text-green-400' },     // Great
  { threshold: 60, multiplier: 1.2, color: 'text-yellow-400' },    // Good
  { threshold: 50, multiplier: 1.0, color: 'text-white' },         // Average
  { threshold: 0, multiplier: 0.8, color: 'text-gray-400' },       // Below Average
]

export function getAttributeTier(value: number): ScalingTier {
  return SCALING_TIERS.find(tier => value >= tier.threshold) || SCALING_TIERS[SCALING_TIERS.length - 1]
}

export function calculateUpgradeCost(
  position: string,
  attributeName: keyof PlayerAttributes,
  currentValue: number,
  playerLevel: number
): number {
  const baseCost = calculateAttributeCost(position, attributeName, currentValue)
  const tier = getAttributeTier(currentValue)
  const levelMultiplier = 1 + (playerLevel - 1) * 0.1 // 10% increase per level
  
  return Math.floor(baseCost * tier.multiplier * levelMultiplier)
}

export function getNextLevelPreview(
  position: string,
  attributeName: keyof PlayerAttributes,
  currentValue: number
): {
  nextValue: number
  cost: number
  isMaxed: boolean
  tier: ScalingTier
} {
  const weights = positionAttributeWeights[position][attributeName]
  const isMaxed = currentValue >= weights.maxValue
  
  return {
    nextValue: isMaxed ? currentValue : currentValue + 1,
    cost: isMaxed ? 0 : calculateAttributeCost(position, attributeName, currentValue),
    isMaxed,
    tier: getAttributeTier(currentValue)
  }
}

// Helper to get formatted attribute display value with color
export function getAttributeDisplay(value: number): {
  color: string
  label: string
} {
  const tier = getAttributeTier(value)
  return {
    color: tier.color,
    label: value.toString().padStart(2, '0')
  }
}

// Calculate total training points needed to max an attribute
export function calculatePointsToMax(
  position: string,
  attributeName: keyof PlayerAttributes,
  currentValue: number,
  playerLevel: number
): number {
  const weights = positionAttributeWeights[position][attributeName]
  let total = 0
  let value = currentValue
  
  while (value < weights.maxValue) {
    total += calculateUpgradeCost(position, attributeName, value, playerLevel)
    value++
  }
  
  return total
} 