import { useEffect } from 'react'

export function useScrollRestoration(key: string) {
  useEffect(() => {
    const saved = sessionStorage.getItem(key)
    if (saved) {
      const pos = parseInt(saved, 10)
      requestAnimationFrame(() => {
        window.scrollTo({ top: pos, behavior: 'auto' })
      })
    }
    return () => {
      sessionStorage.setItem(key, String(window.scrollY))
    }
  }, [key])
}

export function saveScrollPosition(key: string) {
  sessionStorage.setItem(key, String(window.scrollY))
}

export function restoreScrollPosition(key: string) {
  const saved = sessionStorage.getItem(key)
  if (saved) {
    const pos = parseInt(saved, 10)
    requestAnimationFrame(() => {
      window.scrollTo({ top: pos, behavior: 'auto' })
    })
  }
}
