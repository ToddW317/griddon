import React from 'react'
import { Dumbbell, Users } from 'lucide-react'

interface MobileNavProps {
  onOpenTraining: () => void
  onOpenRoster: () => void
}

export default function MobileNav({ onOpenTraining, onOpenRoster }: MobileNavProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white shadow-top p-4 grid grid-cols-2 gap-4">
      <button
        onClick={onOpenTraining}
        className="bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2"
      >
        <Dumbbell className="w-5 h-5" />
        <span>Training</span>
      </button>
      <button
        onClick={onOpenRoster}
        className="bg-orange-600 text-white rounded-lg py-2 px-4 flex items-center justify-center space-x-2"
      >
        <Users className="w-5 h-5" />
        <span>Roster</span>
      </button>
    </div>
  )
} 