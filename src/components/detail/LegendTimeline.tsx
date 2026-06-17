import { useMemo, useState } from 'react'
import { ScrollText, Clock, FileText } from 'lucide-react'
import type { OriginRecord } from '@/types/yokai'

interface Props {
  records: OriginRecord[]
}

export default function LegendTimeline({ records }: Props) {
  const [activeId, setActiveId] = useState<string | null>(records[0]?.id ?? null)

  const sorted = useMemo(() => {
    return [...records].sort((a, b) => a.yearOrder - b.yearOrder)
  }, [records])

  return (
    <section id="origin" className="scroll-mt-8">
      <SectionHeader icon={<ScrollText className="w-5 h-5" />} title="传说起源"
                     subtitle="溯源千年，一卷展开" />

      <div className="relative pl-6 md:pl-10 space-y-0">
        <div className="absolute left-2 md:left-4 top-2 bottom-2 w-px
                        bg-gradient-to-b from-bronze-500/40 via-silk-200/20 to-transparent" />

        {sorted.map((rec, i) => {
          const active = activeId === rec.id
          return (
            <div key={rec.id} className="relative pb-10 group">
              <button
                onClick={() => setActiveId(active ? null : rec.id)}
                className={`absolute -left-4 md:-left-6 top-1.5 w-5 h-5 rounded-full
                           border-2 transition-all duration-300 z-10 flex items-center justify-center
                           ${rec.yearUnknown
                             ? 'border-silk-200/40 bg-ink-800'
                             : active
                               ? 'bg-vermilion-500 border-vermilion-500 scale-110 bronze-glow'
                               : 'bg-ink-800 border-bronze-500/60 group-hover:border-vermilion-500/70'}`}
              >
                {active && !rec.yearUnknown && (
                  <span className="w-1.5 h-1.5 rounded-full bg-silk-100" />
                )}
              </button>

              <div
                className={`transition-all duration-500 rounded-sm overflow-hidden
                           ${active ? 'bg-ink-800/60 ink-border' : 'hover:bg-ink-800/30'}`}
              >
                <div className="px-5 py-4 flex flex-col md:flex-row md:items-start gap-3 md:gap-6">
                  <div className="shrink-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Clock className="w-3.5 h-3.5 text-bronze-400" />
                      <span className={`font-serif font-bold text-lg tracking-wide
                                       ${rec.yearUnknown ? 'text-silk-200/50 italic' : 'text-bronze-400'}`}>
                        {rec.dynasty}
                        {rec.yearUnknown && '（年代不详）'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-serif text-silk-200/50">
                      <FileText className="w-3 h-3" />
                      {rec.source}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-serif text-silk-100/90 leading-relaxed mb-2">
                      {rec.vernacular}
                    </p>

                    <div className={`grid transition-all duration-500 ease-out
                                    ${active ? 'grid-rows-[1fr] opacity-100 mt-3' : 'grid-rows-[0fr] opacity-0'}`}>
                      <div className="overflow-hidden">
                        <div className="border-l-2 border-vermilion-500/30 pl-4 py-1 bg-ink-900/50 rounded-r-sm">
                          <p className="text-[13px] font-serif text-silk-300/80 leading-loose font-kai italic">
                            「{rec.originalText}」
                          </p>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setActiveId(active ? null : rec.id); }}
                      className="text-[11px] font-serif text-silk-200/40 mt-2 flex items-center gap-1
                                 hover:text-silk-200/70 transition-colors cursor-pointer"
                    >
                      {active ? '点击收起原文' : '点击展开文献原文'}
                      <span className="inline-block">
                        {active ? '▲' : '▼'}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export function SectionHeader({
  icon, title, subtitle,
}: { icon: React.ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="mb-8 flex items-end justify-between gap-4 flex-wrap">
      <div>
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-sm border border-vermilion-500/40 bg-vermilion-500/5
                          flex items-center justify-center text-vermilion-500">
            {icon}
          </div>
          <h2 className="font-serif font-black text-3xl tracking-wider text-silk-100">
            {title}
          </h2>
          <div className="h-px flex-1 min-w-[40px] bg-gradient-to-r from-silk-200/20 to-transparent" />
        </div>
        {subtitle && (
          <p className="pl-11 text-sm font-serif text-silk-200/50 tracking-wide">{subtitle}</p>
        )}
      </div>
    </div>
  )
}
