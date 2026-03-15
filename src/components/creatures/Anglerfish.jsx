// ── Anglerfish — Midnight Zone (0.32 → 0.65) ─────────────────────────
// Round, menacing, mostly idle. Pulsing lure.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 74, H = 62
const DEPTH_RANGE = { enter: 0.32, peak: 0.45, exit: 0.65 }

function AnglerSVG({ filterId }) {
  return (
    <svg width={W} height={H} viewBox="0 0 74 62"
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="3.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${filterId}-sm`} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Lure stalk */}
      <path d="M42,6 Q46,2 50,4 Q54,6 52,2"
        fill="none" stroke="#1a2840" strokeWidth="1.5" strokeLinecap="round" />
      {/* Lure orb */}
      <circle cx="52" cy="2" r="4"
        fill="#00ffee"
        filter={`url(#${filterId})`}
        className="lure-pulse" />
      <circle cx="52" cy="2" r="2" fill="white" opacity="0.8" className="lure-pulse" />

      {/* Tail */}
      <path d="M4,26 L14,18 L14,34 Z" fill="#0a1830" />

      {/* Body */}
      <ellipse cx="40" cy="28" rx="28" ry="24" fill="#0d1e38" />
      {/* Body shading */}
      <ellipse cx="38" cy="25" rx="18" ry="14" fill="rgba(20,40,80,0.4)" />

      {/* Dorsal fin */}
      <path d="M28,10 Q36,3 48,8 L44,12 Z" fill="#0a1830" />

      {/* Pectoral fins */}
      <ellipse cx="22" cy="36" rx="9" ry="4" fill="#0a1830" transform="rotate(20 22 36)" />
      <ellipse cx="56" cy="36" rx="9" ry="4" fill="#0a1830" transform="rotate(-20 56 36)" />

      {/* Jaw */}
      <path d="M16,34 Q22,42 40,44 Q56,42 62,34"
        fill="#0a1830" stroke="#0a1830" strokeWidth="1" />
      {/* Teeth — top row */}
      {[20, 27, 34, 41, 48, 55].map((x, i) => (
        <path key={x} d={`M${x},${34 - (i % 2) * 1} L${x + 1.5},${40 - (i % 2) * 1} L${x + 3},${34 - (i % 2) * 1}`}
          fill="rgba(180,220,255,0.55)" />
      ))}
      {/* Teeth — bottom row */}
      {[22, 30, 38, 46, 52].map((x) => (
        <path key={x} d={`M${x},42 L${x + 1.5},36 L${x + 3},42`}
          fill="rgba(180,220,255,0.45)" />
      ))}

      {/* Eyes */}
      <circle cx="54" cy="20" r="6" fill="#020810" />
      <circle cx="54" cy="20" r="4" fill="#010408" stroke="rgba(0,180,255,0.30)" strokeWidth="1" />
      <circle cx="55.5" cy="18.5" r="1.5" fill="rgba(0,150,255,0.60)"
        filter={`url(#${filterId}-sm)`} />

      {/* Bioluminescent flank stripe */}
      <path d="M18,30 Q32,27 54,30"
        fill="none" stroke="rgba(0,180,255,0.30)" strokeWidth="1.2"
        filter={`url(#${filterId}-sm)`} />
    </svg>
  )
}

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
      <AnglerSVG filterId="angler-glow" />
    </div>
  )
}
