import { useState } from 'react'
import { CooldownWatch } from './CooldownWatch'

function App() {
  const [cornCount, setCornCount] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Timer effect
  if (cooldown > 0) {
    setTimeout(() => setCooldown(cooldown - 1), 1000)
  }

  // Generate a random client ID for this session if not exists
  const getClientId = () => {
    let id = localStorage.getItem('clientId')
    if (!id) {
      id = 'client-' + Math.random().toString(36).substr(2, 9)
      localStorage.setItem('clientId', id)
    }
    return id
  }

  const buyCorn = async () => {
    // We allow clicking even if cooldown is active to let the server respond with 429
    // But we don't want to spam local state updates if it's just client-side prevention.
    // The user wants to "see the return of the server", so we proceed.

    setLoading(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch('/api/buy-corn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Client-ID': getClientId()
        }
      })

      const data = await response.json()

      // Always update corn count from server if available
      if (typeof data.cornCount === 'number') {
        setCornCount(data.cornCount)
      }

      if (response.ok) {
        setMessage('Successfully bought a corn! 🌽')
        // Start client-side countdown as a fallback/visual aid
        setCooldown(60)
      } else if (response.status === 429) {
        setError('Too many requests! You can only buy 1 corn per minute.')

        // Sync cooldown with server's remaining time
        if (data.retryAfter) {
          const secondsLeft = Math.ceil(data.retryAfter / 1000)
          setCooldown(secondsLeft)
        }
      } else {
        setError('Something went wrong.')
      }
    } catch (err) {
      console.error(err)
      setError('Failed to connect to the server.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-orange-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center transition-all hover:scale-105 duration-300">
        <h1 className="text-4xl font-bold text-yellow-600 mb-2">Bob's Corn 🌽</h1>
        <p className="text-gray-500 mb-8">Premium Corn for Premium Clients</p>

        <div className="mb-8">
          <div className="text-6xl font-black text-gray-800 mb-2">{cornCount}</div>
          <div className="text-gray-400 uppercase tracking-widest text-sm font-semibold">Corns Owned</div>
        </div>

        {message && (
          <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg animate-pulse">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {cooldown > 0 && (
          <div className="mb-4">
            <CooldownWatch remainingTime={cooldown} />
          </div>
        )}

        <button
          onClick={buyCorn}
          disabled={loading}
          className={`
            w-full py-4 px-6 rounded-xl text-white font-bold text-lg shadow-lg
            transform transition-all duration-200
            ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 hover:-translate-y-1 active:scale-95 shadow-orange-500/30'
            }
          `}
        >
          {loading ? 'Processing...' : 'Buy Corn 🌽'}
        </button>

        <p className="mt-6 text-xs text-gray-400">
          * Terms: Limit 1 corn per minute per client.
        </p>
      </div>
    </div>
  )
}

export default App
