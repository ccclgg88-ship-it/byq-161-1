import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Scroll, ArrowUp } from 'lucide-react'
import SideInfoBar from '@/components/layout/SideInfoBar'
import LegendTimeline from '@/components/detail/LegendTimeline'
import AbilityRadar from '@/components/detail/AbilityRadar'
import HabitatMap from '@/components/detail/HabitatMap'
import AncientTexts from '@/components/detail/AncientTexts'
import SightingRecords from '@/components/detail/SightingRecords'
import HighResViewer from '@/components/viewer/HighResViewer'
import RelatedSidebar from '@/components/related/RelatedSidebar'
import {
  YOKAI_LIST,
  ORIGIN_RECORDS,
  ABILITY_STATS_LIST,
  ANCIENT_TEXTS,
  SIGHTING_LIST,
  RELATED_MAP,
} from '@/data/yokaiData'

export default function YokaiDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [viewerOpen, setViewerOpen] = useState(false)
  const [savedScroll, setSavedScroll] = useState(0)
  const [showTop, setShowTop] = useState(false)

  const yokai = YOKAI_LIST.find((y) => y.id === id)

  useEffect(() => {
    if (!yokai) return
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [id, yokai])

  useEffect(() => {
    const handler = () => setShowTop(window.scrollY > 600)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  if (!yokai) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4 px-6">
          <div className="w-20 h-20 mx-auto border-2 border-dashed border-silk-200/20 rounded-full
                          flex items-center justify-center">
            <Scroll className="w-8 h-8 text-silk-200/30" />
          </div>
          <p className="font-serif text-xl text-silk-200/60">此妖未曾录入妖典…</p>
          <button
            onClick={() => navigate('/')}
            className="px-5 py-2 text-sm font-serif text-vermilion-500
                       border border-vermilion-500/40 rounded-sm
                       hover:bg-vermilion-500/10 transition-all"
          >
            返回名录
          </button>
        </div>
      </div>
    )
  }

  const originRecords = ORIGIN_RECORDS.filter((r) => r.yokaiId === yokai.id)
  const abilityStats = ABILITY_STATS_LIST.find((s) => s.yokaiId === yokai.id) || {
    yokaiId: yokai.id,
    strength: null, trickery: null, stealth: null, spirituality: null, malevolence: null,
  }
  const ancientTexts = ANCIENT_TEXTS.filter((t) => t.yokaiId === yokai.id)
  const sightings = SIGHTING_LIST.filter((s) => s.yokaiId === yokai.id)
  const relations = RELATED_MAP[yokai.id] || []

  const openViewer = () => {
    setSavedScroll(window.scrollY)
    setViewerOpen(true)
  }
  const closeViewer = () => {
    setViewerOpen(false)
    requestAnimationFrame(() => window.scrollTo({ top: savedScroll, behavior: 'auto' }))
  }

  return (
    <div className="min-h-screen relative">
      <div
        aria-hidden
        className="fixed inset-0 pointer-events-none opacity-50"
        style={{
          backgroundImage: `
            radial-gradient(ellipse 70% 40% at 30% 0%, rgba(92, 122, 107, 0.12), transparent 60%),
            radial-gradient(ellipse 50% 40% at 100% 50%, rgba(200, 50, 60, 0.06), transparent 60%),
            radial-gradient(ellipse 60% 40% at 0% 100%, rgba(217, 188, 126, 0.05), transparent 60%)
          `,
        }}
      />

      <div className="relative z-10">
        <div className="h-1 bg-gradient-to-r from-transparent via-vermilion-500/40 to-transparent" />
        <div className="relative overflow-hidden border-b border-silk-200/10 bg-ink-900/50">
          <div className="absolute inset-0 scroll-paper opacity-70" />
          <div
            className="absolute inset-0 animate-fog-drift pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(ellipse 100% 50% at 50% 0%, rgba(245,230,200,0.05), transparent 70%)',
            }}
          />
          <div className="max-w-7xl mx-auto px-6 py-5 relative z-10">
            <div className="flex items-center gap-3 text-xs font-serif text-silk-200/40 tracking-widest">
              <span className="px-2 py-0.5 border border-vermilion-500/30 text-vermilion-500/80 rounded-sm">
                妖灵档案
              </span>
              <span>·</span>
              <span>No.{String(YOKAI_LIST.findIndex((y) => y.id === yokai.id) + 1).padStart(3, '0')}</span>
              <span>·</span>
              <span>{yokai.chapter}</span>
            </div>
          </div>
        </div>

        <main className="max-w-7xl mx-auto px-6 py-10 xl:pr-96 2xl:pr-[28rem]">
          <div className="flex flex-col xl:flex-row gap-10">
            <SideInfoBar yokai={yokai} onImageClick={openViewer} />

            <div className="flex-1 min-w-0 space-y-20 animate-scroll-unfold overflow-hidden">
              <section className="space-y-5">
                <div className="xl:hidden aspect-[3/4] rounded-sm ink-border overflow-hidden cursor-pointer"
                     onClick={openViewer}>
                  <img src={yokai.mainImage} alt={yokai.name} className="w-full h-full object-cover" />
                </div>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-sm
                                border border-silk-200/15 bg-ink-800/50 text-xs font-serif">
                  <span className="text-silk-200/50">档案提要</span>
                </div>
                <p className="text-lg md:text-xl font-serif text-silk-100/90 leading-loose text-justify indent-[2em]">
                  {yokai.description}
                </p>
              </section>

              <LegendTimeline records={originRecords} />

              <AbilityRadar stats={abilityStats} />

              <HabitatMap yokai={yokai} />

              <AncientTexts texts={ancientTexts} />

              <SightingRecords records={sightings} />

              <div className="xl:hidden">
                <RelatedSidebar currentId={yokai.id} relations={relations} />
              </div>

              <footer className="pt-10 pb-20 border-t border-silk-200/10">
                <div className="text-center">
                  <div className="inline-flex items-center gap-3 px-6 py-3 rounded-sm
                                  border border-vermilion-500/25 bg-vermilion-500/5">
                    <div className="w-8 h-8 rounded-sm vermilion-stamp flex items-center justify-center
                                    font-black transform rotate-[-6deg]">
                      典
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-serif text-vermilion-500/80 tracking-widest">万 象 妖 典</p>
                      <p className="text-[11px] font-serif text-silk-200/40 mt-0.5">
                        此卷所载，真伪参半，读之者慎思之
                      </p>
                    </div>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </main>

        <div className="hidden xl:block">
          <div className="max-w-7xl mx-auto relative">
            <div className="absolute right-0 top-[5vh] w-80">
              <RelatedSidebar currentId={yokai.id} relations={relations} />
            </div>
          </div>
        </div>
      </div>

      <HighResViewer
        lowResSrc={yokai.mainImage}
        highResSrc={yokai.highResImage}
        yokaiName={yokai.name}
        open={viewerOpen}
        onClose={closeViewer}
      />

      <button
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        className={`fixed bottom-6 left-6 z-40 w-11 h-11 rounded-sm
                    border border-silk-200/15 bg-ink-900/90 backdrop-blur-sm
                    flex items-center justify-center text-silk-200/60 hover:text-vermilion-500
                    hover:border-vermilion-500/40 transition-all
                    ${showTop ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        aria-label="回到顶部"
      >
        <ArrowUp className="w-4 h-4" />
      </button>
    </div>
  )
}
