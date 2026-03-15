// ── Giant Squid — Abyssal Zone (0.55 → 0.88) ─────────────────────────
// Enters from one side, slowly traverses, exits, long pause before return.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 350, H = 175
const DEPTH_RANGE = { enter: 0.58, exit: 0.88 }
const TRAVERSE_SPEED = 0.28
const PAUSE_FRAMES   = 420  // ~7s at 60fps

export function GiantSquid() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x:       null,
    y:       null,
    dir:     1,
    phase:   'traverse',  // 'traverse' | 'pause'
    pauseT:  0,
    fleeX:   0, fleeY: 0,
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

      // Initialize off-screen left
      if (p.x === null) {
        p.x   = -W - 20
        p.y   = VH * 0.55
        p.dir = 1
      }

      if (p.phase === 'traverse') {
        p.x += TRAVERSE_SPEED * p.dir
        // Slow Y drift
        p.y += Math.sin(p.x * 0.005) * 0.3

        // Crossed viewport — start pause
        if (p.dir === 1 && p.x > VW + W + 20) {
          p.phase  = 'pause'
          p.pauseT = 0
          p.x      = VW + W + 30
          p.dir    = -1
          p.y      = VH * 0.5 + (Math.random() - 0.5) * VH * 0.2
        } else if (p.dir === -1 && p.x < -W - 20) {
          p.phase  = 'pause'
          p.pauseT = 0
          p.x      = -W - 30
          p.dir    = 1
          p.y      = VH * 0.5 + (Math.random() - 0.5) * VH * 0.2
        }
      } else {
        p.pauseT++
        if (p.pauseT > PAUSE_FRAMES) p.phase = 'traverse'
      }

      // Gentle flee
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 220 : 160
      if (dist < 160 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 1.5
        p.fleeY += (dy / dist) * 1.5
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.97; p.fleeY *= 0.97

      const nx = p.x + p.fleeX
      const ny = Math.max(20, Math.min(VH - 20, p.y + p.fleeY))
      const flip = p.dir === 1 ? '' : ' scaleX(-1)'

      el.style.transform = `translate(${nx - W / 2}px, ${ny - H / 2}px)${flip}`
      el.style.opacity   = opacity.toFixed(3)
    })

    return unsubscribe
  }, [subscribe])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <img src="/creatures/jumboSquid.webp" alt="" width={W} height={H} style={{ display: 'block', transform: 'scaleX(-1)' }} draggable={false} />
    </div>
  )
}
