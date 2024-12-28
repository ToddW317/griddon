import React from 'react'
import { Coins, ArrowRight, Calculator } from 'lucide-react'
import { useGameStore } from '../../store/gameStore'
import { RecruitmentNumber } from '../ui/RecruitmentNumber'

const CONVERSION_RATE = 0.8 // 80% conversion rate

interface ConversionOptionProps {
  trainingAmount: number
  recruitmentAmount: number
}

function ConversionOption({ trainingAmount, recruitmentAmount }: ConversionOptionProps) {
  const { trainingPoints, convertTrainingToRecruitment } = useGameStore()

  return (
    <button
      onClick={() => convertTrainingToRecruitment(trainingAmount)}
      disabled={trainingPoints < trainingAmount}
      className="flex items-center justify-between p-4
                bg-slate-800/50 rounded-lg border border-slate-700/50
                hover:bg-slate-800/80 transition-colors
                disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <div className="flex items-center space-x-4">
        <div className="text-white/90">
          <RecruitmentNumber value={trainingAmount} />
          <div className="text-sm text-white/70">Training</div>
        </div>
        <ArrowRight className="w-5 h-5 text-white/50" />
        <div className="text-accent">
          <RecruitmentNumber value={recruitmentAmount} />
          <div className="text-sm text-accent/70">Recruitment</div>
        </div>
      </div>
    </button>
  )
}

function CustomConversion() {
  const { trainingPoints, convertTrainingToRecruitment } = useGameStore()
  const [amount, setAmount] = React.useState('')

  const handleConvert = () => {
    const numAmount = parseInt(amount)
    if (!isNaN(numAmount) && numAmount > 0) {
      convertTrainingToRecruitment(numAmount)
      setAmount('')
    }
  }

  const calculatedRecruitment = React.useMemo(() => {
    const numAmount = parseInt(amount)
    if (isNaN(numAmount) || numAmount <= 0) return 0
    return Math.floor(numAmount * CONVERSION_RATE)
  }, [amount])

  return (
    <div className="flex flex-col p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
      <div className="flex items-center space-x-2 mb-2">
        <Calculator className="w-5 h-5 text-white/70" />
        <span className="text-white/90 font-bold">Custom Amount</span>
      </div>
      <div className="flex space-x-2">
        <input
          type="number"
          min="1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="flex-1 px-3 py-1 bg-slate-700/50 rounded-lg
                    text-white border border-slate-600/50
                    focus:outline-none focus:border-accent/50"
        />
        <button
          onClick={handleConvert}
          disabled={!amount || trainingPoints < parseInt(amount)}
          className="px-3 py-1 bg-accent/20 text-accent rounded-lg
                    hover:bg-accent/30 transition-colors
                    disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Convert
        </button>
      </div>
      {amount && (
        <div className="mt-2 text-sm">
          <span className="text-white/70">You'll receive: </span>
          <RecruitmentNumber value={calculatedRecruitment} />
        </div>
      )}
    </div>
  )
}

export default function PointsShop() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-accent">Points Shop</h2>
          <p className="text-white/70">Convert training points to recruitment points</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <ConversionOption trainingAmount={100} recruitmentAmount={80} />
        <ConversionOption trainingAmount={500} recruitmentAmount={400} />
        <ConversionOption trainingAmount={1000} recruitmentAmount={800} />
        <CustomConversion />
      </div>
    </div>
  )
} 