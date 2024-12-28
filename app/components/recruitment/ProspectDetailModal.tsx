import React from 'react'
import { X, Star, DollarSign } from 'lucide-react'
import type { Player } from '../../types/player'
import { getAttributeDisplay } from '../../lib/attributeScaling'

interface ProspectDetailModalProps {
  prospect: Player
  onClose: () => void
  onRecruit: (player: Player) => void
  recruitCost: number
  canAfford: boolean
}

const attributeCategories = {
  'Speed & Movement': ['speed', 'acceleration', 'agility'],
  'Ball Carrier': ['elusiveness', 'breakTackle', 'ballCarrierVision'],
  'Receiving': ['catching', 'routeRunning', 'catchInTraffic'],
  'QB Skills': ['throwPower', 'throwAccuracy', 'awareness']
} as const

type AttributeKey = keyof Player['attributes']

export default function ProspectDetailModal({
  prospect,
  onClose,
  onRecruit,
  recruitCost,
  canAfford
}: ProspectDetailModalProps) {
  // Calculate average rating
  const getAverageRating = () => {
    if (!prospect?.attributes) return 0
    const attrs = Object.values(prospect.attributes)
    const sum = attrs.reduce((acc, curr) => acc + (curr?.value || 0), 0)
    return Math.floor(sum / attrs.length)
  }

  const rating = getAverageRating()
  const { color: ratingColor } = getAttributeDisplay(rating)

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-slate-900/95 rounded-lg w-full max-w-2xl overflow-hidden
                    border border-slate-700/50 animate-modal-enter">
        {/* Header */}
        <div className="p-6 border-b border-slate-700/50">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">{prospect.name}</h2>
              <div className="flex items-center space-x-2">
                <span className="text-white/70">{prospect.position}</span>
                <span className="text-white/50">•</span>
                <div className="flex items-center space-x-1">
                  <Star className="w-5 h-5 text-accent/80" />
                  <span className={`font-bold ${ratingColor}`}>{rating}</span>
                </div>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-slate-800/50 text-white/70 
                       hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Attributes */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          <div className="space-y-6">
            {Object.entries(attributeCategories).map(([category, attrs]) => (
              <div key={category}>
                <h3 className="text-lg font-bold text-accent/90 mb-3">{category}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {attrs.map(attrName => {
                    const attr = prospect.attributes[attrName as AttributeKey]
                    if (!attr) return null

                    const { color, label } = getAttributeDisplay(attr.value)
                    return (
                      <div key={attrName} className="bg-slate-800/50 rounded-lg p-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-white/90">
                            {attrName.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          <span className={`font-bold ${color}`}>{label}</span>
                        </div>
                        {/* Progress bar */}
                        <div className="h-2 bg-slate-700/50 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-accent/80 rounded-full transition-all duration-300"
                            style={{ width: `${(attr.value / 99) * 100}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-slate-700/50 bg-slate-800/50">
          <div className="flex items-center justify-between">
            <div className="text-white/70">
              <span>Recruitment Cost: </span>
              <span className="text-accent font-bold">{recruitCost} points</span>
            </div>
            <button
              onClick={() => onRecruit(prospect)}
              disabled={!canAfford}
              className="flex items-center space-x-2 px-6 py-2 rounded-lg
                       bg-accent text-slate-900 font-bold
                       hover:bg-accent/90 transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <DollarSign className="w-5 h-5" />
              <span>Recruit Player</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 