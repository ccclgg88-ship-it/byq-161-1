import { Search, X } from 'lucide-react'
import { CHAPTERS, REGIONS } from '@/types/yokai'
import type { CatalogFilters, DangerLevel } from '@/types/yokai'
import { useYokaiStore } from '@/store/useYokaiStore'

const DANGER_LEVELS: { value: DangerLevel | null; label: string; color: string }[] = [
  { value: null, label: '不限', color: '' },
  { value: '丙', label: '丙·低危', color: 'border-bronze-500 text-bronze-400' },
  { value: '乙', label: '乙·中危', color: 'border-silk-300 text-silk-200' },
  { value: '甲', label: '甲·高危', color: 'border-vermilion-500 text-vermilion-500' },
  { value: '极', label: '极·灾厄', color: 'border-vermilion-700 text-vermilion-500 bg-vermilion-500/10' },
]

export default function FilterBar() {
  const { catalogFilters, setCatalogFilters, resetCatalogFilters } = useYokaiStore()

  return (
    <div className="sticky top-0 z-30 backdrop-blur-md bg-ink-900/85 border-b border-silk-200/10">
      <div className="max-w-7xl mx-auto px-6 py-5">
        <div className="flex flex-col lg:flex-row gap-5 items-start lg:items-center">
          <div className="relative flex-1 w-full max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-silk-200/40" />
            <input
              type="text"
              placeholder="搜录妖名、古籍、地域…"
              value={catalogFilters.searchQuery}
              onChange={(e) => setCatalogFilters({ searchQuery: e.target.value })}
              className="w-full pl-11 pr-10 py-3 bg-ink-800/70 border border-silk-200/10 rounded-sm
                       text-silk-100 placeholder:text-silk-200/30
                       focus:outline-none focus:border-bronze-500/50 transition-colors
                       font-serif text-sm"
            />
            {catalogFilters.searchQuery && (
              <button
                onClick={() => setCatalogFilters({ searchQuery: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-silk-200/40 hover:text-silk-200 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-silk-200/50 font-serif mr-1">特章</span>
            <select
              value={catalogFilters.chapter ?? ''}
              onChange={(e) => setCatalogFilters({ chapter: e.target.value || null })}
              className="bg-ink-800/70 border border-silk-200/10 text-silk-100 px-3 py-2 rounded-sm
                       text-sm font-serif focus:outline-none focus:border-bronze-500/50 cursor-pointer"
            >
              <option value="">不限</option>
              {CHAPTERS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            <span className="text-sm text-silk-200/50 font-serif mr-1">地域</span>
            <select
              value={catalogFilters.region ?? ''}
              onChange={(e) => setCatalogFilters({ region: e.target.value || null })}
              className="bg-ink-800/70 border border-silk-200/10 text-silk-100 px-3 py-2 rounded-sm
                       text-sm font-serif focus:outline-none focus:border-bronze-500/50 cursor-pointer"
            >
              <option value="">不限</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-wrap gap-2 items-center">
            {DANGER_LEVELS.map((lv) => {
              const active = catalogFilters.dangerLevel === lv.value
              return (
                <button
                  key={lv.label}
                  onClick={() => setCatalogFilters({ dangerLevel: lv.value })}
                  className={`px-3 py-1.5 text-xs font-serif rounded-sm border transition-all
                    ${active
                      ? `${lv.color || 'bg-bronze-500/20 border-bronze-500 text-bronze-400'}`
                      : 'border-silk-200/10 text-silk-200/50 hover:border-silk-200/30 hover:text-silk-200/80'
                    }`}
                >
                  {lv.label}
                </button>
              )
            })}
          </div>

          <button
            onClick={resetCatalogFilters}
            className="ml-auto px-4 py-2 text-xs font-serif text-silk-200/50
                     hover:text-vermilion-500 border border-silk-200/10 rounded-sm
                     hover:border-vermilion-500/40 transition-all"
          >
            重置
          </button>
        </div>
      </div>
    </div>
  )
}
