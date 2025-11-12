import { useState } from 'react'

const defaultOutcomes = (type) => {
  if (type === 'cricket') {
    return [
      { key: 'team_a', label: 'Team A to Win', odds: 1.85 },
      { key: 'team_b', label: 'Team B to Win', odds: 1.95 },
    ]
  }
  if (type === 'matka') {
    return [
      { key: 'single', label: 'Single (0-9)', odds: 8.5 },
      { key: 'jodi', label: 'Jodi (00-99)', odds: 85 },
    ]
  }
  return [
    { key: 'yes', label: 'Yes', odds: 1.9 },
    { key: 'no', label: 'No', odds: 1.9 },
  ]
}

export default function CreateMarket({ onCreated }) {
  const [title, setTitle] = useState('')
  const [gameType, setGameType] = useState('cricket')
  const [outcomes, setOutcomes] = useState(defaultOutcomes('cricket'))
  const [loading, setLoading] = useState(false)

  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch(`${baseUrl}/api/markets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ game_type: gameType, title, outcomes }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Failed to create')
      onCreated && onCreated(data.id)
      setTitle('')
    } catch (e) {
      alert(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="bg-white rounded-xl shadow p-4 space-y-3">
      <h3 className="font-semibold text-gray-800">Create Market</h3>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <select value={gameType} onChange={(e) => { setGameType(e.target.value); setOutcomes(defaultOutcomes(e.target.value)) }} className="border rounded px-3 py-2">
          <option value="cricket">Cricket</option>
          <option value="matka">Matka</option>
          <option value="other">Other</option>
        </select>
        <input value={title} onChange={(e)=>setTitle(e.target.value)} placeholder="Match or Market title" className="border rounded px-3 py-2" />
        <button disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white rounded px-4 py-2">
          {loading ? 'Creating...' : 'Create'}
        </button>
      </div>
      <div className="text-xs text-gray-500">Preset outcomes will be used based on game type.</div>
    </form>
  )
}
