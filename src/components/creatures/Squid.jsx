// ── Squid — Twilight Zone (0.18 → 0.45) ──────────────────────────────
// Darting bursts followed by slow glides. Bioluminescent dots.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 40, H = 55
const DEPTH_RANGE = { enter: 0.15, exit: 0.37 }

export function Squid() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x: null, y: null,
    pathRawX: 0,
    t: 0,
    fleeX: 0, fleeY: 0,
    fleeing: false,
    dartPhase: 0,       // 0 = glide, 1 = dart
    dartTimer: 0,
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
        p.x       = Math.random() * VW
        p.y       = 0.40 * VH
        p.pathRawX = p.x
      }

      // Dart / glide cycle
      p.dartTimer++
      if (p.dartTimer > 120 && p.dartPhase === 0) { p.dartPhase = 1; p.dartTimer = 0 }
      if (p.dartTimer > 25  && p.dartPhase === 1) { p.dartPhase = 0; p.dartTimer = 0 }

      const speed = p.dartPhase === 1 ? 3.5 : 0.45
      p.t++
      p.pathRawX += speed * -1  // squids move left by default
      p.x = ((p.pathRawX % VW) + VW) % VW
      p.y = VH * 0.42 + Math.sin(p.t * 0.009) * 45

      // Flee
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 190 : 130
      if (dist < 130 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 4.5
        p.fleeY += (dy / dist) * 4.5
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.93; p.fleeY *= 0.93

      const nx = p.x + p.fleeX
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
      <img src="/creatures/squid.jpg" alt="" width={W} height={H} style={{ display: 'block' }} draggable={false} />
    </div>
  )
}
