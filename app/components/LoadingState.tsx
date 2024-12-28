'use client'

import React from 'react'
import { useGameStore } from '../store/gameStore'

interface LoadingStateProps {
  children: React.ReactNode
}

export function LoadingState({ children }: LoadingStateProps) {
  const isHydrated = useGameStore(state => state.isHydrated)

  if (!isHydrated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-accent animate-pulse">Loading game state...</div>
      </div>
    )
  }

  return <>{children}</>
} 