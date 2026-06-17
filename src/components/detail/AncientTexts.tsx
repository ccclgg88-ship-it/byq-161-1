import { useState } from 'react'
import { BookMarked, HelpCircle, Stamp, ChevronRight } from 'lucide-react'
import type { AncientText } from '@/types/yokai'
import { SectionHeader } from './LegendTimeline'

interface Props {
  texts: AncientText[]
}

export default function AncientTexts({ texts }: Props) {
  const [activeId, setActiveId] = useState<string | null>(texts[0]?.id ?? null)
  const active = texts.find((t) => t.id === activeId)

  return (
    <section id="ancient" className="scroll-mt-8">
      <SectionHeader icon={<BookMarked className="w-5 h-5" />} title="古籍原文"
                     subtitle="抄录典籍，明其源流" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <p className="text-[11px] font-serif text-silk-200/40 px-3 py-1 tracking-widest">典 籍 目 录</p>
          {texts.length === 0 ? (
            <p className="text-sm font-serif text-silk-200/40 p-4 italic">此妖于籍无征，待考…</p>
          ) : (
            texts.map((t) => {
              const isActive = activeId === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveId(t.id)}
                  className={`w-full text-left px-4 py-3 rounded-sm border transition-all flex items-center gap-3
                             ${isActive
                               ? 'bg-vermilion-500/10 border-vermilion-500/40'
                               : 'bg-ink-800/40 border-silk-200/10 hover:border-bronze-500/30'}`}
                >
                  <ChevronRight className={`w-3.5 h-3.5 shrink-0 transition-transform
                                          ${isActive ? 'text-vermilion-500 rotate-90' : 'text-silk-200/40'}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-serif font-bold truncate ${isActive ? 'text-silk-100' : 'text-silk-200/80'}`}>
                      {t.title}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      {t.sourceVerified ? (
                        <Stamp className="w-2.5 h-2.5 text-bronze-400" />
                      ) : (
                        <HelpCircle className="w-2.5 h-2.5 text-silk-200/30" />
                      )}
                      <span className={`text-[11px] font-serif truncate
                                       ${t.sourceVerified ? 'text-bronze-400' : 'text-silk-200/35 italic'}`}>
                        {t.source}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })
          )}
        </div>

        <div className="lg:col-span-2 relative">
          <div className="paper-texture rounded-sm border border-silk-300/20 min-h-[420px] relative overflow-hidden">
            <div
              className="absolute inset-0 pointer-events-none opacity-40"
              style={{
                backgroundImage: `
                  repeating-linear-gradient(90deg, transparent, transparent 48px, rgba(139,90,43,0.08) 48px, rgba(139,90,43,0.08) 49px)
                `,
              }}
            />

            {!active ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <p className="font-serif text-ink-700/50 italic">请择一卷而阅之…</p>
              </div>
            ) : (
              <>
                {!active.sourceVerified && (
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                                  pointer-events-none select-none rotate-[-15deg]
                                  border-4 border-ink-700/15 rounded-sm px-8 py-3 z-20">
                    <span className="font-serif font-black text-3xl text-ink-700/15 tracking-[0.4em]">
                      来源待考
                    </span>
                  </div>
                )}

                <div className="relative p-8 md:p-12">
                  <div className="text-center mb-6">
                    <h3 className="font-serif font-black text-2xl text-ink-800 tracking-[0.3em] mb-2">
                      {active.title}
                    </h3>
                    <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-sm border
                                    ${active.sourceVerified
                                      ? 'border-vermilion-500/60 text-vermilion-600/80'
                                      : 'border-ink-700/25 text-ink-700/50 italic'}`}>
                      {active.sourceVerified ? (
                        <Stamp className="w-3 h-3" />
                      ) : (
                        <HelpCircle className="w-3 h-3" />
                      )}
                      <span className="text-xs font-serif">{active.source}</span>
                    </div>
                  </div>

                  <div className="border-t border-b border-ink-700/20 py-6 my-6">
                    <p className="font-serif text-ink-900 text-lg md:text-xl leading-loose
                                 text-justify indent-[2em] font-kai">
                      {active.content}
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <div className="inline-block px-3 py-1 bg-vermilion-500/90 text-silk-100
                                    rounded-sm transform rotate-[-2deg] shadow-lg">
                      <span className="font-serif font-bold text-xs tracking-widest">
                        万 象 妖 典 · 录
                      </span>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
