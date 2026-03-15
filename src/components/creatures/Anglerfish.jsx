// ── Anglerfish — Midnight Zone (0.32 → 0.65) ─────────────────────────
// Round, menacing, mostly idle. Pulsing lure.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 225, H = 170
const DEPTH_RANGE = { enter: 0.33, exit: 0.62 }

export function Anglerfish() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x: null, y: null,
    t: 0,
    speedBoost: 0,
    dodgeY: 0,
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
        p.x = 0.35 * VW
        p.y = 0.52 * VH
      }

      // Very slow drift
      p.t++
      const targetX = VW * 0.35 + Math.sin(p.t * 0.003) * 120
      const targetY = VH * 0.52 + Math.sin(p.t * 0.005) * 60

      p.x += (targetX - p.x) * 0.008 + p.speedBoost
      p.y += (targetY - p.y) * 0.008

      // Mouse flee — gentle drift-away + vertical dodge
      if (!isMobile) {
        const mx = mouseRef.current.x, my = mouseRef.current.y
        const dx = mx - p.x, dy = my - (p.y + p.dodgeY)
        const dist = Math.hypot(dx, dy)

        if (dist < 180 && dist > 0) {
          const str = (180 - dist) / 180
          // Drift away horizontally (away from cursor)
          p.speedBoost += -(dx / dist) * str * 0.3
          // Mild vertical dodge
          p.dodgeY += -(dy / dist) * str * 1.5
        }
      }

      p.speedBoost *= 0.96
      p.speedBoost = Math.max(-3, Math.min(3, p.speedBoost))
      p.dodgeY *= 0.97
      p.dodgeY = Math.max(-100, Math.min(100, p.dodgeY))

      const nx = Math.max(W / 2, Math.min(VW - W / 2, p.x))
      const ny = Math.max(20, Math.min(VH - 20, p.y + p.dodgeY))

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
      <div style={{ position: 'relative', width: W, height: H }}>
        <img src="/creatures/Anglerfish.webp" alt="" width={W} height={H} style={{ display: 'block', transform: 'scaleX(-1)' }} draggable={false} />
        {/* Lure glow — positioned at the esca bulb (top-right after flip) */}
        <div className="angler-lure" style={{
          position: 'absolute',
          top: '4%',
          right: '12%',
          width: 18,
          height: 18,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(100,220,255,0.9) 0%, rgba(60,180,255,0.4) 40%, transparent 70%)',
          boxShadow: '0 0 12px 6px rgba(80,200,255,0.5), 0 0 30px 14px rgba(60,160,255,0.25)',
          pointerEvents: 'none',
        }} />
      </div>
    </div>
  )
}
