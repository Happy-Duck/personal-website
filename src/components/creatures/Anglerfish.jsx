// ── Anglerfish — Midnight Zone (0.32 → 0.65) ─────────────────────────
// Round, menacing, mostly idle. Pulsing lure.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 90, H = 68
const DEPTH_RANGE = { enter: 0.33, exit: 0.62 }

export function Anglerfish() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x: null, y: null,
    t: 0,
    fleeX: 0, fleeY: 0,
    fleeing: false,
  })

  useEffect(() => {
    const unsubscribe = subscribe((depth) => {
      const opacity = creatureOpacity(depth, DEPTH_RANGE)
      const el = wrapperRef.current
      if (!el) return

      if (opacity < 0.01) { el.style.opacity = '0'; return }

      const VW = window.innerWidth
      const VH = window.innerHeight
      const p = s.current

      if (p.x === null) {
        p.x = 0.35 * VW
        p.y = 0.52 * VH
      }

      // Very slow drift
      p.t++
      const targetX = VW * 0.35 + Math.sin(p.t * 0.003) * 120
      const targetY = VH * 0.52 + Math.sin(p.t * 0.005) * 60

      // Slow flee — large creature, not skittish
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 210 : 150

      if (dist < 150 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 2.0
        p.fleeY += (dy / dist) * 2.0
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.97; p.fleeY *= 0.97

      p.x += (targetX - p.x) * 0.008
      p.y += (targetY - p.y) * 0.008

      const nx = Math.max(W / 2, Math.min(VW - W / 2, p.x + p.fleeX))
      const ny = Math.max(20, Math.min(VH - 20, p.y + p.fleeY))

      el.style.transform = `translate(${nx - W / 2}px, ${ny - H / 2}px)`
      el.style.opacity   = opacity.toFixed(3)
    })

    return unsubscribe
  }, [subscribe])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <img src="/creatures/Anglerfish.webp" alt="" width={W} height={H} style={{ display: 'block' }} draggable={false} />
    </div>
  )
}
