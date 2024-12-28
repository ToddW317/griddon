'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Goal, Users, LineChart, Trophy } from 'lucide-react'

const navItems = [
  { name: 'Dashboard', href: '/', icon: <LineChart className="w-4 h-4" /> },
  { name: 'Recruitment', href: '/recruitment', icon: <Users className="w-4 h-4" /> },
  { name: 'League', href: '/league', icon: <Trophy className="w-4 h-4" /> },
]

export default function Navbar() {
  const pathname = usePathname()
  
  return (
    <nav className="bg-slate-900/90 backdrop-blur-sm border-b border-slate-700/50">
      <div className="max-w-screen-2xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Goal className="w-6 h-6 text-accent" />
            <span className="text-xl font-bold text-accent">Griddon</span>
          </div>
          
          {/* Navigation */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    px-4 py-2 rounded-lg flex items-center space-x-2
                    transition-colors duration-200
                    ${isActive 
                      ? 'bg-accent/20 text-accent' 
                      : 'text-white/70 hover:text-white hover:bg-slate-800/50'
                    }
                  `}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </div>
          
          {/* Right side - can add profile/settings later */}
          <div className="w-24" />
        </div>
      </div>
    </nav>
  )
}