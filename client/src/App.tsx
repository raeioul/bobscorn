import { useState, useEffect } from 'react'
import { CooldownWatch } from './CooldownWatch'
import cornBg from './assets/product-corn.jpg'

function App() {
  const [cornCount, setCornCount] = useState(0)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [cooldown, setCooldown] = useState(0)

  // Timer effect
  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [cooldown])

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

      if (typeof data.cornCount === 'number') {
        setCornCount(data.cornCount)
      }

      if (response.ok) {
        setMessage('Successfully bought a corn! 🌽')
        setCooldown(60)
      } else if (response.status === 429) {
        setError('Too many requests! You can only buy 1 corn per minute.')
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
    <div
      className="min-h-screen w-full flex items-center justify-center p-4 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: `url(${cornBg})` }}
    >
      {/* Dark Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]"></div>

      <div className="relative z-10 bg-black/75 backdrop-blur-md rounded-3xl p-8 md:p-12 max-w-2xl w-full border border-white/10 shadow-2xl">
        <h1 className="text-4xl md:text-6xl font-black text-white italic mb-6 leading-tight">
          Bob's <span className="text-yellow-400">Sweet™</span> Sweet Corn delivered near you!
        </h1>

        <p className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed font-medium">
          At Bob's Farm, we deliver the freshest, highest quality corn to a site near you for local pick-up.
          Harvested daily, our farm-fresh corn offers superior flavor and nutrition with reliable, prompt delivery.
          Enjoy excellence in every ear with Bob's Sweet™ Sweet Corn.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button
            onClick={buyCorn}
            disabled={loading}
            type="button"
            className={`
              text-white bg-[#FF9119] hover:bg-[#FF9119]/90 focus:ring-4 focus:outline-none focus:ring-[#FF9119]/50 
              font-bold rounded-2xl text-lg px-6 py-3 text-center inline-flex items-center justify-center
              transition-all duration-300 transform active:scale-95 shadow-lg shadow-orange-500/20
              w-fit
              ${loading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <svg
              className="w-6 h-6 me-3 -ms-1 shrink-0"
              aria-hidden="true"
              focusable="false"
              fill="currentColor"
              viewBox="0 0 24 24"
              width="24"
              height="24"
            >
              <path d="M7 18c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zM1 2v2h2l3.6 7.59-1.35 2.45c-.16.28-.25.61-.25.96 0 1.1.9 2 2 2h12v-2H7.42c-.14 0-.25-.11-.25-.25l.03-.12.9-1.63h7.45c.75 0 1.41-.41 1.75-1.03l3.58-6.49c.08-.14.12-.31.12-.48 0-.55-.45-1-1-1H5.21l-.94-2H1zm16 16c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2z" />
            </svg>
            {loading ? 'Processing...' : 'Order your corn now'}
          </button>

          {cornCount > 0 && (
            <div className="flex flex-col items-center sm:items-start">
              <span className="text-yellow-400 text-4xl font-black">{cornCount}</span>
              <span className="text-white/60 text-xs uppercase tracking-widest font-bold">Corns Owned</span>
            </div>
          )}
        </div>

        {message && (
          <div className="mt-8 p-4 bg-green-500/20 border border-green-500/50 text-green-400 rounded-xl font-bold animate-pulse text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mt-8 p-4 bg-red-500/20 border border-red-500/50 text-red-400 rounded-xl font-bold text-center">
            {error}
          </div>
        )}

        {cooldown > 0 && (
          <div className="mt-6 flex justify-center sm:justify-start">
            <CooldownWatch remainingTime={cooldown} />
          </div>
        )}
      </div>
    </div>
  )
}

export default App
