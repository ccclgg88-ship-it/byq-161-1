import { useEffect, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import { Scroll, Sparkles } from 'lucide-react'
import FilterBar from '@/components/catalog/FilterBar'
import YokaiCard from '@/components/catalog/YokaiCard'
import { YOKAI_LIST } from '@/data/yokaiData'
import { useYokaiStore } from '@/store/useYokaiStore'
import { restoreScrollPosition } from '@/hooks/useScrollPosition'

export default function CatalogPage() {
  const { catalogFilters, setCatalogFilters } = useYokaiStore()
  const location = useLocation() as ReturnType<typeof useLocation> & {
    state?: { filters?: typeof catalogFilters; scrollPos?: number }
  }

  useEffect(() => {
    if (location.state?.filters) {
      setCatalogFilters(location.state.filters)
    }
    if (typeof location.state?.scrollPos === 'number') {
      requestAnimationFrame(() => {
        window.scrollTo({ top: location.state!.scrollPos!, behavior: 'auto' })
      })
    } else {
      restoreScrollPosition('catalog')
    }
    const handler = () => sessionStorage.setItem('catalog', String(window.scrollY))
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [location.state, setCatalogFilters])

  const filtered = useMemo(() => {
    const q = catalogFilters.searchQuery.trim().toLowerCase()
    return YOKAI_LIST.filter((y) => {
      if (catalogFilters.chapter && y.chapter !== catalogFilters.chapter) return false
      if (catalogFilters.region && y.region !== catalogFilters.region) return false
      if (catalogFilters.dangerLevel && y.dangerLevel !== catalogFilters.dangerLevel) return false
      if (q) {
        return (
          y.name.toLowerCase().includes(q) ||
          y.scientificName.toLowerCase().includes(q) ||
          y.region.toLowerCase().includes(q) ||
          y.chapter.toLowerCase().includes(q) ||
          y.description.toLowerCase().includes(q)
        )
      }
      return true
    })
  }, [catalogFilters])

  return (
    <div className="min-h-screen relative">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 80% 50% at 20% 0%, rgba(92, 122, 107, 0.15), transparent 60%),
            radial-gradient(ellipse 60% 40% at 80% 100%, rgba(200, 50, 60, 0.08), transparent 60%)
          `,
        }}
      />

      <header className="relative border-b border-silk-200/10 overflow-hidden">
        <div className="absolute inset-0 scroll-paper" />
        <div className="max-w-7xl mx-auto px-6 py-14 md:py-20 relative z-10">
          <div className="flex items-start justify-between gap-8 flex-wrap">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-px h-8 bg-gradient-to-b from-vermilion-500 to-transparent" />
                <span className="text-xs tracking-[0.3em] text-vermilion-500/90 font-serif uppercase">
                  Youkai Archives · Vol. One
                </span>
              </div>
              <h1 className="font-serif font-black text-5xl md:text-7xl text-silk-100 tracking-wider mb-4">
                <span className="text-vermilion-500">万</span>象
                <span className="mx-3 text-bronze-400 text-4xl md:text-5xl">妖</span>典
              </h1>
              <p className="font-serif text-silk-200/60 max-w-xl leading-relaxed text-sm md:text-base">
                搜山检海，辑录百鬼。自《山海经》而至《百鬼夜行》，
                凡千年间之妖灵异闻，尽在此卷。翻页之际，与千妖万魅共赴幽明。
              </p>
            </div>
            <div className="flex items-center gap-2 text-bronze-400/80 font-serif text-sm border border-bronze-500/30 rounded-sm px-4 py-2 bg-bronze-500/5">
              <Scroll className="w-4 h-4" />
              <span>收录 <b className="text-silk-100">{YOKAI_LIST.length}</b> 妖，文献 <b className="text-silk-100">24</b> 部</span>
              <Sparkles className="w-3.5 h-3.5 ml-1 text-vermilion-500" />
            </div>
          </div>
        </div>
      </header>

      <FilterBar />

      <main className="max-w-7xl mx-auto px-6 py-10 relative z-10">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-vermilion-500 rounded-sm" />
            <h2 className="text-xl font-serif font-bold text-silk-100 tracking-wider">妖灵名录</h2>
            <span className="text-xs text-silk-200/40 font-serif">
              （{filtered.length} 条）
            </span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-24 text-center border border-dashed border-silk-200/10 rounded-sm">
            <p className="text-silk-200/50 font-serif">未寻得此录，或可异名求之，或此妖尚隐于山野之间…</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((y, i) => (
              <YokaiCard key={y.id} yokai={y} index={i} />
            ))}
          </div>
        )}
      </main>

      <footer className="border-t border-silk-200/10 py-10 mt-20">
        <div className="max-w-7xl mx-auto px-6 text-center text-xs text-silk-200/30 font-serif">
          万象妖典 · 妖灵档案室 · 此卷所载，或真或幻，读者自辨
        </div>
      </footer>
    </div>
  )
}
