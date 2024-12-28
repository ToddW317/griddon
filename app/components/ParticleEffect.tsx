import React from 'react'

interface ParticleProps {
  x: number
  y: number
  type?: 'star' | 'circle' | 'spark'
}

export default function ParticleEffect({ x, y, type = 'circle' }: ParticleProps) {
  const angle = Math.random() * Math.PI * 2
  const speed = Math.random() * 2 + 1
  const size = Math.random() * 4 + 2
  
  // Different particle styles
  const particleStyles = {
    circle: {
      className: "fixed rounded-full animate-particle opacity-80 will-change-transform",
      background: '#FCD34D',
      size: size,
    },
    star: {
      className: "absolute animate-particle-star opacity-80",
      background: '#FBBF24',
      size: size * 1.5,
    },
    spark: {
      className: "absolute animate-particle-spark opacity-90",
      background: '#F59E0B',
      size: size * 0.8,
    }
  }

  const style = {
    transform: `translate(${x}px, ${y}px) translate(-50%, -50%)`,
    width: particleStyles[type].size,
    height: particleStyles[type].size,
    background: particleStyles[type].background,
    '--angle': `${angle}rad`,
    '--speed': `${speed}`,
  } as React.CSSProperties

  return (
    <div 
      className={particleStyles[type].className}
      style={style}
    />
  )
} 