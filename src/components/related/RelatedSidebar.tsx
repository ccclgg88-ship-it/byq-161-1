import { useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Link2, ArrowUpRight } from 'lucide-react'
import { YOKAI_LIST } from '@/data/yokaiData'
import type { RelatedYokaiEntry } from '@/types/yokai'
import { useYokaiStore } from '@/store/useYokaiStore'

const relationColor: Record<string, string> = {
  '同特章': 'bg-bronze-500/15 text-bronze-400 border-bronze-500/30',
  '同地域': 'bg-vermilion-500/10 text-vermilion-500/90 border-vermilion-500/30',
  '传说交集': 'bg-silk-200/10 text-silk-300 border-silk-200/20',
}

interface Props {
  currentId: string
  relations: RelatedYokaiEntry[]
}

export default function RelatedSidebar({ currentId, relations }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const { catalogFilters } = useYokaiStore()

  const filtered = relations
    .filter((r) => r.relatedId !== currentId)
    .slice(0, 8)
    .map((r) => {
      const yokai = YOKAI_LIST.find((y) => y.id === r.relatedId)
      return yokai ? { ...r, yokai } : null
    })
    .filter(Boolean) as (RelatedYokaiEntry & { yokai: typeof YOKAI_LIST[number] })[]

  if (filtered.length === 0) return null

  const scroll = (dir: -1 | 1) => {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: dir * 320, behavior: 'smooth' })
  }

  const go = (id: string) => {
    navigate(`/yokai/${id}`, { state: { filters: catalogFilters } })
  }

  return (
    <aside className="w-full xl:fixed xl:right-0 xl:top-1/2 xl:-translate-y-1/2 xl:w-80 z-20 mt-16 xl:mt-0">
      <div className="relative xl:rounded-l-sm overflow-hidden bg-ink-800/70 backdrop-blur-md
                      border border-silk-200/10 xl:border-r-0
                      shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
        <div className="px-5 py-4 border-b border-silk-200/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-vermilion-500" />
            <h3 className="font-serif font-bold text-silk-100 tracking-wider">关联妖灵</h3>
          </div>
          <span className="text-[10px] font-serif text-silk-200/40">{filtered.length} 条</span>
        </div>

        <div className="hidden xl:block absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-10">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-full bg-ink-900 border border-silk-200/20
                       text-silk-200/60 hover:text-silk-100 hover:border-bronze-500/50
                       flex items-center justify-center backdrop-blur-sm transition-all
                       hover:scale-110"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>

        <div
          ref={scrollRef}
          className="flex xl:flex-col xl:max-h-[60vh] gap-3 p-4 overflow-x-auto xl:overflow-y-auto no-scrollbar"
        >
          {filtered.map((r) => (
            <button
              key={r.relatedId}
              onClick={() => go(r.yokai.id)}
              className="group shrink-0 xl:shrink w-[220px] xl:w-full text-left rounded-sm
                         border border-silk-200/10 bg-ink-900/50 overflow-hidden
                         hover:border-bronze-500/40 transition-all hover:-translate-y-0.5"
            >
              <div className="flex gap-3 p-3">
                <div className="shrink-0 w-14 h-20 rounded-sm overflow-hidden relative">
                  <img src={r.yokai.mainImage} alt={r.yokai.name}
                       className="w-full h-full object-cover transition-transform duration-500
                                  group-hover:scale-110" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1 mb-1">
                    <p className="font-serif font-bold text-silk-100 leading-tight">
                      {r.yokai.name}
                    </p>
                    <ArrowUpRight className="w-3 h-3 text-silk-200/30 shrink-0 mt-0.5
                                           group-hover:text-vermilion-500 transition-colors" />
                  </div>
                  <p className="text-[10px] italic text-silk-200/40 truncate font-serif mb-1.5">
                    {r.yokai.scientificName}
                  </p>
                  <span className={`inline-flex items-center px-1.5 py-0.5 rounded-sm border text-[10px] font-serif
                                   ${relationColor[r.relationType] || relationColor['传说交集']}`}>
                    {r.relationType}
                  </span>
                </div>
              </div>
              <div className="px-3 pb-3 flex items-center justify-between text-[10px] font-serif">
                <span className="text-bronze-400/70">{r.yokai.chapter}</span>
                <span className="text-silk-200/40">{r.yokai.region} · {r.yokai.dangerLevel}级</span>
              </div>
            </button>
          ))}
        </div>

        <div className="hidden xl:block absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-10">
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-full bg-ink-900 border border-silk-200/20
                       text-silk-200/60 hover:text-silk-100 hover:border-bronze-500/50
                       flex items-center justify-center backdrop-blur-sm transition-all
                       hover:scale-110"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex xl:hidden justify-center gap-2 px-4 pb-3">
          <button
            onClick={() => scroll(-1)}
            className="w-8 h-8 rounded-sm border border-silk-200/15 text-silk-200/60 flex items-center justify-center"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="w-8 h-8 rounded-sm border border-silk-200/15 text-silk-200/60 flex items-center justify-center"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}
