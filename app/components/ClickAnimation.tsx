import React from 'react'

interface ClickAnimationProps {
  x: number
  y: number
  value: number
}

export default function ClickAnimation({ x, y, value }: ClickAnimationProps) {
  return (
    <span
      className="absolute pointer-events-none font-bold animate-float text-yellow-300 text-xl"
      style={{ 
        left: x, 
        top: y,
        textShadow: '0 0 10px rgba(253, 224, 71, 0.5)'
      }}
    >
      +{value}
    </span>
  )
} 