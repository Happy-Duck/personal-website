// ── Abyssal Jellyfish — Abyssal Zone (0.58 → 0.90) ───────────────────
// Large, alien, deep glow. Slow upward drift.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 130, H = 182
const DEPTH_RANGE = { enter: 0.60, exit: 0.87 }

export function AbyssalJellyfish() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x: null, y: null,
    dodgeX: 0,
    driftBoost: 0,
  })

  useEffect(() => {
    const isMobile = window.matchMedia('(pointer: coarse)').matches

    const unsubscribe = subscribe((depth) => {
      const opacity = creatureOpacity(depth, DEPTH_RANGE)
      const el = wrapperRef.current
      if (!el) return

      if (opacity < 0.01) { el.style.opacity = '0'; return }

      const VW = window.innerWidth
      const VH = window.innerHeight
      const p = s.current

      if (p.x === null) {
        p.x = VW * 0.65
        p.y = VH * 0.75
      }

      // Drift upward very slowly
      p.y -= 0.16 + p.driftBoost
      p.driftBoost *= 0.94
      p.x += Math.sin(p.y * 0.008) * 0.25
      if (p.y < -H - 20) {
        p.y = VH + H + 10
        p.x = (0.3 + Math.random() * 0.5) * VW
      }

      // Mouse flee — drift faster upward + horizontal dodge
      if (!isMobile) {
        const mx = mouseRef.current.x, my = mouseRef.current.y
        const dx = mx - p.x, dy = my - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140 && dist > 0) {
          const str = (140 - dist) / 140
          p.driftBoost = Math.max(p.driftBoost, str * 1.2)
          p.dodgeX += -(dx / dist) * str * 1.2
        }
      }

      p.dodgeX *= 0.96
      p.dodgeX = Math.max(-80, Math.min(80, p.dodgeX))

      const nx = Math.max(W / 2, Math.min(VW - W / 2, p.x + p.dodgeX))
      const ny = p.y

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
      <img src="/creatures/deepJellyfish.png" alt="" width={W} height={H} style={{ display: 'block', transform: 'rotate(40deg)', mixBlendMode: 'screen' }} draggable={false} />
    </div>
  )
}
