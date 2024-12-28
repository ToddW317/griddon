type NumberRange = {
  suffix: string
  threshold: number
  color: string
}

const NUMBER_RANGES: NumberRange[] = [
  { threshold: 0, suffix: '', color: 'text-white/90' },
  { threshold: 1000, suffix: 'K', color: 'text-blue-400' },
  { threshold: 1000000, suffix: 'M', color: 'text-green-400' },
  { threshold: 1000000000, suffix: 'B', color: 'text-yellow-400' },
  { threshold: 1000000000000, suffix: 'T', color: 'text-purple-400' },
  { threshold: 1000000000000000, suffix: 'Qa', color: 'text-pink-400' },
  { threshold: 1000000000000000000, suffix: 'Qi', color: 'text-red-400' },
  { threshold: 1000000000000000000000, suffix: 'Sx', color: 'text-orange-400' },
  { threshold: 1000000000000000000000000, suffix: 'Sp', color: 'text-emerald-400' },
  { threshold: 1000000000000000000000000000, suffix: 'Oc', color: 'text-cyan-400' }
]

interface FormattedNumber {
  formatted: string    // The formatted string (e.g., "1.234K")
  raw: string         // The exact number as a string with commas
  color: string       // The color class for this number range
}

export const formatNumber = (num: number, decimals = 2): FormattedNumber => {
  // Find the appropriate range for the number
  const range = [...NUMBER_RANGES]
    .reverse()
    .find(r => num >= r.threshold) || NUMBER_RANGES[0]

  // Format the exact number with commas
  const rawNumber = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  // If less than 1000, just return the number with commas
  if (num < 1000) {
    return {
      formatted: rawNumber,
      raw: rawNumber,
      color: range.color
    }
  }

  // Calculate the divided number based on the range
  const divider = range.threshold || 1
  const divided = num / divider

  // Format the number with the appropriate suffix
  const formatted = divided.toLocaleString('en-US', {
    minimumFractionDigits: num >= 1000000 ? 3 : decimals,
    maximumFractionDigits: num >= 1000000 ? 3 : decimals
  }) + range.suffix

  return {
    formatted,
    raw: rawNumber,
    color: range.color
  }
}

// Helper function for raw number formatting (used in calculations)
export const roundNumber = (num: number, decimals = 2) => {
  return Number(Math.round(num * 100) / 100)
}

// Special formatter for recruitment page
export const formatRecruitmentNumber = (num: number, decimals = 2): FormattedNumber => {
  // Format the exact number with commas
  const rawNumber = num.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })

  // For numbers less than 10000, just return the number with commas
  if (num < 10000) {
    return {
      formatted: rawNumber,
      raw: rawNumber,
      color: 'text-white/90'
    }
  }

  // Find the appropriate range for larger numbers
  const range = [...NUMBER_RANGES]
    .reverse()
    .find(r => num >= r.threshold) || NUMBER_RANGES[0]

  const divider = range.threshold || 1
  const divided = num / divider

  const formatted = divided.toLocaleString('en-US', {
    minimumFractionDigits: num >= 1000000 ? 3 : decimals,
    maximumFractionDigits: num >= 1000000 ? 3 : decimals
  }) + range.suffix

  return {
    formatted,
    raw: rawNumber,
    color: range.color
  }
} 