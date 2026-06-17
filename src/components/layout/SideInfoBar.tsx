import { useEffect, useState } from 'react'
import { ArrowLeft, MapPin, BookOpen, AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import type { Yokai } from '@/types/yokai'
import { useYokaiStore } from '@/store/useYokaiStore'

const dangerConfig: Record<string, { label: string; cls: string; desc: string }> = {
  '丙': { label: '丙级·低危', cls: 'text-bronze-400 border-bronze-500 bg-bronze-500/10', desc: '偶见踪迹，无伤大雅' },
  '乙': { label: '乙级·中危', cls: 'text-silk-200 border-silk-300 bg-silk-300/10', desc: '时有所闻，宜慎接触' },
  '甲': { label: '甲级·高危', cls: 'text-vermilion-500 border-vermilion-500 bg-vermilion-500/10', desc: '凶名在外，切勿轻犯' },
  '极': { label: '极级·灾厄', cls: 'text-vermilion-500 border-vermilion-700 bg-vermilion-500/20 shadow-[0_0_24px_rgba(200,50,60,0.3)]', desc: '乱世妖魁，倾国之患' },
}

interface Props {
  yokai: Yokai
  onImageClick: () => void
}

const SECTIONS = [
  { id: 'origin', label: '传说起源' },
  { id: 'ability', label: '能力特质' },
  { id: 'habitat', label: '出没地域' },
  { id: 'ancient', label: '古籍原文' },
  { id: 'sighting', label: '目击记录' },
]

export default function SideInfoBar({ yokai, onImageClick }: Props) {
  const navigate = useNavigate()
  const { catalogFilters } = useYokaiStore()
  const [activeSection, setActiveSection] = useState('origin')
  const danger = dangerConfig[yokai.dangerLevel] || dangerConfig['丙']

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveSection(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px', threshold: 0 }
    )
    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleBack = () => {
    navigate('/', { state: { filters: catalogFilters } })
  }

  return (
    <aside className="w-full xl:w-80 2xl:w-96 shrink-0 space-y-6">
      <div className="sticky top-6 space-y-5">
        <button
          onClick={handleBack}
          className="flex items-center gap-2 text-sm text-silk-200/60 font-serif
                     hover:text-vermilion-500 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          返回妖灵名录
        </button>

        <div className="relative aspect-[3/4] overflow-hidden rounded-sm ink-border group cursor-pointer"
             onClick={onImageClick}>
          <img src={yokai.mainImage} alt={yokai.name}
               className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/20 to-transparent" />
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity
                          flex items-center justify-center bg-ink-900/50 backdrop-blur-sm">
            <div className="text-center">
              <p className="font-serif text-silk-100 mb-1">点击鉴赏</p>
              <p className="text-xs text-silk-200/60 font-serif">8K 高清母版</p>
            </div>
          </div>
          <div className="absolute top-3 right-3">
            <div className={`w-12 h-12 flex items-center justify-center rounded-sm border-2 transform rotate-6
                            font-black text-xl font-serif vermilion-stamp ${danger.cls}`}>
              {yokai.dangerLevel}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <h1 className="font-serif font-black text-4xl text-silk-100 tracking-wider mb-1">
              {yokai.name}
            </h1>
            <p className="text-xs italic text-silk-200/50 font-serif tracking-wide">
              {yokai.scientificName}
            </p>
          </div>

          <div className={`px-4 py-3 rounded-sm border ${danger.cls} space-y-1`}>
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="text-xs font-bold font-serif tracking-wider">{danger.label}</span>
            </div>
            <p className="text-[11px] font-serif opacity-80">{danger.desc}</p>
          </div>

          <div className="space-y-2.5 pt-2 border-t border-silk-200/10">
            <div className="flex items-center gap-3 text-sm font-serif">
              <BookOpen className="w-4 h-4 text-bronze-400 shrink-0" />
              <span className="text-silk-200/50 shrink-0 w-12">所属</span>
              <span className="text-silk-100">{yokai.chapter}</span>
            </div>
            <div className="flex items-center gap-3 text-sm font-serif">
              <MapPin className="w-4 h-4 text-vermilion-500/80 shrink-0" />
              <span className="text-silk-200/50 shrink-0 w-12">地域</span>
              <span className="text-silk-100">{yokai.region}</span>
            </div>
          </div>
        </div>

        <div className="hidden xl:block pt-4 border-t border-silk-200/10">
          <p className="text-[11px] font-serif text-silk-200/40 mb-3 tracking-widest">章 节 导 引</p>
          <nav className="space-y-1">
            {SECTIONS.map((s) => {
              const active = activeSection === s.id
              return (
                <a key={s.id} href={`#${s.id}`}
                   className={`flex items-center gap-3 px-3 py-2 rounded-sm text-sm font-serif transition-all
                              ${active
                                ? 'bg-vermilion-500/10 text-vermilion-500'
                                : 'text-silk-200/60 hover:text-silk-100 hover:bg-silk-200/5'}`}>
                  <span className={`w-1.5 h-1.5 rounded-full transition-all
                                   ${active ? 'bg-vermilion-500 scale-125' : 'bg-silk-200/30'}`} />
                  {s.label}
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </aside>
  )
}
