import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SidebarProps {
  side: 'left' | 'right'
  children: React.ReactNode
}

export const Sidebar: React.FC<SidebarProps> = ({ side, children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false)

  return (
    <div
      className={cn(
        'relative transition-all duration-300 ease-in-out h-full',
        isCollapsed ? 'w-12' : 'w-80',
        'bg-slate-900/90 backdrop-blur-sm rounded-lg shadow-lg border border-slate-700/50'
      )}
    >
      <button
        onClick={() => setIsCollapsed(!isCollapsed)}
        className={cn(
          'absolute top-2 z-50 p-2 bg-accent text-slate-900 rounded-full shadow-md',
          'hover:bg-accent-light transition-colors',
          side === 'left' 
            ? '-right-3' 
            : '-left-3'
        )}
        aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {side === 'left' 
          ? (isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />)
          : (isCollapsed ? <ChevronLeft size={16} /> : <ChevronRight size={16} />)
        }
      </button>

      <div className={cn(
        'p-4 h-full bg-slate-800/50 rounded-lg',
        isCollapsed ? 'invisible w-0' : 'visible w-full',
        'transition-all duration-300'
      )}>
        {children}
      </div>
    </div>
  )
} 