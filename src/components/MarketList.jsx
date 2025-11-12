import { useEffect, useState } from 'react'

export default function MarketList({ onBet }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const load = async (type) => {
    setLoading(true)
    try {
      const url = type ? `${baseUrl}/api/markets?game_type=${type}` : `${baseUrl}/api/markets`
      const res = await fetch(url)
      const data = await res.json()
      setItems(data.items || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{ load() },[])

  return (
    <div className="bg-white rounded-xl shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-800">Open Markets</h3>
        <div className="flex gap-2 text-sm">
          <button onClick={()=>load()} className="px-3 py-1 rounded bg-gray-100">All</button>
          <button onClick={()=>load('cricket')} className="px-3 py-1 rounded bg-gray-100">Cricket</button>
          <button onClick={()=>load('matka')} className="px-3 py-1 rounded bg-gray-100">Matka</button>
        </div>
      </div>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">No markets yet.</p>
      ) : (
        <ul className="space-y-3">
          {items.map((m) => (
            <li key={m.id} className="border rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm uppercase tracking-wide text-gray-500">{m.game_type}</p>
                  <h4 className="font-semibold text-gray-900">{m.title}</h4>
                </div>
                <div className="text-xs text-gray-500">{m.start_time ? new Date(m.start_time).toLocaleString() : 'Live'}</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-3">
                {m.outcomes?.map((o) => (
                  <button key={o.key} onClick={()=>onBet(m, o)} className="border rounded px-3 py-2 hover:bg-blue-50 flex items-center justify-between">
                    <span>{o.label}</span>
                    <span className="font-semibold">{o.odds.toFixed ? o.odds.toFixed(2) : o.odds}</span>
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
