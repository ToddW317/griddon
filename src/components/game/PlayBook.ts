import { PlayerPosition } from './Player';

export interface RoutePoint {
  x: number;
  y: number;
  timing: number;
}

export interface PlayerRoute {
  playerId: number;
  route: RoutePoint[];
  isBallCarrier?: boolean;
}

export interface Play {
  id: string;
  name: string;
  type: 'offense' | 'defense';
  formation: 'spread' | 'i-formation' | 'shotgun' | 'man-coverage' | 'zone-coverage';
  routes: PlayerRoute[];
  description: string;
}

// Example offensive plays
export const OFFENSIVE_PLAYS: Play[] = [
  {
    id: 'hb-dive',
    name: 'HB Dive',
    type: 'offense',
    formation: 'i-formation',
    description: 'Simple running play up the middle',
    routes: [
      {
        playerId: 0, // QB
        route: [
          { x: 5, y: 18, timing: 0 },     // Starting position
          { x: 5, y: 17.5, timing: 500 }, // Small step back for handoff
          { x: 5, y: 18, timing: 1000 },  // Return to position
        ]
      },
      {
        playerId: 1, // RB
        route: [
          { x: 5, y: 17, timing: 0 },     // Starting position
          { x: 5, y: 17.5, timing: 500 }, // Move to receive handoff
          { x: 5, y: 16, timing: 1000 },  // Run through hole
          { x: 5, y: 15, timing: 1500 },  // Continue upfield
        ],
        isBallCarrier: true
      },
      {
        playerId: 2, // WR Left
        route: [
          { x: 2, y: 18, timing: 0 },     // Starting position
          { x: 2, y: 17, timing: 1000 },  // Run block
        ]
      },
      {
        playerId: 3, // WR Right
        route: [
          { x: 8, y: 18, timing: 0 },     // Starting position
          { x: 8, y: 17, timing: 1000 },  // Run block
        ]
      },
    ]
  },
  // Add more plays...
];

// Define defensive reactions based on offensive play
export const getDefensiveReaction = (offensivePlay: Play): PlayerRoute[] => {
  switch (offensivePlay.id) {
    case 'hb-dive':
      return [
        {
          playerId: 4, // MLB
          route: [
            { x: 5, y: 15, timing: 0 },    // Starting position
            { x: 5, y: 16, timing: 1000 }, // Move to tackle
          ]
        },
        {
          playerId: 5, // CB Left
          route: [
            { x: 3, y: 16, timing: 0 },    // Starting position
            { x: 3, y: 17, timing: 1000 }, // Cover WR
          ]
        },
        {
          playerId: 6, // CB Right
          route: [
            { x: 7, y: 16, timing: 0 },    // Starting position
            { x: 7, y: 17, timing: 1000 }, // Cover WR
          ]
        },
        {
          playerId: 7, // Safety
          route: [
            { x: 5, y: 14, timing: 0 },    // Starting position
            { x: 5, y: 15, timing: 1500 }, // Move up for support
          ]
        },
      ];
    default:
      return [];
  }
};

export const DEFENSIVE_PLAYS: Play[] = [
  {
    id: 'base-man',
    name: 'Base Man Coverage',
    type: 'defense',
    formation: 'man-coverage',
    description: 'Basic man-to-man coverage',
    routes: [
      // Define defensive player routes...
    ]
  },
  // Add more defensive plays...
]; 