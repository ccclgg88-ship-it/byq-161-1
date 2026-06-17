import { useEffect, useState, useCallback } from 'react'
import { X, ZoomIn, ZoomOut, Maximize2, RotateCcw, Loader2, Monitor, Smartphone } from 'lucide-react'
import { useImageZoom } from '@/hooks/useImageZoom'

interface Props {
  lowResSrc: string
  highResSrc: string
  yokaiName: string
  open: boolean
  onClose: () => void
}

export default function HighResViewer({ lowResSrc, highResSrc, yokaiName, open, onClose }: Props) {
  const [useHighRes, setUseHighRes] = useState(false)
  const [highResLoaded, setHighResLoaded] = useState(false)
  const [isLoadedScale, setIsLoadedScale] = useState(false)

  const handleScaleChange = useCallback((s: number) => {
    if (s >= 2 && !useHighRes) {
      setUseHighRes(true)
    }
    if (s === 1) {
      setIsLoadedScale(false)
    } else if (s >= 1.2 && !isLoadedScale) {
      setIsLoadedScale(true)
    }
  }, [useHighRes, isLoadedScale])

  const { containerRef, state, reset, setScale, maxScale, minScale, isMobile } =
    useImageZoom({ onScaleChange: handleScaleChange })

  useEffect(() => {
    if (!open) return
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setScale(Math.min(state.scale * 1.25, maxScale))
      if (e.key === '-') setScale(Math.max(state.scale / 1.25, minScale))
      if (e.key === '0') reset()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, state.scale, setScale, reset, maxScale, minScale])

  useEffect(() => {
    if (!open) {
      setUseHighRes(false)
      setHighResLoaded(false)
      setIsLoadedScale(false)
      reset()
    }
  }, [open, reset])

  useEffect(() => {
    if (useHighRes) {
      const img = new Image()
      img.onload = () => setHighResLoaded(true)
      img.src = highResSrc
    }
  }, [useHighRes, highResSrc])

  if (!open) return null

  const pct = Math.round(state.scale * 100)

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/96 backdrop-blur-sm animate-fade-up"
      onClick={onClose}
    >
      <div
        className="absolute top-0 inset-x-0 h-32 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(180deg, rgba(0,0,0,0.8), transparent)' }}
      />
      <div
        className="absolute bottom-0 inset-x-0 h-40 z-10 pointer-events-none"
        style={{ background: 'linear-gradient(0deg, rgba(0,0,0,0.85), transparent)' }}
      />

      <div className="absolute top-5 left-5 z-20 flex items-center gap-4 pointer-events-none">
        <div>
          <p className="text-[11px] font-serif text-silk-200/50 tracking-widest">8K 鉴 赏 模 式</p>
          <h2 className="font-serif font-black text-2xl text-silk-100 mt-1 tracking-wider">
            {yokaiName}
          </h2>
        </div>
      </div>

      <div className="absolute top-5 right-5 z-20 flex items-center gap-2">
        <div className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-sm
                        border border-silk-200/10 bg-ink-900/50 text-xs font-serif">
          {isMobile ? <Smartphone className="w-3 h-3 text-silk-200/50" /> : <Monitor className="w-3 h-3 text-silk-200/50" />}
          <span className="text-silk-200/50">缩放上限</span>
          <b className="text-bronze-400">{maxScale}×</b>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 flex items-center justify-center rounded-sm
                     border border-silk-200/20 bg-ink-900/80 text-silk-100/80
                     hover:border-vermilion-500/50 hover:text-vermilion-500 transition-all"
          aria-label="关闭鉴赏模式"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div
        ref={containerRef}
        onClick={(e) => e.stopPropagation()}
        className="absolute inset-0 overflow-hidden select-none"
        style={{ cursor: state.scale > 1 ? (isMobile ? 'grab' : 'move') : 'zoom-in' }}
      >
        <img
          src={lowResSrc}
          alt={yokaiName}
          draggable={false}
          className="absolute left-1/2 top-1/2 max-w-[85vw] max-h-[82vh] w-auto h-auto object-contain
                     transition-opacity duration-500"
          style={{
            transformOrigin: 'center center',
            transform: `translate(-50%, -50%) translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`,
            opacity: useHighRes && highResLoaded ? 0 : 1,
          }}
        />
        {useHighRes && (
          <img
            src={highResSrc}
            alt={`${yokaiName} 高清母版`}
            draggable={false}
            onLoad={() => {}}
            className="absolute left-1/2 top-1/2 max-w-[85vw] max-h-[82vh] w-auto h-auto object-contain
                       transition-opacity duration-700"
            style={{
              transformOrigin: 'center center',
              transform: `translate(-50%, -50%) translate(${state.translateX}px, ${state.translateY}px) scale(${state.scale})`,
              opacity: highResLoaded ? 1 : 0,
              willChange: 'transform',
            }}
          />
        )}
      </div>

      {useHighRes && !highResLoaded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none">
          <div className="flex flex-col items-center gap-3 bg-ink-900/90 border border-bronze-500/40
                          rounded-sm px-6 py-4 backdrop-blur-sm">
            <Loader2 className="w-6 h-6 text-vermilion-500 animate-spin" />
            <p className="text-sm font-serif text-silk-100">正在加载 8K 高清母版切片…</p>
          </div>
        </div>
      )}

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-xl px-4">
        <div className="bg-ink-900/90 border border-silk-200/15 rounded-sm px-5 py-3
                        backdrop-blur-sm flex items-center gap-4">
          <button
            onClick={() => setScale(Math.max(state.scale / 1.25, minScale))}
            className="w-9 h-9 flex items-center justify-center rounded-sm border border-silk-200/15
                       text-silk-200/70 hover:text-silk-100 hover:border-bronze-500/40 transition-all shrink-0"
            aria-label="缩小"
          >
            <ZoomOut className="w-4 h-4" />
          </button>

          <div className="flex-1 space-y-1.5">
            <div className="flex items-center justify-between text-[11px] font-serif">
              <span className="text-silk-200/40">{Math.round(minScale * 100)}%</span>
              <span className={`font-bold tracking-wider ${state.scale >= 2 ? 'text-vermilion-500' : 'text-bronze-400'}`}>
                {pct}%
                {state.scale >= 2 && <span className="ml-2 text-[10px] normal-case">· 8K 母版已激活</span>}
              </span>
              <span className="text-silk-200/40">{Math.round(maxScale * 100)}%</span>
            </div>
            <div className="h-1 bg-ink-800 rounded-sm overflow-hidden">
              <div
                className={`h-full rounded-sm transition-all duration-150
                           ${state.scale >= 2
                             ? 'bg-gradient-to-r from-vermilion-600 via-vermilion-500 to-bronze-400'
                             : 'bg-gradient-to-r from-bronze-600 to-bronze-400'}`}
                style={{ width: `${((state.scale - minScale) / (maxScale - minScale)) * 100}%` }}
              />
            </div>
            <div className="h-px w-px absolute" />
            {maxScale >= 4 && (
              <div className="relative h-0">
                <div className="absolute -top-[5px] w-px h-2 bg-vermilion-500/60"
                     style={{ left: `${((2 - minScale) / (maxScale - minScale)) * 100}%` }} />
              </div>
            )}
          </div>

          <button
            onClick={() => setScale(Math.min(state.scale * 1.25, maxScale))}
            className="w-9 h-9 flex items-center justify-center rounded-sm border border-silk-200/15
                       text-silk-200/70 hover:text-silk-100 hover:border-bronze-500/40 transition-all shrink-0"
            aria-label="放大"
          >
            <ZoomIn className="w-4 h-4" />
          </button>

          <div className="w-px h-6 bg-silk-200/10 shrink-0" />

          <button
            onClick={reset}
            className="w-9 h-9 flex items-center justify-center rounded-sm border border-silk-200/15
                       text-silk-200/70 hover:text-silk-100 hover:border-vermilion-500/40 transition-all shrink-0"
            aria-label="重置"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setScale(isMobile ? 2 : 4)}
            className="w-9 h-9 flex items-center justify-center rounded-sm border border-silk-200/15
                       text-silk-200/70 hover:text-silk-100 hover:border-bronze-500/40 transition-all shrink-0"
            aria-label="全屏"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>

        <p className="text-center text-[11px] font-serif text-silk-200/35 mt-3 tracking-wide">
          {isMobile
            ? '双指捏合缩放 · 单指拖拽 · 点击遮罩或点右上角按钮关闭'
            : '滚轮缩放（按住 Ctrl 精细缩放）· 拖拽平移 · ESC 关闭 · + / - / 0 快捷键'}
        </p>
      </div>
    </div>
  )
}
