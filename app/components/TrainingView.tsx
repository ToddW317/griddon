import React from 'react'
import { ArrowUp, Zap, Clock } from 'lucide-react'
import type { Upgrade } from '../types/game'

interface TrainingViewProps {
  points: number
  clickPower: number
  passiveIncome: number
  upgrades: Upgrade[]
  onTrain: (e: React.MouseEvent) => void
  onUpgrade: (id: 'click' | 'passive') => void
  animations: { id: number; x: number; y: number }[]
  getUpgradeCost: (upgrade: Upgrade) => number
  getNextLevelEffect: (upgrade: Upgrade) => number
}

export default function TrainingView({
  points,
  clickPower,
  passiveIncome,
  upgrades,
  onTrain,
  onUpgrade,
  animations,
  getUpgradeCost,
  getNextLevelEffect
}: TrainingViewProps) {
  return (
    <div className="space-y-6">
      {/* Training Button */}
      <div className="relative">
        <button
          onClick={onTrain}
          className="w-full bg-orange-600 text-white font-bold py-3 px-6 rounded-lg
                   hover:bg-orange-700 transition-colors duration-200
                   active:transform active:scale-95 overflow-hidden"
        >
          Train Team (+{clickPower} point{clickPower > 1 ? 's' : ''})
          {animations.map(({ id, x, y }) => (
            <span
              key={id}
              className="absolute pointer-events-none text-yellow-300 font-bold animate-float"
              style={{ left: x, top: y }}
            >
              +{clickPower}
            </span>
          ))}
        </button>
      </div>

      {/* Upgrades Section */}
      <div className="space-y-3">
        {upgrades.map(upgrade => (
          <div key={upgrade.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center space-x-2">
                {upgrade.icon}
                <span className="font-bold">{upgrade.name}</span>
              </div>
              <span className="text-sm text-gray-600">Level {upgrade.level}</span>
            </div>
            <div className="text-sm text-gray-600 mb-2">
              Current: {upgrade.id === 'click' ? `${clickPower} per click` : `${passiveIncome} per second`}
              <br />
              Next: {getNextLevelEffect(upgrade)} {upgrade.id === 'click' ? 'per click' : 'per second'}
            </div>
            <button
              onClick={() => onUpgrade(upgrade.id)}
              disabled={points < getUpgradeCost(upgrade)}
              className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded-lg
                       hover:bg-green-700 transition-colors duration-200
                       disabled:bg-gray-400 disabled:cursor-not-allowed
                       flex items-center justify-center space-x-2"
            >
              <ArrowUp className="w-4 h-4" />
              <span>Upgrade ({getUpgradeCost(upgrade)} points)</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  )
} 