import { PlayerAttributes } from '../types/player'

type AttributeWeight = {
  base: number      // Base importance (1-10)
  scaling: number   // How fast it scales with level (1.0-2.0)
  maxValue: number  // Maximum value for this attribute
}

type PositionWeights = {
  [key in keyof PlayerAttributes]: AttributeWeight
}

export const positionAttributeWeights: Record<string, PositionWeights> = {
  QB: {
    // Primary attributes
    throwPower: { base: 10, scaling: 1.8, maxValue: 99 },
    throwAccuracy: { base: 10, scaling: 1.8, maxValue: 99 },
    awareness: { base: 9, scaling: 1.6, maxValue: 99 },
    
    // Secondary attributes
    speed: { base: 6, scaling: 1.3, maxValue: 90 },
    acceleration: { base: 6, scaling: 1.3, maxValue: 90 },
    agility: { base: 7, scaling: 1.4, maxValue: 90 },
    
    // Tertiary attributes
    elusiveness: { base: 5, scaling: 1.2, maxValue: 85 },
    breakTackle: { base: 4, scaling: 1.2, maxValue: 80 },
    ballCarrierVision: { base: 7, scaling: 1.4, maxValue: 90 },
    
    // Less important for QB
    catching: { base: 3, scaling: 1.1, maxValue: 70 },
    routeRunning: { base: 3, scaling: 1.1, maxValue: 70 },
    catchInTraffic: { base: 3, scaling: 1.1, maxValue: 70 },
  },
  
  RB: {
    // Primary attributes
    speed: { base: 9, scaling: 1.7, maxValue: 99 },
    acceleration: { base: 9, scaling: 1.7, maxValue: 99 },
    agility: { base: 9, scaling: 1.7, maxValue: 99 },
    elusiveness: { base: 9, scaling: 1.7, maxValue: 99 },
    breakTackle: { base: 9, scaling: 1.7, maxValue: 99 },
    ballCarrierVision: { base: 9, scaling: 1.7, maxValue: 99 },
    
    // Secondary attributes
    catching: { base: 6, scaling: 1.3, maxValue: 90 },
    routeRunning: { base: 6, scaling: 1.3, maxValue: 90 },
    catchInTraffic: { base: 6, scaling: 1.3, maxValue: 90 },
    
    // Less important for RB
    throwPower: { base: 2, scaling: 1.0, maxValue: 50 },
    throwAccuracy: { base: 2, scaling: 1.0, maxValue: 50 },
    awareness: { base: 7, scaling: 1.4, maxValue: 95 },
  },

  WR: {
    // Primary attributes
    speed: { base: 9, scaling: 1.7, maxValue: 99 },
    acceleration: { base: 9, scaling: 1.7, maxValue: 99 },
    agility: { base: 9, scaling: 1.7, maxValue: 99 },
    catching: { base: 10, scaling: 1.8, maxValue: 99 },
    routeRunning: { base: 10, scaling: 1.8, maxValue: 99 },
    catchInTraffic: { base: 9, scaling: 1.7, maxValue: 99 },
    
    // Secondary attributes
    elusiveness: { base: 7, scaling: 1.4, maxValue: 95 },
    breakTackle: { base: 6, scaling: 1.3, maxValue: 90 },
    ballCarrierVision: { base: 7, scaling: 1.4, maxValue: 95 },
    
    // Less important for WR
    throwPower: { base: 2, scaling: 1.0, maxValue: 50 },
    throwAccuracy: { base: 2, scaling: 1.0, maxValue: 50 },
    awareness: { base: 8, scaling: 1.5, maxValue: 99 },
  },
  // Add other positions...
}

// Helper function to calculate attribute cost based on position and current value
export function calculateAttributeCost(
  position: string,
  attributeName: keyof PlayerAttributes,
  currentValue: number
): number {
  const weights = positionAttributeWeights[position][attributeName]
  const baseCost = 10 // Base cost for any upgrade
  
  return Math.floor(
    baseCost * 
    (weights.scaling ** (currentValue / 10)) * // Exponential scaling based on current value
    (1 + (currentValue / weights.maxValue)) * // Additional scaling as we approach max
    (1 / (weights.base / 10)) // Position-specific discount/premium
  )
}

// Helper to check if attribute can be upgraded
export function canUpgradeAttribute(
  position: string,
  attributeName: keyof PlayerAttributes,
  currentValue: number
): boolean {
  const weights = positionAttributeWeights[position][attributeName]
  return currentValue < weights.maxValue
} 