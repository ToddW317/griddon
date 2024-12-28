import React from 'react'
import { ArrowUp } from 'lucide-react'
import { UpgradeIcon } from './UpgradeIcon'
import { Tooltip } from './ui/Tooltip'
import { FormattedNumber } from './ui/FormattedNumber'
import type { Upgrade } from '../types/game'

interface UpgradeButtonProps {
  upgrade: Upgrade
  cost: number
  canAfford: boolean
  currentEffect: number
  nextEffect: number
  suffix?: string
  onClick: () => void
}

function UpgradeTooltip({ upgrade }: { upgrade: Upgrade }) {
  return (
    <div className="space-y-2">
      <p>{upgrade.description}</p>
      <div className="text-xs text-white/70">
        <div>Base Effect: +{upgrade.baseEffect} per level</div>
        <div>Cost Scaling: x{upgrade.costMultiplier} per level</div>
      </div>
    </div>
  )
}

export default function UpgradeButton({
  upgrade,
  cost,
  canAfford,
  currentEffect,
  nextEffect,
  suffix = '',
  onClick
}: UpgradeButtonProps) {
  return (
    <Tooltip content={<UpgradeTooltip upgrade={upgrade} />}>
      <button
        onClick={onClick}
        disabled={!canAfford}
        className="relative group bg-slate-900/90 backdrop-blur-sm rounded-lg p-4
                   border border-slate-700/50 hover:bg-slate-800/90 transition-all
                   disabled:opacity-50 disabled:cursor-not-allowed w-full text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <UpgradeIcon icon={upgrade.icon} />
              <span className="font-bold text-accent">{upgrade.name}</span>
            </div>
            <p className="text-sm text-white/70 mt-1">{upgrade.description}</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/70">Level {upgrade.level}</div>
            <FormattedNumber value={cost} suffix=" pts" />
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="text-white/70">
            Current: <FormattedNumber value={currentEffect} suffix={suffix} />
          </div>
          <div className="flex items-center space-x-1">
            <ArrowUp className="w-4 h-4" />
            <FormattedNumber value={nextEffect} suffix={suffix} />
          </div>
        </div>
      </button>
    </Tooltip>
  )
} 