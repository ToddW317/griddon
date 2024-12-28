import React from 'react'
import type { Player } from '../types/player'
import PlayerAttributeUpgrade from './PlayerAttributeUpgrade'

interface PlayerTrainingViewProps {
  player: Player
  trainingPoints: number
  onUpgradeAttribute: (playerId: string, attributeName: keyof Player['attributes']) => void
}

export default function PlayerTrainingView({
  player,
  trainingPoints,
  onUpgradeAttribute
}: PlayerTrainingViewProps) {
  return (
    <div className="space-y-4">
      <div className="bg-slate-900/80 p-4 rounded-lg border border-slate-700/50">
        <h3 className="text-lg font-bold text-accent mb-2">{player.name}</h3>
        <div className="flex items-center space-x-2 text-white/90">
          <span>{player.position}</span>
          <span>•</span>
          <span>Level {player.level}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Object.entries(player.attributes).map(([name, attr]) => (
          <PlayerAttributeUpgrade
            key={name}
            name={name.replace(/([A-Z])/g, ' $1').trim()} // Convert camelCase to spaces
            attribute={attr}
            canAfford={trainingPoints >= attr.cost}
            onUpgrade={() => onUpgradeAttribute(player.id, name as keyof Player['attributes'])}
          />
        ))}
      </div>
    </div>
  )
} 