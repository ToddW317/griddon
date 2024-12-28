'use client'

import React from 'react'
import { Search, Filter, RefreshCw, Clock } from 'lucide-react'
import { useRecruitmentStore } from '../store/recruitmentStore'
import { useGameStore } from '../store/gameStore'
import ProspectCard from '../components/recruitment/ProspectCard'
import ProspectFilters from '../components/recruitment/ProspectFilters'
import ProspectDetailModal from '../components/recruitment/ProspectDetailModal'
import type { Player } from '../types/player'
import PointsShop from '../components/recruitment/PointsShop'
import { LoadingState } from '../components/LoadingState'
import { FormattedNumber } from '../components/ui/FormattedNumber'
import { formatRecruitmentNumber } from '../lib/utils'
import { Tooltip } from '../components/ui/Tooltip'

// Create a specialized component for recruitment numbers
function RecruitmentNumber({ 
  value, 
  decimals = 2,
  prefix = '',
  suffix = ''
}: {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}) {
  const { formatted, raw, color } = formatRecruitmentNumber(value, decimals)

  return (
    <Tooltip content={
      <div className="text-white/90">
        Exact: {raw}
      </div>
    }>
      <span className={`font-bold ${color} transition-colors duration-200`}>
        {prefix}{formatted}{suffix}
      </span>
    </Tooltip>
  )
}

export default function RecruitmentPage() {
  const [selectedProspect, setSelectedProspect] = React.useState<Player | null>(null)
  const { 
    prospects, 
    filters, 
    refreshCost,
    lastRefreshTime,
    generateProspects,
    refreshProspects,
    setFilter,
    calculateRecruitCost,
    recruitPlayer
  } = useRecruitmentStore()

  const { 
    trainingPoints,
    recruitmentPoints
  } = useGameStore()

  // Initialize prospects if empty
  React.useEffect(() => {
    if (prospects.length === 0) {
      generateProspects()
    }
  }, [prospects.length, generateProspects])

  // Filter and sort prospects
  const filteredProspects = React.useMemo(() => {
    let filtered = prospects.filter(prospect => {
      // Position filter
      if (filters.position && prospect.position !== filters.position) {
        return false
      }

      // Rating filter
      if (filters.minRating) {
        const attrs = Object.values(prospect.attributes)
        const avgRating = Math.floor(attrs.reduce((acc, curr) => acc + curr.value, 0) / attrs.length)
        if (avgRating < filters.minRating) {
          return false
        }
      }

      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase()
        return prospect.name.toLowerCase().includes(searchLower)
      }

      return true
    })

    // Sort prospects if sort options are set
    if (filters.sortBy) {
      filtered.sort((a, b) => {
        let valueA, valueB

        if (filters.sortBy === 'rating') {
          const getAvgRating = (p: Player) => {
            const attrs = Object.values(p.attributes)
            return attrs.reduce((acc, curr) => acc + curr.value, 0) / attrs.length
          }
          valueA = getAvgRating(a)
          valueB = getAvgRating(b)
        } else {
          valueA = a.attributes[filters.sortBy]?.value || 0
          valueB = b.attributes[filters.sortBy]?.value || 0
        }

        return filters.sortDirection === 'desc' ? valueB - valueA : valueA - valueB
      })
    }

    return filtered
  }, [prospects, filters])

  // Calculate time until next refresh
  const getRefreshTimeRemaining = () => {
    const now = Date.now()
    const timeSinceLastRefresh = now - lastRefreshTime
    const cooldown = 5 * 60 * 1000 // 5 minutes
    const remaining = Math.max(0, cooldown - timeSinceLastRefresh)
    
    if (remaining === 0) return null
    
    const minutes = Math.floor(remaining / 60000)
    const seconds = Math.floor((remaining % 60000) / 1000)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const timeRemaining = getRefreshTimeRemaining()

  // Handle recruitment
  const handleRecruit = (player: Player) => {
    const success = recruitPlayer(player)
    if (success) {
      setSelectedProspect(null)
      // TODO: Show success notification
    } else {
      // TODO: Show error notification (not enough points or roster full)
    }
  }

  return (
    <LoadingState>
      <main className="min-h-screen p-4">
        <div className="max-w-screen-2xl mx-auto space-y-6">
          {/* Header with Points Display */}
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-accent">Recruitment Center</h1>
              <p className="text-white/70">Find and recruit new players for your team</p>
            </div>
            <div className="flex items-center space-x-8">
              <div className="text-right">
                <div className="text-sm text-white/70">Training Points</div>
                <RecruitmentNumber value={trainingPoints} />
              </div>
              <div className="text-right">
                <div className="text-sm text-white/70">Recruitment Points</div>
                <RecruitmentNumber value={recruitmentPoints} />
              </div>
            </div>
          </div>

          {/* Points Shop */}
          <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <PointsShop />
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="text"
                placeholder="Search prospects..."
                value={filters.search}
                onChange={(e) => setFilter('search', e.target.value)}
                className="w-full bg-slate-900/90 backdrop-blur-sm rounded-lg px-4 py-2 pl-10
                          border border-slate-700/50 text-white/90
                          focus:outline-none focus:border-accent/50"
              />
              <Search className="absolute left-3 top-2.5 w-5 h-5 text-white/50" />
            </div>
            
            {/* Filters */}
            <ProspectFilters />
            
            {/* Refresh */}
            <div className="flex justify-end">
              <button
                onClick={refreshProspects}
                disabled={!!timeRemaining}
                className="flex items-center space-x-2 px-4 py-2
                          bg-accent/20 text-accent rounded-lg
                          hover:bg-accent/30 transition-colors
                          disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {timeRemaining ? (
                  <>
                    <Clock className="w-5 h-5" />
                    <span>{timeRemaining}</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-5 h-5" />
                    <span>Refresh ({refreshCost} pts)</span>
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Prospects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredProspects.map((prospect, index) => (
              <ProspectCard
                key={prospect.id}
                prospect={prospect}
                onView={setSelectedProspect}
                index={index}
              />
            ))}
          </div>

          {/* No Results */}
          {filteredProspects.length === 0 && (
            <div className="text-center py-8">
              <p className="text-white/70">No prospects match your filters</p>
            </div>
          )}
        </div>

        {/* Prospect Detail Modal */}
        {selectedProspect && (
          <ProspectDetailModal
            prospect={selectedProspect}
            onClose={() => setSelectedProspect(null)}
            onRecruit={handleRecruit}
            recruitCost={calculateRecruitCost(selectedProspect)}
            canAfford={trainingPoints >= calculateRecruitCost(selectedProspect)}
          />
        )}
      </main>
    </LoadingState>
  )
}