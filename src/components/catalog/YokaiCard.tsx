import { MapPin, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { Yokai } from '@/types/yokai'
import { useYokaiStore } from '@/store/useYokaiStore'

const dangerClass: Record<string, string> = {
  '丙': 'text-bronze-400 border-bronze-500/50 bg-bronze-500/10',
  '乙': 'text-silk-300 border-silk-300/50 bg-silk-300/10',
  '甲': 'text-vermilion-500 border-vermilion-500/60 bg-vermilion-500/15',
  '极': 'text-vermilion-500 border-vermilion-700 bg-vermilion-500/20 shadow-[0_0_16px_rgba(200,50,60,0.25)]',
}

interface Props {
  yokai: Yokai
  index: number
}

export default function YokaiCard({ yokai, index }: Props) {
  const { catalogFilters, setCatalogScrollPosition } = useYokaiStore()

  const handleClick = () => {
    setCatalogScrollPosition(window.scrollY)
  }

  return (
    <Link
      to={`/yokai/${yokai.id}`}
      onClick={handleClick}
      state={{ filters: catalogFilters, scrollPos: window.scrollY }}
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
      className="group relative overflow-hidden rounded-sm ink-border
                 bg-ink-800/60 backdrop-blur-sm
                 transition-all duration-500 hover:-translate-y-1
                 animate-fade-up opacity-0"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={yokai.mainImage}
          alt={yokai.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-ink-900 via-ink-900/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 animate-fog-drift pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(ellipse at center bottom, rgba(245,230,200,0.06), transparent 70%)'
          }}
        />

        <div className="absolute top-3 right-3 z-10">
          <span className={`inline-flex items-center justify-center w-9 h-9 rounded-sm
                           border-2 font-serif font-black text-sm vermilion-stamp
                           transform rotate-3 group-hover:rotate-0 transition-transform duration-300
                           ${dangerClass[yokai.dangerLevel] || ''}`}>
            {yokai.dangerLevel}
          </span>
        </div>

        <div className="absolute bottom-0 inset-x-0 p-4 z-10">
          <div className="flex items-baseline gap-2 mb-1">
            <h3 className="text-2xl font-serif font-black text-silk-100 text-shadow-ink tracking-wider">
              {yokai.name}
            </h3>
            <span className="text-[10px] font-serif italic text-silk-200/50 truncate max-w-[120px]">
              {yokai.scientificName}
            </span>
          </div>
          <p className="text-xs text-silk-200/70 font-serif line-clamp-2 leading-relaxed">
            {yokai.description}
          </p>
        </div>
      </div>

      <div className="p-4 pt-3 border-t border-silk-200/10 flex items-center justify-between gap-3">
        <div className="flex items-center gap-1 text-[11px] text-bronze-400 font-serif">
          <BookOpen className="w-3 h-3" />
          <span>{yokai.chapter}</span>
        </div>
        <div className="flex items-center gap-1 text-[11px] text-silk-200/60 font-serif">
          <MapPin className="w-3 h-3" />
          <span>{yokai.region}</span>
        </div>
      </div>
    </Link>
  )
}
