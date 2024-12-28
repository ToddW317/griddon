'use client'

import React from 'react'
import { Tooltip } from './Tooltip'
import { formatNumber } from '../../lib/utils'

interface FormattedNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
}

export function FormattedNumber({ 
  value, 
  decimals = 2,
  prefix = '',
  suffix = ''
}: FormattedNumberProps) {
  const { formatted, raw, color } = formatNumber(value, decimals)

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