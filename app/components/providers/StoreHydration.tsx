'use client'

import { useEffect } from 'react'
import { useGameStore } from '@/app/store/gameStore'

export function StoreHydration() {
  const setHydrated = useGameStore(state => state.setHydrated)

  useEffect(() => {
    setHydrated(true)
  }, [setHydrated])

  return null
} 