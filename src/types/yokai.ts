export type DangerLevel = '丙' | '乙' | '甲' | '极'

export interface Yokai {
  id: string
  name: string
  scientificName: string
  chapter: string
  region: string
  dangerLevel: DangerLevel
  description: string
  mainImage: string
  highResImage: string
  habitat: string
  activeTime: string
}

export interface OriginRecord {
  id: string
  yokaiId: string
  dynasty: string
  source: string
  yearOrder: number
  yearUnknown: boolean
  originalText: string
  vernacular: string
}

export interface AbilityStats {
  yokaiId: string
  strength: number | null
  trickery: number | null
  stealth: number | null
  spirituality: number | null
  malevolence: number | null
}

export interface AncientText {
  id: string
  yokaiId: string
  title: string
  content: string
  source: string
  sourceVerified: boolean
}

export interface Sighting {
  id: string
  yokaiId: string
  date: string
  location: string
  credibility: number
  content: string
  isRumor: boolean
  witness: string
}

export interface RelatedYokaiEntry {
  relatedId: string
  relationType: '同特章' | '同地域' | '传说交集'
}

export interface CatalogFilters {
  chapter: string | null
  region: string | null
  dangerLevel: DangerLevel | null
  searchQuery: string
}

export const ABILITY_KEYS = [
  { key: 'strength' as const, label: '力量', desc: '物理破坏与蛮力强度' },
  { key: 'trickery' as const, label: '诡术', desc: '幻术、计谋与迷惑能力' },
  { key: 'stealth' as const, label: '隐匿', desc: '隐藏形迹与躲避侦测' },
  { key: 'spirituality' as const, label: '灵性', desc: '灵力、神通与悟性' },
  { key: 'malevolence' as const, label: '凶煞', desc: '恶意、杀伤性与灾祸倾向' },
] as const

export const CHAPTERS = [
  '山精篇', '水魅篇', '火灵篇', '风异篇', '木怪篇',
  '畜妖篇', '器物篇', '怨灵篇', '神使篇', '异兽篇',
] as const

export const REGIONS = [
  '中原', '江南', '巴蜀', '岭南', '关东',
  '西域', '塞北', '滇南', '东瀛', '高丽',
] as const
