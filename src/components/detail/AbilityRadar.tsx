import { useEffect, useRef, useState } from 'react'
import { Shield, Info } from 'lucide-react'
import { ABILITY_KEYS } from '@/types/yokai'
import type { AbilityStats } from '@/types/yokai'
import { drawRadarChart, detectHoveredAxis } from '@/utils/canvasUtils'
import { SectionHeader } from './LegendTimeline'

const SIZE = 380
const DPR = typeof window !== 'undefined' ? Math.min(window.devicePixelRatio || 1, 2) : 1

interface Props {
  stats: AbilityStats
}

export default function AbilityRadar({ stats }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const metaRef = useRef<any>(null)
  const [hoverIndex, setHoverIndex] = useState<number | null>(null)
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    canvas.width = SIZE * DPR
    canvas.height = SIZE * DPR
    canvas.style.width = `${SIZE}px`
    canvas.style.height = `${SIZE}px`
    ctx.scale(DPR, DPR)

    const meta = drawRadarChart(ctx, stats, hoverIndex)
    metaRef.current = meta
  }, [stats, hoverIndex])

  const handleMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const scale = SIZE / rect.width
    const mx = (e.clientX - rect.left) * scale
    const my = (e.clientY - rect.top) * scale

    const meta = metaRef.current
    if (!meta) return
    const idx = detectHoveredAxis(mx, my, meta.cx, meta.cy, meta.radius, meta.startAngle, meta.angleStep)

    setHoverIndex(idx)
    if (idx !== null) {
      const key = ABILITY_KEYS[idx]
      const v = stats[key.key]
      setTooltip({
        x: e.clientX - rect.left + 12,
        y: e.clientY - rect.top + 12,
        text: v === null ? `${key.label}：记载佚失` : `${key.label} ${v}/100｜${key.desc}`,
      })
    } else {
      setTooltip(null)
    }
  }

  const handleLeave = () => {
    setHoverIndex(null)
    setTooltip(null)
  }

  return (
    <section id="ability" className="scroll-mt-8">
      <SectionHeader icon={<Shield className="w-5 h-5" />} title="能力特质"
                     subtitle="五维量化，悬停可察释义" />

      <div className="grid grid-cols-1 xl:grid-cols-[minmax(380px,1fr)_1fr] gap-10 lg:gap-12 items-start">
        <div className="relative mx-auto w-full max-w-[380px] aspect-square">
          <div className="absolute inset-0 animate-ink-spread opacity-10
                          rounded-full bg-gradient-radial from-vermilion-500/40 to-transparent"
               style={{ background: 'radial-gradient(circle, rgba(200,50,60,0.25), transparent 70%)' }} />
          <canvas
            ref={canvasRef}
            onMouseMove={handleMove}
            onMouseLeave={handleLeave}
            className="relative z-10 w-full h-full"
            style={{ cursor: hoverIndex !== null ? 'help' : 'default' }}
          />
          {tooltip && (
            <div
              className="absolute z-20 pointer-events-none max-w-[240px]
                         bg-ink-900/95 backdrop-blur-sm border border-bronze-500/40 rounded-sm
                         px-3 py-2 text-xs font-serif text-silk-100 leading-relaxed"
              style={{ left: tooltip.x, top: tooltip.y }}
            >
              {tooltip.text}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {ABILITY_KEYS.map((key, i) => {
            const v = stats[key.key]
            const lost = v === null
            return (
              <div key={key.key}
                   onMouseEnter={() => setHoverIndex(i)}
                   onMouseLeave={() => setHoverIndex(null)}
                   className={`group p-4 rounded-sm border transition-all cursor-default
                              ${hoverIndex === i
                                ? 'bg-vermilion-500/8 border-vermilion-500/40'
                                : 'bg-ink-800/40 border-silk-200/10 hover:border-bronze-500/30'}`}>
                <div className="flex items-center justify-between mb-2.5">
                  <div className="flex items-center gap-2">
                    <Info className="w-3.5 h-3.5 text-bronze-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="font-serif font-bold text-silk-100 tracking-wide">{key.label}</span>
                  </div>
                  <span className={`text-sm font-serif font-bold
                                   ${lost ? 'text-silk-200/30 italic' : 'text-vermilion-500'}`}>
                    {lost ? '佚失' : `${v} / 100`}
                  </span>
                </div>
                <div className="h-1.5 bg-ink-900/70 rounded-sm overflow-hidden">
                  {!lost ? (
                    <div
                      className="h-full bg-gradient-to-r from-vermilion-700 via-vermilion-500 to-bronze-400
                                 rounded-sm transition-all duration-700 ease-out"
                      style={{ width: `${v}%` }}
                    />
                  ) : (
                    <div className="h-full bg-silk-200/10 rounded-sm flex items-center justify-center
                                    text-[9px] font-serif text-silk-200/30">记载散佚</div>
                  )}
                </div>
                <p className="text-[11px] font-serif text-silk-200/40 mt-2 leading-relaxed">
                  {key.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
