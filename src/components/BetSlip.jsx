import { useState } from 'react'

export default function BetSlip({ userId, market, outcome, onPlaced }) {
  const [stake, setStake] = useState('100')
  const [loading, setLoading] = useState(false)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  if (!market || !outcome) return null
  const potential = ((parseFloat(stake || '0') || 0) * parseFloat(outcome.odds)).toFixed(2)

  const place = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/bets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, market_id: market.id, outcome_key: outcome.key, stake: parseFloat(stake) })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to place bet')
      onPlaced && onPlaced(data.id)
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed bottom-4 right-4 bg-white rounded-xl shadow-2xl w-full sm:w-80 p-4 border">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-800">Bet Slip</h4>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100">{market.game_type}</span>
      </div>
      <div className="mt-2">
        <p className="text-sm text-gray-600">{market.title}</p>
        <p className="text-sm"><span className="font-medium">Selection:</span> {outcome.label} @ {outcome.odds}</p>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2">
        <input value={stake} onChange={(e)=>setStake(e.target.value)} className="col-span-2 border rounded px-3 py-2" type="number" min="1" step="1"/>
        <button disabled={loading} onClick={place} className="bg-green-600 hover:bg-green-700 text-white rounded px-3 py-2">
          {loading ? 'Placing...' : 'Place'}
        </button>
      </div>
      <div className="mt-2 text-sm text-gray-600">Potential payout: <span className="font-semibold">₹{potential}</span></div>
    </div>
  )
}
