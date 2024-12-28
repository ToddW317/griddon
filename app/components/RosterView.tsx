import React from 'react'
import { Player } from '../types/player'
import { Users, Dumbbell, Activity, Brain } from 'lucide-react'

interface RosterViewProps {
  players: Player[]
}

export default function RosterView({ players }: RosterViewProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
        <Users className="w-5 h-5" />
        Team Roster
      </h2>
      
      <div className="space-y-3">
        {players.map(player => (
          <div key={player.id} className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <span className="font-bold text-gray-800">{player.name}</span>
                <span className="ml-2 text-sm text-orange-600">{player.position}</span>
              </div>
              <span className="text-sm bg-gray-200 px-2 py-1 rounded">
                Level {player.level}
              </span>
            </div>
            
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-blue-500" />
                <span className="text-gray-600">Speed: {player.stats.speed}</span>
              </div>
              <div className="flex items-center gap-1">
                <Dumbbell className="w-4 h-4 text-red-500" />
                <span className="text-gray-600">Strength: {player.stats.strength}</span>
              </div>
              <div className="flex items-center gap-1">
                <Activity className="w-4 h-4 text-green-500" />
                <span className="text-gray-600">Agility: {player.stats.agility}</span>
              </div>
              <div className="flex items-center gap-1">
                <Brain className="w-4 h-4 text-purple-500" />
                <span className="text-gray-600">Awareness: {player.stats.awareness}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 