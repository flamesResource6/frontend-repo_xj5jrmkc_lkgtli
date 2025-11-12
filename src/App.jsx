import { useEffect, useState } from 'react'
import Header from './components/Header'
import CreateMarket from './components/CreateMarket'
import MarketList from './components/MarketList'
import BetSlip from './components/BetSlip'

function App() {
  const [userId, setUserId] = useState(null)
  const [selected, setSelected] = useState({ market: null, outcome: null })
  const [refreshKey, setRefreshKey] = useState(0)

  // Create a quick user on first load (demo purpose)
  useEffect(() => {
    const ensureUser = async () => {
      let id = localStorage.getItem('demo_user_id')
      const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
      if (!id) {
        const res = await fetch(`${baseUrl}/api/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: `player_${Math.floor(Math.random()*10000)}` })
        })
        const data = await res.json()
        if (res.ok) {
          id = data.id
          localStorage.setItem('demo_user_id', id)
        }
      }
      setUserId(id)
    }
    ensureUser()
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4">
        <Header userId={userId} />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
          <div className="md:col-span-2 space-y-4">
            <MarketList key={refreshKey} onBet={(market, outcome)=> setSelected({ market, outcome })} />
          </div>
          <div className="space-y-4">
            <CreateMarket onCreated={()=> setRefreshKey(k=>k+1)} />
            <div className="bg-white rounded-xl shadow p-4">
              <h3 className="font-semibold text-gray-800 mb-2">How it works</h3>
              <ul className="text-sm text-gray-600 list-disc pl-5 space-y-1">
                <li>Create markets for cricket, matka or others.</li>
                <li>Select an outcome to add it to your bet slip.</li>
                <li>Enter stake and place the bet.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <BetSlip userId={userId} market={selected.market} outcome={selected.outcome} onPlaced={()=>{ setSelected({market:null, outcome:null}); alert('Bet placed!'); }} />
    </div>
  )
}

export default App
