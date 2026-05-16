import { useState, useEffect } from 'react'

// Binance combined-stream WebSocket — no API key, genuinely real-time
const SYMBOLS = ['btcusdt', 'ethusdt', 'solusdt', 'bnbusdt', 'xrpusdt']

function fmt(n) {
  if (n >= 10000) return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
  if (n >= 1000)  return n.toLocaleString('en-US', { maximumFractionDigits: 1 })
  if (n >= 100)   return n.toFixed(2)
  if (n >= 1)     return n.toFixed(3)
  return n.toFixed(5)
}

export function useLivePrices() {
  const [live, setLive] = useState({})

  useEffect(() => {
    const streams = SYMBOLS.map(s => `${s}@miniTicker`).join('/')
    const ws = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)

    ws.onmessage = e => {
      try {
        const { data } = JSON.parse(e.data)
        const price = parseFloat(data.c)
        const open  = parseFloat(data.o)
        const pct   = ((price - open) / open) * 100

        setLive(prev => ({
          ...prev,
          [data.s.toLowerCase()]: {
            price: `$${fmt(price)}`,
            chg:   `${pct >= 0 ? '+' : ''}${pct.toFixed(2)}%`,
            up:    pct >= 0,
            live:  true,
          },
        }))
      } catch { /* ignore malformed frames */ }
    }

    // Reconnect once on unexpected close
    ws.onclose = e => {
      if (!e.wasClean) {
        const retry = new WebSocket(`wss://stream.binance.com:9443/stream?streams=${streams}`)
        retry.onmessage = ws.onmessage
      }
    }

    return () => ws.close()
  }, [])

  return live
}
