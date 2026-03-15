// ── Jellyfish — Twilight Zone (0.12 → 0.40) ──────────────────────────
// Two instances. Drift upward, reset to bottom. CSS tentacle wave.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 52, H = 80
const DEPTH_RANGE = { enter: 0.13, exit: 0.36 }

function JellySVG({ filterId, small }) {
  const r = small ? 0.75 : 1
  return (
    <svg width={W * r} height={H * r} viewBox="0 0 52 80"
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`jg-${filterId}`} cx="50%" cy="40%" r="60%">
          <stop offset="0%"   stopColor="rgba(160,210,255,0.55)" />
          <stop offset="100%" stopColor="rgba(80,140,220,0.20)" />
        </radialGradient>
        <filter id={filterId} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Bell */}
      <path d="M5,26 Q5,4 26,4 Q47,4 47,26 Q47,34 26,38 Q5,34 5,26 Z"
        fill={`url(#jg-${filterId})`}
        stroke="rgba(120,180,255,0.45)" strokeWidth="1" />

      {/* Inner bell highlight */}
      <path d="M12,22 Q12,10 26,10 Q40,10 40,22"
        fill="rgba(200,230,255,0.20)" />

      {/* Oral arms — longer tentacles */}
      <path d="M18,37 Q14,52 16,68 Q18,74 20,72 Q22,70 20,64 Q18,56 20,48 Q22,40 18,37"
        fill="rgba(100,170,255,0.30)" stroke="rgba(120,180,255,0.40)" strokeWidth="0.8"
        className="jelly-tentacle" />
      <path d="M26,38 Q26,56 28,70 Q30,76 28,74 Q26,72 26,62 Q24,52 26,42 Q26,40 26,38"
        fill="rgba(100,170,255,0.30)" stroke="rgba(120,180,255,0.40)" strokeWidth="0.8"
        className="jelly-tentacle" style={{ animationDelay: '-0.8s' }} />
      <path d="M34,37 Q38,52 36,68 Q34,74 32,72 Q30,70 32,64 Q34,56 32,48 Q30,40 34,37"
        fill="rgba(100,170,255,0.30)" stroke="rgba(120,180,255,0.40)" strokeWidth="0.8"
        className="jelly-tentacle" style={{ animationDelay: '-1.6s' }} />

      {/* Short trailing tentacles */}
      {[10,16,22,28,34,40,46].map((x, i) => (
        <line key={x} x1={x} y1="36" x2={x - 1 + i % 2 * 2} y2={36 + 8 + i * 2}
          stroke="rgba(150,200,255,0.30)" strokeWidth="0.7"
          className="jelly-tentacle"
          style={{ animationDelay: `${-i * 0.3}s` }} />
      ))}

      {/* Bioluminescent rim */}
      <path d="M7,28 Q26,36 45,28"
        fill="none" stroke="rgba(160,230,255,0.60)" strokeWidth="1.2"
        filter={`url(#${filterId})`} />
    </svg>
  )
}

function SingleJelly({ idx, small }) {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x:     null,
    y:     null,
    fleeX: 0,
    fleeY: 0,
    fleeing: false,
  })

  useEffect(() => {
    const W_SVG = small ? W * 0.75 : W
    const H_SVG = small ? H * 0.75 : H

    // Stagger start positions
    const startYFrac = 0.45 + idx * 0.15

    const unsubscribe = subscribe((depth) => {
      const opacity = creatureOpacity(depth, DEPTH_RANGE)
      const el = wrapperRef.current
      if (!el) return

      if (opacity < 0.01) {
        el.style.opacity = '0'
        return
      }

      const VW = window.innerWidth
      const VH = window.innerHeight
      const p = s.current

      // Initialize
      if (p.x === null) {
        p.x = (0.2 + idx * 0.35) * VW
        p.y = startYFrac * VH
      }

      // Drift upward + slow horizontal sway
      const driftSpeed = small ? 0.28 : 0.22
      p.y -= driftSpeed
      p.x += Math.sin(p.y * 0.012 + idx * 1.4) * 0.35

      // Reset to bottom when reaching top
      if (p.y < -H_SVG - 20) {
        p.y = VH + H_SVG
        p.x = (0.15 + Math.random() * 0.7) * VW
      }

      // Gentle flee
      const mx   = mouseRef.current.x
      const my   = mouseRef.current.y
      const dx   = p.x - mx
      const dy   = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 160 : 110

      if (dist < 110 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 1.2
        p.fleeY += (dy / dist) * 1.2
      } else if (dist > hyst) {
        p.fleeing = false
      }
      p.fleeX *= 0.96
      p.fleeY *= 0.96

      const finalX = Math.max(W_SVG / 2, Math.min(VW - W_SVG / 2, p.x + p.fleeX))
      const finalY = p.y + p.fleeY

      el.style.transform = `translate(${finalX - W_SVG / 2}px, ${finalY - H_SVG / 2}px)`
      el.style.opacity = opacity.toFixed(3)
    })

    return unsubscribe
  }, [subscribe, idx, small])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <JellySVG filterId={`jelly-${idx}`} small={small} />
    </div>
  )
}

export function Jellyfish() {
  return (
    <>
      <SingleJelly idx={0} small={false} />
      <SingleJelly idx={1} small={true}  />
    </>
  )
}
