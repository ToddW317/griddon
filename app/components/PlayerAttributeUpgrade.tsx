import React from 'react'
import { ArrowUp, Zap } from 'lucide-react'
import type { PlayerAttribute } from '../types/player'
import { getAttributeDisplay, getAttributeTier } from '../lib/attributeScaling'

interface PlayerAttributeUpgradeProps {
  name: string
  attribute: PlayerAttribute
  canAfford: boolean
  onUpgrade: () => void
  isMaxed?: boolean
  cost: number
}

export default function PlayerAttributeUpgrade({
  name,
  attribute,
  canAfford,
  onUpgrade,
  isMaxed = false,
  cost
}: PlayerAttributeUpgradeProps) {
  const { color, label } = getAttributeDisplay(attribute.value)
  const tier = getAttributeTier(attribute.value)
  
  return (
    <div className="bg-slate-800/90 rounded-lg p-3 border border-slate-700/50 
                    transition-all duration-200 hover:bg-slate-700/90 group">
      <div className="flex justify-between items-center mb-1">
        <div className="flex items-center space-x-2">
          <Zap className="w-4 h-4 text-accent/90" />
          <span className="font-medium text-white/90">{name}</span>
        </div>
        <span className={`${color} font-bold`}>{label}</span>
      </div>
      
      <button
        onClick={onUpgrade}
        disabled={!canAfford || isMaxed}
        className="w-full bg-accent/20 text-accent text-sm font-bold py-1.5 px-3 rounded-lg
                   hover:bg-accent/30 transition-all duration-200
                   disabled:bg-slate-700/50 disabled:text-white/30 disabled:cursor-not-allowed
                   flex items-center justify-center space-x-1"
      >
        {isMaxed ? (
          <span>Maxed</span>
        ) : (
          <>
            <ArrowUp className="w-3 h-3" />
            <span>Upgrade ({cost} pts)</span>
          </>
        )}
      </button>
    </div>
  )
} 