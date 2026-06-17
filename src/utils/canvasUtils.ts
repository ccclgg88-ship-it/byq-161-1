import { ABILITY_KEYS } from '@/types/yokai'
import type { AbilityStats } from '@/types/yokai'

interface RadarOptions {
  size?: number
  padding?: number
  levels?: number
  lineColor?: string
  fillColor?: string
  pointColor?: string
  lostColor?: string
  textColor?: string
  glowColor?: string
}

export function drawRadarChart(
  ctx: CanvasRenderingContext2D,
  stats: AbilityStats,
  hoverIndex: number | null,
  options: RadarOptions = {}
) {
  const {
    size = 360,
    padding = 50,
    levels = 5,
    lineColor = 'rgba(122, 154, 139, 0.35)',
    fillColor = 'rgba(200, 50, 60, 0.15)',
    pointColor = '#c8323c',
    lostColor = 'rgba(74, 74, 64, 0.5)',
    textColor = '#f5e6c8',
    glowColor = 'rgba(122, 154, 139, 0.5)',
  } = options

  const cx = size / 2
  const cy = size / 2
  const radius = (size - padding * 2) / 2
  const angleStep = (Math.PI * 2) / ABILITY_KEYS.length
  const startAngle = -Math.PI / 2

  ctx.clearRect(0, 0, size, size)

  for (let l = 1; l <= levels; l++) {
    const r = (radius / levels) * l
    ctx.beginPath()
    for (let i = 0; i <= ABILITY_KEYS.length; i++) {
      const angle = startAngle + i * angleStep
      const x = cx + r * Math.cos(angle)
      const y = cy + r * Math.sin(angle)
      if (i === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.closePath()
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 1
    ctx.stroke()
  }

  for (let i = 0; i < ABILITY_KEYS.length; i++) {
    const angle = startAngle + i * angleStep
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    ctx.beginPath()
    ctx.moveTo(cx, cy)
    ctx.lineTo(x, y)
    ctx.strokeStyle = lineColor
    ctx.lineWidth = 1
    ctx.stroke()
  }

  const dataPoints: { x: number; y: number; value: number | null }[] = []
  ABILITY_KEYS.forEach((key, i) => {
    const angle = startAngle + i * angleStep
    const value = stats[key.key]
    const r = value !== null ? (value / 100) * radius : 0
    dataPoints.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
      value,
    })
  })

  ctx.beginPath()
  let started = false
  dataPoints.forEach((pt, i) => {
    if (pt.value === null) {
      started = false
      return
    }
    if (!started) {
      ctx.moveTo(pt.x, pt.y)
      started = true
    } else {
      ctx.lineTo(pt.x, pt.y)
    }
  })
  ctx.closePath()

  const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius)
  gradient.addColorStop(0, 'rgba(200, 50, 60, 0.35)')
  gradient.addColorStop(1, fillColor)
  ctx.fillStyle = gradient
  ctx.fill()

  ctx.strokeStyle = '#c8323c'
  ctx.lineWidth = 2
  ctx.stroke()

  dataPoints.forEach((pt, i) => {
    const angle = startAngle + i * angleStep
    const labelR = radius + 28
    const lx = cx + labelR * Math.cos(angle)
    const ly = cy + labelR * Math.sin(angle)

    if (pt.value !== null) {
      if (hoverIndex === i) {
        ctx.save()
        ctx.shadowColor = glowColor
        ctx.shadowBlur = 16
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2)
        ctx.fillStyle = '#fff'
        ctx.fill()
        ctx.strokeStyle = pointColor
        ctx.lineWidth = 3
        ctx.stroke()
        ctx.restore()
      } else {
        ctx.beginPath()
        ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2)
        ctx.fillStyle = pointColor
        ctx.fill()
      }
    }

    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    const keyInfo = ABILITY_KEYS[i]

    ctx.font = 'bold 14px "Noto Serif SC", serif'
    if (pt.value === null) {
      ctx.fillStyle = lostColor
    } else if (hoverIndex === i) {
      ctx.fillStyle = '#d9bc7e'
    } else {
      ctx.fillStyle = textColor
    }
    ctx.fillText(keyInfo.label, lx, ly)

    ctx.font = '11px "Noto Serif SC", serif'
    if (pt.value === null) {
      ctx.fillStyle = 'rgba(74, 74, 64, 0.7)'
      ctx.fillText('佚失', lx, ly + 16)
    } else {
      if (hoverIndex === i) {
        ctx.fillStyle = '#d9bc7e'
      } else {
        ctx.fillStyle = 'rgba(245, 230, 200, 0.55)'
      }
      ctx.fillText(String(pt.value), lx, ly + 16)
    }
  })

  return { cx, cy, radius, angleStep, startAngle, dataPoints }
}

export function detectHoveredAxis(
  mouseX: number,
  mouseY: number,
  cx: number,
  cy: number,
  radius: number,
  startAngle: number,
  angleStep: number
): number | null {
  const dx = mouseX - cx
  const dy = mouseY - cy
  const dist = Math.sqrt(dx * dx + dy * dy)
  if (dist > radius + 10) return null

  let angle = Math.atan2(dy, dx) - startAngle
  while (angle < 0) angle += Math.PI * 2
  while (angle >= Math.PI * 2) angle -= Math.PI * 2

  const normalized = angle / angleStep
  const idx = Math.round(normalized) % ABILITY_KEYS.length

  const axisAngle = startAngle + idx * angleStep
  const ax = cx + (radius + 20) * Math.cos(axisAngle)
  const ay = cy + (radius + 20) * Math.sin(axisAngle)
  const axisDist = Math.sqrt((mouseX - ax) ** 2 + (mouseY - ay) ** 2)

  if (axisDist < 40 || dist <= radius + 10) {
    return idx
  }
  return null
}
