import { useEffect, useRef, useState, useCallback } from 'react'

interface UseImageZoomOptions {
  minScale?: number
  maxScaleDesktop?: number
  maxScaleMobile?: number
  onScaleChange?: (scale: number) => void
}

interface ZoomState {
  scale: number
  translateX: number
  translateY: number
}

export function useImageZoom(options: UseImageZoomOptions = {}) {
  const {
    minScale = 0.5,
    maxScaleDesktop = 4,
    maxScaleMobile = 2,
    onScaleChange,
  } = options

  const containerRef = useRef<HTMLDivElement>(null)
  const [state, setState] = useState<ZoomState>({ scale: 1, translateX: 0, translateY: 0 })
  const dragStart = useRef<{ x: number; y: number; tx: number; ty: number } | null>(null)
  const pinchStart = useRef<{ distance: number; scale: number } | null>(null)
  const isMobile = typeof window !== 'undefined' && 'ontouchstart' in window
  const maxScale = isMobile ? maxScaleMobile : maxScaleDesktop

  const getDistance = (t1: Touch, t2: Touch) => {
    const dx = t1.clientX - t2.clientX
    const dy = t1.clientY - t2.clientY
    return Math.sqrt(dx * dx + dy * dy)
  }

  const clampState = useCallback(
    (next: ZoomState): ZoomState => {
      let scale = Math.max(minScale, Math.min(maxScale, next.scale))
      if (scale < 1) {
        return { scale, translateX: 0, translateY: 0 }
      }
      return { scale, translateX: next.translateX, translateY: next.translateY }
    },
    [minScale, maxScale]
  )

  useEffect(() => {
    onScaleChange?.(state.scale)
  }, [state.scale, onScaleChange])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.ctrlKey ? -e.deltaY * 0.01 : -e.deltaY * 0.002
      setState((prev) => clampState({ ...prev, scale: prev.scale * (1 + delta) }))
    }

    const handleMouseDown = (e: MouseEvent) => {
      if (state.scale <= 1) return
      dragStart.current = {
        x: e.clientX,
        y: e.clientY,
        tx: state.translateX,
        ty: state.translateY,
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStart.current) return
      setState((prev) => ({
        ...prev,
        translateX: dragStart.current!.tx + (e.clientX - dragStart.current!.x),
        translateY: dragStart.current!.ty + (e.clientY - dragStart.current!.y),
      }))
    }

    const handleMouseUp = () => {
      dragStart.current = null
    }

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        pinchStart.current = {
          distance: getDistance(e.touches[0], e.touches[1]),
          scale: state.scale,
        }
      } else if (e.touches.length === 1 && state.scale > 1) {
        dragStart.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          tx: state.translateX,
          ty: state.translateY,
        }
      }
    }

    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      if (e.touches.length === 2 && pinchStart.current) {
        const newDist = getDistance(e.touches[0], e.touches[1])
        const ratio = newDist / pinchStart.current.distance
        setState((prev) => clampState({ ...prev, scale: pinchStart.current!.scale * ratio }))
      } else if (e.touches.length === 1 && dragStart.current) {
        setState((prev) => ({
          ...prev,
          translateX: dragStart.current!.tx + (e.touches[0].clientX - dragStart.current!.x),
          translateY: dragStart.current!.ty + (e.touches[0].clientY - dragStart.current!.y),
        }))
      }
    }

    const handleTouchEnd = () => {
      pinchStart.current = null
      dragStart.current = null
    }

    el.addEventListener('wheel', handleWheel, { passive: false })
    el.addEventListener('mousedown', handleMouseDown)
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    el.addEventListener('touchstart', handleTouchStart, { passive: false })
    el.addEventListener('touchmove', handleTouchMove, { passive: false })
    el.addEventListener('touchend', handleTouchEnd)
    el.addEventListener('touchcancel', handleTouchEnd)

    return () => {
      el.removeEventListener('wheel', handleWheel)
      el.removeEventListener('mousedown', handleMouseDown)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
      el.removeEventListener('touchstart', handleTouchStart)
      el.removeEventListener('touchmove', handleTouchMove)
      el.removeEventListener('touchend', handleTouchEnd)
      el.removeEventListener('touchcancel', handleTouchEnd)
    }
  }, [state.scale, clampState])

  const reset = useCallback(() => {
    setState({ scale: 1, translateX: 0, translateY: 0 })
  }, [])

  const setScale = useCallback(
    (s: number) => {
      setState((prev) => clampState({ ...prev, scale: s }))
    },
    [clampState]
  )

  return { containerRef, state, reset, setScale, maxScale, minScale, isMobile }
}
