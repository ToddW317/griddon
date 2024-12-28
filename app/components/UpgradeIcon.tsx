import React from 'react'
import { 
  Zap, 
  Clock, 
  Users, 
  Trophy, 
  Dumbbell, 
  Target,
  LucideIcon 
} from 'lucide-react'

const iconMap: Record<string, LucideIcon> = {
  zap: Zap,
  clock: Clock,
  users: Users,
  trophy: Trophy,
  dumbbell: Dumbbell,
  target: Target
}

interface UpgradeIconProps {
  icon: string
  className?: string
}

export function UpgradeIcon({ icon, className = "w-5 h-5" }: UpgradeIconProps) {
  const Icon = iconMap[icon]
  if (!Icon) return null
  
  return <Icon className={className} />
} 