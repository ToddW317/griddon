import { ReactNode } from 'react'

export interface Upgrade {
  id: string
  name: string
  level: number
  baseCost: number
  costMultiplier: number
  baseEffect: number
  description: string
  icon: string
}

export type Tab = 'training' | 'roster' 