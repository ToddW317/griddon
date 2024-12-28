import type { Ability } from '../types/ability'

export const ABILITIES: Ability[] = [
  // Running Back Abilities
  {
    id: 'break-tackle',
    name: 'Break Tackle',
    description: 'Chance to break the first tackle attempt',
    trigger: 'onTackle',
    target: 'self',
    duration: 'instant',
    positions: ['RB'],
    rarity: 'common',
    statRequirement: {
      stat: 'elusiveness',
      minimum: 70
    },
    chanceToActivate: (stats) => stats.elusiveness * 0.75,
    effect: 'Negates first tackle attempt',
    icon: 'zap',
    color: 'text-yellow-400'
  },
  {
    id: 'second-wind',
    name: 'Second Wind',
    description: 'Burst of speed after breaking a tackle',
    trigger: 'onTackle',
    target: 'self',
    duration: 'play',
    positions: ['RB'],
    rarity: 'uncommon',
    statRequirement: {
      stat: 'acceleration',
      minimum: 75
    },
    chanceToActivate: (stats) => stats.acceleration * 0.6,
    effect: '+15% speed for remainder of play',
    icon: 'wind',
    color: 'text-blue-400'
  },

  // Wide Receiver Abilities
  {
    id: 'high-point',
    name: 'High Point Specialist',
    description: 'Increased chance to win jump balls',
    trigger: 'onCatch',
    target: 'self',
    duration: 'instant',
    positions: ['WR'],
    rarity: 'common',
    statRequirement: {
      stat: 'catching',
      minimum: 75
    },
    chanceToActivate: (stats) => stats.catching * 0.8,
    effect: '+25% chance to win contested catches',
    icon: 'arrow-up-to-line',
    color: 'text-green-400'
  },
  {
    id: 'route-master',
    name: 'Route Master',
    description: 'Creates extra separation at route breaks',
    trigger: 'onSnap',
    target: 'self',
    duration: 'play',
    positions: ['WR'],
    rarity: 'rare',
    statRequirement: {
      stat: 'agility',
      minimum: 80
    },
    chanceToActivate: (stats) => stats.agility * 0.5,
    effect: '+2 yards separation on cuts',
    icon: 'route',
    color: 'text-purple-400'
  },

  // Quarterback Abilities
  {
    id: 'bullet-pass',
    name: 'Bullet Pass',
    description: 'Throws with extra velocity to tight windows',
    trigger: 'onSnap',
    target: 'ball',
    duration: 'instant',
    positions: ['QB'],
    rarity: 'uncommon',
    statRequirement: {
      stat: 'armStrength',
      minimum: 75
    },
    chanceToActivate: (stats) => stats.armStrength * 0.65,
    effect: '-20% chance of defender deflection',
    icon: 'zap-fast',
    color: 'text-red-400'
  },
  {
    id: 'quick-release',
    name: 'Quick Release',
    description: 'Faster throwing motion reduces sack chance',
    trigger: 'onSnap',
    target: 'self',
    duration: 'instant',
    positions: ['QB'],
    rarity: 'rare',
    statRequirement: {
      stat: 'awareness',
      minimum: 80
    },
    chanceToActivate: (stats) => stats.awareness * 0.7,
    effect: '-40% chance to be sacked',
    icon: 'timer',
    color: 'text-orange-400'
  },

  // Defensive Line Abilities
  {
    id: 'bull-rush',
    name: 'Bull Rush',
    description: 'Powerful rush move that can collapse the pocket',
    trigger: 'onRush',
    target: 'opponent',
    duration: 'instant',
    positions: ['DL', 'DE', 'DT'],
    rarity: 'common',
    statRequirement: {
      stat: 'strength',
      minimum: 75
    },
    chanceToActivate: (stats) => stats.strength * 0.7,
    effect: 'Push blocker back 2 yards',
    icon: 'arrow-right',
    color: 'text-red-500'
  },

  // Linebacker Abilities
  {
    id: 'run-stopper',
    name: 'Run Stopper',
    description: 'Quickly diagnose and stop run plays',
    trigger: 'onSnap',
    target: 'self',
    duration: 'play',
    positions: ['LB', 'MLB', 'OLB'],
    rarity: 'uncommon',
    statRequirement: {
      stat: 'awareness',
      minimum: 75
    },
    chanceToActivate: (stats) => stats.awareness * 0.8,
    effect: '+2 yards closer to ball carrier on run plays',
    icon: 'shield',
    color: 'text-emerald-400'
  },

  // Defensive Back Abilities
  {
    id: 'ball-hawk',
    name: 'Ball Hawk',
    description: 'Increased chance to intercept passes',
    trigger: 'onCoverage',
    target: 'ball',
    duration: 'instant',
    positions: ['CB', 'S', 'FS', 'SS'],
    rarity: 'rare',
    statRequirement: {
      stat: 'catching',
      minimum: 70
    },
    chanceToActivate: (stats) => stats.catching * 0.6,
    effect: '+30% chance to intercept thrown balls',
    icon: 'eye',
    color: 'text-cyan-400'
  }
] 