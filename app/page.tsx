'use client'

import React, { useEffect } from 'react'
import { Zap, Clock } from 'lucide-react'
import { LoadingState } from './components/LoadingState'
import { useSidebar } from './hooks/useSidebar'
import { Sidebar } from './components/sidebar/Sidebar'
import ClickAnimation from './components/ClickAnimation'
import UpgradeButton from './components/UpgradeButton'
import ParticleEffect from './components/ParticleEffect'
import { useGameStore } from './store/gameStore'
import type { Upgrade } from './types/game'
import { formatNumber } from './lib/utils'
import { FormattedNumber } from './components/ui/FormattedNumber'

export default function Home() {
  const { leftSidebarOpen, rightSidebarOpen } = useSidebar()
  const { 
    trainingPoints, 
    addTrainingPoints,
    roster,
    upgrades,
    purchaseUpgrade,
    getUpgradeCost,
    getUpgradeEffect,
    incrementTotalClicks,
    lastTickTime,
    setLastTickTime
  } = useGameStore()

  // Track animations and particles
  const [animations, setAnimations] = React.useState<{ id: number; x: number; y: number }[]>([])
  const [particles, setParticles] = React.useState<{
    id: string
    x: number
    y: number
    type: 'circle' | 'star' | 'spark'
  }[]>([])

  // Add a ref to track if we should spawn particles
  const canSpawnParticles = React.useRef(true)

  // Handle training click with all bonuses
  const handleTrainClick = (e: React.MouseEvent) => {
    const clickPower = getUpgradeEffect('click')
    addTrainingPoints(clickPower)
    incrementTotalClicks()
    // ... rest of click handling (animations, etc.)
  }

  // Add passive income effect with precise timing
  useEffect(() => {
    const passiveIncome = getUpgradeEffect('passive')
    if (passiveIncome <= 0) return

    const timer = setInterval(() => {
      const now = Date.now()
      const timeDiff = now - lastTickTime
      const pointsToAdd = (passiveIncome * timeDiff) / 1000 // Convert to points per millisecond
      
      addTrainingPoints(pointsToAdd)
      setLastTickTime(now)
    }, 100) // Update more frequently for smoother incrementing

    return () => clearInterval(timer)
  }, [getUpgradeEffect, addTrainingPoints, lastTickTime, setLastTickTime])

  return (
    <LoadingState>
      <div className="flex gap-4 p-4 min-h-screen bg-primary/95">
        {/* Left Sidebar */}
        <Sidebar side="left">
          <h2 className="text-xl font-bold mb-4 text-accent">Team Roster</h2>
          <div className="space-y-2">
            {roster.map(player => (
              <div key={player.id} className="p-2 bg-slate-800/50 rounded-lg">
                {player.name} - {player.position}
              </div>
            ))}
          </div>
        </Sidebar>

        {/* Main Content */}
        <div className="flex-1">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-accent">Griddon</h1>
            
            <div className="grid grid-cols-2 gap-4 my-4">
              <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50">
                <span className="text-white/90">Training Points: </span>
                <FormattedNumber value={trainingPoints} />
              </div>
              <div className="bg-slate-900/80 backdrop-blur-sm p-4 rounded-lg border border-slate-700/50">
                <span className="text-white/90">Income: </span>
                <FormattedNumber 
                  value={getUpgradeEffect('passive')} 
                  prefix="+" 
                  suffix="/s" 
                />
              </div>
            </div>
          </div>

          <div className="bg-slate-900/90 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50">
            <h2 className="text-xl font-bold mb-4 text-accent">Game Field</h2>
            <div 
              onClick={handleTrainClick}
              className="relative h-96 bg-slate-800/90 rounded-lg flex items-center justify-center 
                        border border-slate-700/50 cursor-pointer 
                        hover:bg-slate-700/90 transition-all duration-200
                        active:scale-[0.99] active:bg-slate-600/90
                        shadow-inner select-none overflow-hidden
                        group"
            >
              <div className="text-center select-none transform transition-all duration-200 group-active:scale-95">
                <span className="text-accent/70 block mb-2 select-none 
                               group-hover:text-accent/90 transition-colors">
                  Click to Train!
                </span>
                <span className="select-none text-xl group-hover:scale-110 
                               transition-all inline-block">
                  <FormattedNumber 
                    value={getUpgradeEffect('click')} 
                    prefix="+" 
                    suffix=" points per click"
                  />
                </span>
              </div>

              {animations.map(({ id, x, y }) => (
                <ClickAnimation key={id} x={x} y={y} value={getUpgradeEffect('click')} />
              ))}
              
              {/* Ripple effect */}
              <div className="absolute inset-0 pointer-events-none">
                {animations.map(({ id, x, y }) => (
                  <div
                    key={`ripple-${id}`}
                    className="absolute rounded-full bg-accent/20 animate-ripple"
                    style={{
                      left: x - 25,
                      top: y - 25,
                      width: 50,
                      height: 50,
                    }}
                  />
                ))}
              </div>

              {/* Particles */}
              {particles.map((particle) => (
                <ParticleEffect
                  key={particle.id}
                  x={particle.x}
                  y={particle.y}
                  type={particle.type}
                />
              ))}
            </div>
          </div>

          {/* Upgrades Section */}
          <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upgrades.map(upgrade => (
              <UpgradeButton
                key={upgrade.id}
                upgrade={upgrade}
                cost={getUpgradeCost(upgrade.id)}
                canAfford={trainingPoints >= getUpgradeCost(upgrade.id)}
                currentEffect={getUpgradeEffect(upgrade.id)}
                nextEffect={getUpgradeEffect(upgrade.id) + upgrade.baseEffect}
                suffix={
                  upgrade.id === 'passive' ? '/s' : 
                  upgrade.id === 'efficiency' ? '% discount' :
                  upgrade.id === 'roster' ? ' slots' : ''
                }
                onClick={() => purchaseUpgrade(upgrade.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Sidebar */}
        <Sidebar side="right">
          <h2 className="text-xl font-bold mb-4 text-accent">Stats</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-white/90">Click Power: </span>
              <FormattedNumber 
                value={getUpgradeEffect('click')} 
                prefix="x" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/90">Income Rate: </span>
              <FormattedNumber 
                value={getUpgradeEffect('passive')} 
                prefix="+" 
                suffix="/s" 
              />
            </div>
            <div className="flex justify-between items-center">
              <span className="text-white/90">Team Size:</span>
              <span className="text-accent font-bold">{roster.length}</span>
            </div>
          </div>
        </Sidebar>
      </div>
    </LoadingState>
  )
} 