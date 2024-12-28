import * as Icons from 'lucide-react'

interface IconProps {
  name: string
  className?: string
}

export function Icon({ name, className }: IconProps) {
  const LucideIcon = Icons[name as keyof typeof Icons]
  return LucideIcon ? <LucideIcon className={className} /> : null
} 