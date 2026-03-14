import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'

// Fish dimensions (SVG viewBox)
const W_SVG = 46
const H_SVG = 24
const HW = W_SVG / 2
const HH = H_SVG / 2

// Per-fish configuration
const CONFIGS = [
  { baseYFrac: 0.22, speed: 0.55, amplitude: 38, freq: 0.007, dir:  1 },
  { baseYFrac: 0.50, speed: 0.40, amplitude: 26, freq: 0.009, dir: -1 },
  { baseYFrac: 0.72, speed: 0.62, amplitude: 42, freq: 0.006, dir:  1 },
]

// ── SVGs ──────────────────────────────────────────────────────────────

function DeepSeaFish({ filterId }) {
  return (
    <>
      <defs>
        <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      {/* Tail */}
      <path d="M0,3 L10,12 L0,21 Z" fill="#071428" />
      {/* Body */}
      <ellipse cx="26" cy="12" rx="17" ry="8.5" fill="#0d2040" />
      {/* Dorsal fin */}
      <path d="M16,8 Q21,2 29,6 Z" fill="#091530" />
      {/* Pectoral fin */}
      <ellipse cx="21" cy="16.5" rx="5" ry="2.4" fill="#091530"
        transform="rotate(-20 21 16.5)" />
      {/* Bioluminescent lateral stripe */}
      <path d="M14,12 Q22,9.5 34,12" stroke="rgba(0,210,255,0.65)"
        strokeWidth="1.4" fill="none" filter={`url(#${filterId})`} />
      {/* Bio dots */}
      <circle cx="15.5" cy="12" r="1.3" fill="#00ffee"
        filter={`url(#${filterId})`} opacity="0.9" />
      <circle cx="22" cy="10.5" r="1.0" fill="#00aaff"
        filter={`url(#${filterId})`} opacity="0.85" />
      <circle cx="29" cy="12" r="1.3" fill="#00ffee"
        filter={`url(#${filterId})`} opacity="0.9" />
      {/* Eye */}
      <circle cx="36" cy="10" r="2.4" fill="#001422" />
      <circle cx="36.8" cy="9.2" r="1.0" fill="#00d4ff" />
    </>
  )
}

function ReefFish() {
  return (
    <>
      {/* Tail */}
      <path d="M0,3 L10,12 L0,21 Z" fill="#e05010" />
      {/* Body */}
      <ellipse cx="26" cy="12" rx="17" ry="8.5" fill="#ff6318" />
      {/* White mid-band */}
      <ellipse cx="23" cy="12" rx="4.8" ry="8.5" fill="white" opacity="0.88" />
      {/* White body rim */}
      <ellipse cx="26" cy="12" rx="17" ry="8.5" fill="none"
        stroke="white" strokeWidth="1.2" opacity="0.55" />
      {/* Dorsal fin */}
      <path d="M16,8 Q21,2 29,6 Z" fill="#e05010" />
      {/* Pectoral fin */}
      <ellipse cx="21" cy="16.5" rx="5" ry="2.4" fill="#e05010"
        transform="rotate(-20 21 16.5)" />
      {/* Eye */}
      <circle cx="36" cy="10" r="2.4" fill="#1a0800" />
      <circle cx="36.5" cy="9.3" r="1.0" fill="white" />
      <circle cx="36.8" cy="9.1" r="0.45" fill="#1a0800" />
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────

export function Fish({ index, theme }) {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const themeRef   = useRef(theme)
  const s          = useRef(null)

  // Keep themeRef in sync without restarting the rAF loop
  useEffect(() => { themeRef.current = theme }, [theme])

  // Lazy-initialise physics state on first render
  if (!s.current) {
    const cfg = CONFIGS[index]
    const W   = typeof window !== 'undefined' ? window.innerWidth  : 1200
    const H   = typeof window !== 'undefined' ? window.innerHeight : 800
    const startX = Math.random() * W
    s.current = {
      t:           Math.random() * 6000,
      pathRawX:    startX,                       // un-wrapped, for velocity calc
      pathX:       startX,                       // wrapped visual position
      pathY:       H * cfg.baseYFrac,
      fleeX: 0, fleeY: 0,
      prevFleeX: 0,
      prevPathX:   startX,
      x: startX, y: H * cfg.baseYFrac,
    }
  }

  useEffect(() => {
    const cfg    = CONFIGS[index]
    let   rafId

    const loop = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      const p = s.current

      p.t += 1

      // ── Path ──────────────────────────────────────────────────────
      p.pathRawX += cfg.speed * cfg.dir
      p.pathX     = ((p.pathRawX % W) + W) % W
      const pathY = H * cfg.baseYFrac + Math.sin(p.t * cfg.freq) * cfg.amplitude

      // ── Flee ──────────────────────────────────────────────────────
      const mx   = mouseRef.current.x
      const my   = mouseRef.current.y
      const cx   = p.pathX + p.fleeX
      const cy   = pathY  + p.fleeY
      const dx   = mx - cx
      const dy   = my - cy
      const dist = Math.hypot(dx, dy)

      if (dist < 120 && dist > 0) {
        const str = ((120 - dist) / 120) * 3.2
        p.fleeX -= (dx / dist) * str
        p.fleeY -= (dy / dist) * str
      }

      // Decay — drift back to path over ~1.5 s
      p.fleeX *= 0.955
      p.fleeY *= 0.955

      // Cap flee so fish can't leave the screen entirely
      p.fleeX = Math.max(-200, Math.min(200, p.fleeX))
      p.fleeY = Math.max(-150, Math.min(150, p.fleeY))

      const newX = p.pathX + p.fleeX
      const newY = Math.max(28, Math.min(H - 30, pathY + p.fleeY))

      // ── Facing direction ──────────────────────────────────────────
      // Use wrapped-path velocity + flee delta; ignore wrap-around jumps
      const rawPathVx  = Math.abs(p.pathX - p.prevPathX) < W / 2
        ? p.pathX - p.prevPathX
        : cfg.dir * cfg.speed
      const totalVx    = rawPathVx + (p.fleeX - p.prevFleeX)
      const facing     = totalVx >= 0 ? 1 : -1

      p.prevPathX  = p.pathX
      p.prevFleeX  = p.fleeX
      p.x = newX;  p.y = newY

      // ── DOM update (no React re-render) ───────────────────────────
      if (wrapperRef.current) {
        // Flip around creature centre: facing=1 → normal, facing=-1 → mirror
        wrapperRef.current.style.transform = facing === 1
          ? `translate(${newX - HW}px, ${newY - HH}px)`
          : `translate(${newX + HW}px, ${newY - HH}px) scaleX(-1)`
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [index]) // only mounts once; reads themeRef live

  const isDeepSea  = theme === 'deep-sea'
  const filterId   = `bio-glow-${index}`

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: W_SVG,
        height: H_SVG,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={W_SVG}
        height={H_SVG}
        viewBox={`0 0 ${W_SVG} ${H_SVG}`}
        overflow="visible"
        style={{ display: 'block' }}
      >
        <g opacity={isDeepSea ? 1 : 0} style={{ transition: 'opacity 0.8s' }}>
          <DeepSeaFish filterId={filterId} />
        </g>
        <g opacity={isDeepSea ? 0 : 1} style={{ transition: 'opacity 0.8s' }}>
          <ReefFish />
        </g>
      </svg>
    </div>
  )
}
