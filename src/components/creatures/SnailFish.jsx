// ── Snail Fish — Hadal Zone (0.82 → 1.00) ────────────────────────────
// Deepest known fish. Ghostly, translucent, barely moves.
// Easter egg for ocean biology enthusiasts.
import { useEffect, useRef } from 'react'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 90, H = 30
const DEPTH_RANGE = { enter: 0.83, exit: 1.02 }

export function SnailFish() {
  const wrapperRef = useRef(null)
  const { subscribe } = useOceanDepthContext()

  const s = useRef({ x: null, y: null, t: 0 })

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
        p.x = VW * 0.4
        p.y = VH * 0.6
      }

      // Barely moves — very slow drift
      p.t++
      p.x += 0.08
      p.y += Math.sin(p.t * 0.003) * 0.15

      if (p.x > VW + W) { p.x = -W; p.y = VH * (0.5 + Math.random() * 0.3) }

      el.style.transform = `translate(${p.x - W / 2}px, ${p.y - H / 2}px)`
      el.style.opacity   = opacity.toFixed(3)
    })

    return unsubscribe
  }, [subscribe])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <img src="/creatures/Lizardfish.webp" alt="" width={W} height={H} style={{ display: 'block' }} draggable={false} />
    </div>
  )
}
