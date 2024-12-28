import React from 'react'
import { Filter as FilterIcon, X, SortAsc, SortDesc } from 'lucide-react'
import { useRecruitmentStore } from '../../store/recruitmentStore'

const positions = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S']
const ratings = [
  { label: '90+', value: 90 },
  { label: '80+', value: 80 },
  { label: '70+', value: 70 },
]

// Add sorting options
type SortOption = {
  label: string
  value: string
  key: keyof Player['attributes'] | 'rating'
  direction: 'asc' | 'desc'
}

const sortOptions: SortOption[] = [
  { label: 'Rating: High to Low', value: 'rating-desc', key: 'rating', direction: 'desc' },
  { label: 'Rating: Low to High', value: 'rating-asc', key: 'rating', direction: 'asc' },
  // Add more sort options...
]

export default function ProspectFilters() {
  const { filters, setFilter, clearFilters, sortBy } = useRecruitmentStore()
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <div className="flex items-center space-x-2">
      {/* Position Filter */}
      <div className="relative group">
        <button className="flex items-center space-x-2 px-4 py-2 
                          bg-slate-900/90 backdrop-blur-sm rounded-lg
                          border border-slate-700/50 text-white/90
                          hover:bg-slate-800/90 transition-colors">
          <FilterIcon className="w-5 h-5" />
          <span>{filters.position || 'Position'}</span>
        </button>
        
        {/* Dropdown */}
        <div className="absolute top-full left-0 mt-2 w-48 py-2
                      bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700/50
                      shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-10">
          {positions.map(pos => (
            <button
              key={pos}
              onClick={() => setFilter('position', pos)}
              className={`w-full px-4 py-2 text-left hover:bg-slate-800/50
                         ${filters.position === pos ? 'text-accent' : 'text-white/90'}`}
            >
              {pos}
            </button>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div className="relative group">
        <button className="flex items-center space-x-2 px-4 py-2
                          bg-slate-900/90 backdrop-blur-sm rounded-lg
                          border border-slate-700/50 text-white/90
                          hover:bg-slate-800/90 transition-colors">
          <FilterIcon className="w-5 h-5" />
          <span>{filters.minRating ? `${filters.minRating}+` : 'Rating'}</span>
        </button>
        
        {/* Dropdown */}
        <div className="absolute top-full left-0 mt-2 w-48 py-2
                      bg-slate-900/95 backdrop-blur-sm rounded-lg border border-slate-700/50
                      shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible
                      transition-all duration-200 z-10">
          {ratings.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter('minRating', value)}
              className={`w-full px-4 py-2 text-left hover:bg-slate-800/50
                         ${filters.minRating === value ? 'text-accent' : 'text-white/90'}`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Sort Options */}
      <div className="relative group">
        <button 
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center space-x-2 px-4 py-2
                    bg-slate-900/90 backdrop-blur-sm rounded-lg
                    border border-slate-700/50 text-white/90
                    hover:bg-slate-800/90 transition-colors"
        >
          {filters.sortDirection === 'desc' ? (
            <SortDesc className="w-5 h-5" />
          ) : (
            <SortAsc className="w-5 h-5" />
          )}
          <span>Sort</span>
        </button>

        {/* Dropdown with animation */}
        {isOpen && (
          <div 
            className="absolute top-full left-0 mt-2 w-48 py-2
                      bg-slate-900/95 backdrop-blur-sm rounded-lg 
                      border border-slate-700/50 shadow-xl
                      animate-dropdown-enter z-10"
          >
            {sortOptions.map(option => (
              <button
                key={option.value}
                onClick={() => {
                  setFilter('sortBy', option.key)
                  setFilter('sortDirection', option.direction)
                  setIsOpen(false)
                }}
                className="w-full px-4 py-2 text-left hover:bg-slate-800/50
                          text-white/90 hover:text-white transition-colors"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Clear Filters */}
      {(filters.position || filters.minRating || filters.search) && (
        <button
          onClick={clearFilters}
          className="flex items-center space-x-2 px-4 py-2
                    bg-accent/20 text-accent rounded-lg
                    hover:bg-accent/30 transition-colors"
        >
          <X className="w-5 h-5" />
          <span>Clear</span>
        </button>
      )}
    </div>
  )
} 