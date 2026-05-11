import { useState, useEffect, useRef } from 'react'

export function useCountUp(target, { duration = 2000, decimals = 0, triggered = false } = {}) {
  const [count, setCount] = useState(0)
  const hasStarted = useRef(false)
  const rafRef = useRef(null)

  useEffect(() => {
    if (!triggered || hasStarted.current) return
    hasStarted.current = true

    const startTime = performance.now()

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1)
      // ease-out cubic for a snappy finish
      const eased = 1 - (1 - progress) ** 3
      setCount(parseFloat((target * eased).toFixed(decimals)))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [triggered, target, duration, decimals])

  return count
}
