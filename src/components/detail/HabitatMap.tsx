import { MapPin, Mountain, Clock, TreeDeciduous, Waves, Flame } from 'lucide-react'
import type { Yokai } from '@/types/yokai'
import { SectionHeader } from './LegendTimeline'

interface Props {
  yokai: Yokai
  relatedRegions?: string[]
}

const terrainIcons: Record<string, React.ReactNode> = {
  '青丘之山': <Mountain className="w-4 h-4" />,
  '朝阳之谷': <Waves className="w-4 h-4" />,
  '水': <Waves className="w-4 h-4" />,
  '山': <Mountain className="w-4 h-4" />,
  '林': <TreeDeciduous className="w-4 h-4" />,
  '火': <Flame className="w-4 h-4" />,
}

export default function HabitatMap({ yokai }: Props) {
  const habitats = yokai.habitat.split(/[、，,]/).filter(Boolean)

  return (
    <section id="habitat" className="scroll-mt-8">
      <SectionHeader icon={<MapPin className="w-5 h-5" />} title="出没地域"
                     subtitle="稽考行踪，明其栖息" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-ink-800/50 border border-silk-200/10 rounded-sm overflow-hidden relative">
          <div className="aspect-[2/1] relative">
            <div className="absolute inset-0 scroll-paper opacity-60" />
            <svg viewBox="0 0 800 400" className="absolute inset-0 w-full h-full">
              <defs>
                <radialGradient id="regionGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="rgba(200,50,60,0.4)" />
                  <stop offset="70%" stopColor="rgba(92,122,107,0.1)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="ink-rough">
                  <feTurbulence type="fractalNoise" baseFrequency="0.02" numOctaves="3" />
                  <feDisplacementMap in="SourceGraphic" scale="3" />
                </filter>
              </defs>

              <path d="M50 300 Q150 250 200 280 T380 260 Q500 240 600 290 T780 250 L780 400 L50 400 Z"
                    fill="rgba(92,122,107,0.08)" stroke="rgba(122,154,139,0.25)" strokeWidth="1" filter="url(#ink-rough)" />
              <path d="M100 180 Q220 150 320 190 T550 170 Q650 150 750 190"
                    fill="none" stroke="rgba(200,50,60,0.15)" strokeWidth="1.5" strokeDasharray="4 8" filter="url(#ink-rough)" />

              {[
                { x: 220, y: 220, label: yokai.region, main: true },
                { x: 450, y: 280, label: habitats[0] || '' },
                { x: 620, y: 190, label: habitats[1] || '' },
                { x: 330, y: 150, label: habitats[2] || '' },
              ].filter((p) => p.label).map((p, i) => (
                <g key={i}>
                  <circle cx={p.x} cy={p.y} r="60" fill="url(#regionGlow)" opacity={p.main ? 1 : 0.6} />
                  <circle cx={p.x} cy={p.y} r={p.main ? 7 : 5}
                          fill={p.main ? '#c8323c' : '#5c7a6b'}
                          stroke="#f5e6c8" strokeWidth="1.5"
                          style={{ filter: `drop-shadow(0 0 8px ${p.main ? 'rgba(200,50,60,0.6)' : 'rgba(92,122,107,0.5)'})` }}>
                    <animate attributeName="r"
                             values={`${p.main ? 7 : 5};${p.main ? 11 : 8};${p.main ? 7 : 5}`}
                             dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <text x={p.x} y={p.y + 24} textAnchor="middle"
                        fill={p.main ? '#f5e6c8' : 'rgba(245,230,200,0.6)'}
                        fontSize="13" fontFamily='"Noto Serif SC", serif'
                        fontWeight={p.main ? '700' : '400'}>
                    {p.label}
                  </text>
                </g>
              ))}

              <path d="M220 220 Q330 180 450 280 Q530 235 620 190"
                    fill="none" stroke="rgba(217,188,126,0.3)" strokeWidth="1" strokeDasharray="2 6" />
            </svg>
          </div>
          <div className="px-5 py-3 border-t border-silk-200/10 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-serif text-silk-200/60">
              <MapPin className="w-3 h-3 text-vermilion-500" />
              <span>主要出没区域</span>
            </div>
            <span className="font-serif font-bold text-silk-100 text-sm">{yokai.region}</span>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-ink-800/50 border border-silk-200/10 rounded-sm p-5">
            <div className="flex items-center gap-2 text-xs text-bronze-400 font-serif mb-3 tracking-wider">
              <Mountain className="w-3.5 h-3.5" /> 栖息之地
            </div>
            <div className="flex flex-wrap gap-2">
              {habitats.map((h, i) => (
                <span key={i}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm
                                 bg-bronze-500/10 border border-bronze-500/30
                                 text-sm font-serif text-bronze-400">
                  {terrainIcons[h] || <Mountain className="w-3 h-3" />}
                  {h}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-ink-800/50 border border-silk-200/10 rounded-sm p-5">
            <div className="flex items-center gap-2 text-xs text-vermilion-500 font-serif mb-3 tracking-wider">
              <Clock className="w-3.5 h-3.5" /> 活跃时辰
            </div>
            <p className="font-serif text-silk-100 leading-relaxed text-sm">
              {yokai.activeTime}
            </p>
          </div>

          <div className="bg-gradient-to-br from-vermilion-500/10 to-transparent
                          border border-vermilion-500/20 rounded-sm p-5">
            <p className="text-xs font-serif text-vermilion-500/80 mb-2 tracking-wider">⚠ 遇妖应对</p>
            <p className="text-xs font-serif text-silk-200/70 leading-relaxed">
              遇此妖于活跃时辰，当闭气屏息，徐行而退，勿直视其目，勿呼其名。
              若携雄黄、朱砂、桃木之属，或可避之。
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
