import React from 'react'
import { Star, ChevronRight } from 'lucide-react'
import type { Player } from '../../types/player'
import { getAttributeDisplay } from '../../lib/attributeScaling'
import { Tooltip } from '../ui/Tooltip'
import { Icon } from '../ui/Icon'

interface ProspectCardProps {
  prospect: Player
  onView: (player: Player) => void
  index: number
}

export default function ProspectCard({ prospect, onView, index }: ProspectCardProps) {
  // Calculate average rating based on primary attributes for position
  const getAverageRating = () => {
    if (!prospect?.attributes) return 0
    
    const attrs = Object.values(prospect.attributes)
    if (!attrs.length) return 0
    
    const sum = attrs.reduce((acc, curr) => acc + (curr?.value || 0), 0)
    return Math.floor(sum / attrs.length)
  }

  const rating = getAverageRating()
  const { color: ratingColor } = getAttributeDisplay(rating)

  if (!prospect) return null

  return (
    <div className="prospect-card bg-slate-900/90 backdrop-blur-sm rounded-lg 
                    border border-slate-700/50 hover:border-accent/50 
                    transition-all duration-200 group">
      <div className="p-4">
        {/* Header with Name, Position, Rating */}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-white/90 group-hover:text-white transition-colors">
              {prospect.name}
            </h3>
            <div className="flex items-center space-x-2 mt-1">
              <span className="text-sm text-white/70">{prospect.position}</span>
              <span className="text-white/50">•</span>
              <div className="flex items-center space-x-1">
                <Star className="w-4 h-4 text-accent/80" />
                <span className={`text-sm font-bold ${ratingColor}`}>
                  {rating}
                </span>
              </div>
            </div>

            {/* Special Ability Display */}
            {prospect.abilities && prospect.abilities[0] && (
              <div className="mt-2">
                <Tooltip content={
                  <div className="space-y-1">
                    <div className="font-bold text-accent">{prospect.abilities[0].name}</div>
                    <div className="text-sm">{prospect.abilities[0].description}</div>
                    <div className="text-xs text-white/70">
                      {Math.round(prospect.abilities[0].chanceToActivate(prospect.attributes))}% Activation Rate
                    </div>
                  </div>
                }>
                  <div className={`inline-flex items-center space-x-1.5 px-2 py-1 
                                 rounded-md text-sm
                                 bg-slate-800/50 border border-slate-700/30
                                 ${prospect.abilities[0].color}`}
                  >
                    <Icon name={prospect.abilities[0].icon} className="w-3.5 h-3.5" />
                    <span className="font-medium">{prospect.abilities[0].name}</span>
                  </div>
                </Tooltip>
              </div>
            )}
          </div>

          <button
            onClick={() => onView(prospect)}
            className="p-2 rounded-lg bg-accent/10 text-accent hover:bg-accent/20 
                      transition-colors group-hover:bg-accent/30"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Attributes Grid */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(prospect.attributes).map(([key, attr]) => {
            const { color } = getAttributeDisplay(attr.value)
            return (
              <div key={key} className="flex justify-between items-center">
                <span className="text-white/70">{key}</span>
                <span className={`font-bold ${color}`}>{attr.value}</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
} 