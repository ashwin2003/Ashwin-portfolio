import { useEffect, useState } from 'react'

export function useTypewriter(phrases, typingSpeed = 80, deletingSpeed = 45, pauseTime = 1800) {
  const [state, setState] = useState({
    text: '',
    phraseIndex: 0,
    isDeleting: false,
    isPaused: false,
  })

  useEffect(() => {
    const { text, phraseIndex, isDeleting, isPaused } = state
    const current = phrases[phraseIndex]

    if (isPaused) {
      const timer = setTimeout(
        () => setState(s => ({ ...s, isPaused: false, isDeleting: true })),
        pauseTime
      )
      return () => clearTimeout(timer)
    }

    const timer = setTimeout(() => {
      setState(s => {
        const { text, phraseIndex, isDeleting } = s
        const phrase = phrases[phraseIndex]

        if (!isDeleting) {
          if (text.length < phrase.length) return { ...s, text: phrase.slice(0, text.length + 1) }
          return { ...s, isPaused: true }
        }

        if (text.length > 0) return { ...s, text: text.slice(0, -1) }
        return { ...s, isDeleting: false, phraseIndex: (phraseIndex + 1) % phrases.length }
      })
    }, isDeleting ? deletingSpeed : typingSpeed)

    return () => clearTimeout(timer)
  }, [state, phrases, typingSpeed, deletingSpeed, pauseTime])

  return state.text
}
