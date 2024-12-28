import { Player, PlayerAttributes } from '../types/player'

function generateRandomStat(): { value: number; cost: number } {
  return {
    value: Math.floor(Math.random() * 30) + 50, // Generate between 50-80
    cost: 10 // Base cost, will be modified by position weights
  }
}

function generateAttributes(): PlayerAttributes {
  return {
    // Speed & Movement
    speed: generateRandomStat(),
    acceleration: generateRandomStat(),
    agility: generateRandomStat(),
    
    // Ball Carrier
    elusiveness: generateRandomStat(),
    breakTackle: generateRandomStat(),
    ballCarrierVision: generateRandomStat(),
    
    // Receiving
    catching: generateRandomStat(),
    routeRunning: generateRandomStat(),
    catchInTraffic: generateRandomStat(),
    
    // QB Specific
    throwPower: generateRandomStat(),
    throwAccuracy: generateRandomStat(),
    awareness: generateRandomStat(),
  }
}

const firstNames = ['John', 'Mike', 'Tom', 'David', 'James', 'Robert', 'William', 'Chris', 'Dan', 'Joe']
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez']

export function generatePlayer(position: string): Player {
  const firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
  const lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
  
  return {
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: `${firstName} ${lastName}`,
    position: position as Player['position'],
    attributes: generateAttributes(),
    level: 1,
    experience: 0
  }
} 