'use client'

import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface TooltipProps {
  content: React.ReactNode
  children: React.ReactNode
}

export function Tooltip({ content, children }: TooltipProps) {
  const [isVisible, setIsVisible] = React.useState(false)
  const [position, setPosition] = React.useState({ x: 0, y: 0 })
  const tooltipRef = React.useRef<HTMLDivElement>(null)

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect()
    setPosition({
      x: rect.left + window.scrollX,
      y: rect.bottom + window.scrollY + 5
    })
    setIsVisible(true)
  }

  return (
    <div 
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      <AnimatePresence>
        {isVisible && (
          <motion.div
            ref={tooltipRef}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 px-3 py-2 text-sm bg-slate-900/95 backdrop-blur-sm
                     text-white/90 rounded-lg border border-slate-700/50
                     shadow-xl max-w-xs"
            style={{
              left: position.x,
              top: position.y,
              transform: 'translateX(-50%)'
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
} 