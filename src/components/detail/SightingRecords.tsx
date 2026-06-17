import { useState } from 'react'
import { Eye, Star, User, MapPin, Calendar, MessageCircleWarning } from 'lucide-react'
import type { Sighting } from '@/types/yokai'
import { SectionHeader } from './LegendTimeline'

interface Props {
  records: Sighting[]
}

export default function SightingRecords({ records }: Props) {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const sorted = [...records].sort((a, b) => {
    const parseDate = (s: string) => {
      const match = s.match(/(\d+)年/)
      return match ? parseInt(match[1]) : 0
    }
    return parseDate(b.date) - parseDate(a.date)
  })

  return (
    <section id="sighting" className="scroll-mt-8">
      <SectionHeader icon={<Eye className="w-5 h-5" />} title="目击记录"
                     subtitle="时人所见，真伪并存" />

      <div className="space-y-4">
        {sorted.length === 0 ? (
          <p className="text-sm font-serif text-silk-200/40 p-8 italic text-center
                        border border-dashed border-silk-200/10 rounded-sm">
            暂无人目击此妖之记录，或其踪迹难觅…
          </p>
        ) : (
          sorted.map((r) => {
            const expanded = expandedId === r.id
            return (
              <article
                key={r.id}
                className={`relative rounded-sm border overflow-hidden transition-all duration-300
                           ${r.isRumor
                             ? 'opacity-50 hover:opacity-80 backdrop-blur-[1px]'
                             : 'ink-border'}
                           bg-ink-800/50`}
                onClick={() => setExpandedId(expanded ? null : r.id)}
              >
                {r.isRumor && (
                  <div className="absolute top-4 right-4 z-10 flex items-center gap-1
                                  px-2 py-0.5 bg-ink-900/80 rounded-sm border border-silk-200/10">
                    <MessageCircleWarning className="w-3 h-3 text-silk-200/50" />
                    <span className="text-[10px] font-serif text-silk-200/50 tracking-wider">传闻</span>
                  </div>
                )}

                <div className="p-5 cursor-pointer">
                  <div className="flex flex-wrap items-start gap-x-6 gap-y-2 mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-serif text-bronze-400">
                      <Calendar className="w-3 h-3" />
                      {r.date}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-serif text-vermilion-500/80">
                      <MapPin className="w-3 h-3" />
                      {r.location}
                    </div>
                    <div className="flex items-center gap-1" title={`可信度 ${r.credibility}/5`}>
                      {[1, 2, 3, 4, 5].map((n) => (
                        <Star key={n}
                              className={`w-3 h-3 ${n <= r.credibility
                                                    ? 'text-silk-400 fill-silk-400'
                                                    : 'text-silk-200/15'}`} />
                      ))}
                    </div>
                  </div>

                  <p className={`font-serif text-silk-100/90 leading-relaxed transition-all
                                ${!expanded && !r.isRumor ? 'line-clamp-2' : ''}`}>
                    {r.content}
                  </p>

                  <div className={`grid transition-all duration-300 ease-out mt-4
                                  ${expanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}>
                    <div className="overflow-hidden">
                      <div className="pt-4 border-t border-silk-200/10 flex items-center gap-3 flex-wrap">
                        <div className="flex items-center gap-1.5 text-xs font-serif text-silk-200/50">
                          <User className="w-3 h-3" />
                          记录人：{r.witness}
                        </div>
                        <div className="text-[11px] font-serif text-silk-200/30">
                          {r.isRumor ? '此条来自民间传闻，未经证实' : '此条为当事人直接叙述'}
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="text-[11px] font-serif text-silk-200/40 mt-3 flex items-center gap-1">
                    点击{expanded ? '收起记录' : '展开详情'}
                    <span className="inline-block transition-transform"
                          style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0)' }}>
                      ▼
                    </span>
                  </p>
                </div>

                <div className={`absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b
                                ${r.isRumor
                                  ? 'from-silk-200/20 via-silk-200/5 to-transparent'
                                  : 'from-vermilion-500/60 via-vermilion-500/20 to-transparent'}`} />
              </article>
            )
          })
        )}
      </div>
    </section>
  )
}
