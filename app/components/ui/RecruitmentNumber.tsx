'use client'

import React from 'react'
import { Tooltip } from './Tooltip'
import { formatRecruitmentNumber } from '../../lib/utils'

interface RecruitmentNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function RecruitmentNumber({ 
  value, 
  decimals = 2,
  prefix = '',
  suffix = ''
}: RecruitmentNumberProps) {
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