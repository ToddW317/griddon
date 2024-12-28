import React from 'react'
import { useGameStore } from '../../store/gameStore'
import { formatNumber } from '../../lib/utils'

export function StatsSidebar() {
  const { 
    upgrades,
    totalClicks,
    totalPointsEarned,
    roster,
    getUpgradeEffect
  } = useGameStore()

  const clickPower = getUpgradeEffect('click')
  const passiveIncome = getUpgradeEffect('passive')
  const trainingBonus = getUpgradeEffect('training')
  const prestigeBonus = getUpgradeEffect('prestige')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold mb-4 text-accent">Stats</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/90">Click Power:</span>
            <span className="text-accent font-bold">x{clickPower}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90">Income Rate:</span>
            <span className="text-accent font-bold">+{passiveIncome}/s</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90">Training Bonus:</span>
            <span className="text-accent font-bold">+{(trainingBonus * 100).toFixed(1)}%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90">Prestige Bonus:</span>
            <span className="text-accent font-bold">+{(prestigeBonus * 100).toFixed(1)}%</span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-accent">Team</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/90">Roster Size:</span>
            <span className="text-accent font-bold">{roster.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90">Total Upgrades:</span>
            <span className="text-accent font-bold">
              {upgrades.reduce((sum, u) => sum + u.level, 0)}
            </span>
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 text-accent">Lifetime</h2>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-white/90">Total Clicks:</span>
            <span className="text-accent font-bold">{formatNumber(totalClicks)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white/90">Points Earned:</span>
            <span className="text-accent font-bold">{formatNumber(totalPointsEarned)}</span>
          </div>
        </div>
      </div>
    </div>
  )
} 