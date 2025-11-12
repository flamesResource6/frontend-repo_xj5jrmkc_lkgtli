import { useEffect, useState } from 'react'

export default function Header({ userId }) {
  const [now, setNow] = useState(new Date())
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])
  return (
    <header className="w-full flex items-center justify-between py-4">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg" />
        <div>
          <h1 className="text-xl font-bold text-gray-900">Cricket & Matka Hub</h1>
          <p className="text-xs text-gray-500">Fun odds. Fast bets. Simple.</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="hidden sm:block text-gray-600 font-mono">
          {now.toLocaleTimeString()}
        </div>
        <div className="px-3 py-1 rounded-full bg-gray-100 text-gray-700 font-mono">
          User: {userId ? userId.slice(-6) : 'guest'}
        </div>
      </div>
    </header>
  )
}
