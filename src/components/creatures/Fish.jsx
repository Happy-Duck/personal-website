import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'

const W_SVG = 46
const H_SVG = 24
const HW    = W_SVG / 2
const HH    = H_SVG / 2

// baseYFrac — deep sea swimming lanes (spread across full viewport)
// reefYFrac — beach mode: all three fish cluster in the ocean band (48–65% vh)
const CONFIGS = [
  { baseYFrac: 0.22, reefYFrac: 0.52, speed: 0.55, amplitude: 38, freq: 0.007, dir:  1 },
  { baseYFrac: 0.50, reefYFrac: 0.58, speed: 0.40, amplitude: 26, freq: 0.009, dir: -1 },
  { baseYFrac: 0.72, reefYFrac: 0.64, speed: 0.62, amplitude: 42, freq: 0.006, dir:  1 },
]

// ── SVG shapes ────────────────────────────────────────────────────────

function DeepSeaFish({ filterId }) {
  return (
    <>
      <defs>
        <filter id={filterId} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Tail */}
      <path d="M0,3 L10,12 L0,21 Z" fill="#071428" />
      {/* Body */}
      <ellipse cx="26" cy="12" rx="17" ry="8.5" fill="#0d2040" />
      {/* Dorsal fin */}
      <path d="M16,8 Q21,2 29,6 Z" fill="#091530" />
      {/* Pectoral fin */}
      <ellipse cx="21" cy="16.5" rx="5" ry="2.4" fill="#091530" transform="rotate(-20 21 16.5)" />
      {/* Bioluminescent lateral stripe */}
      <path d="M14,12 Q22,9.5 34,12" stroke="rgba(0,210,255,0.65)" strokeWidth="1.4"
        fill="none" filter={`url(#${filterId})`} />
      {/* Bio dots */}
      <circle cx="15.5" cy="12" r="1.3" fill="#00ffee" filter={`url(#${filterId})`} opacity="0.9" />
      <circle cx="22"   cy="10.5" r="1" fill="#00aaff" filter={`url(#${filterId})`} opacity="0.85" />
      <circle cx="29"   cy="12"   r="1.3" fill="#00ffee" filter={`url(#${filterId})`} opacity="0.9" />
      {/* Eye */}
      <circle cx="36" cy="10" r="2.4" fill="#001422" />
      <circle cx="36.8" cy="9.2" r="1" fill="#00d4ff" />
    </>
  )
}

function ReefFish() {
  return (
    <>
      {/* Fan tail with subtle inner lines */}
      <path d="M0,3 L10,12 L0,21 Z" fill="#e05010" />
      <path d="M0,3 Q5,8 10,12"  fill="none" stroke="#cc3800" strokeWidth="0.8" opacity="0.6" />
      <path d="M0,21 Q5,16 10,12" fill="none" stroke="#cc3800" strokeWidth="0.8" opacity="0.6" />
      {/* Body */}
      <ellipse cx="26" cy="12" rx="17" ry="10" fill="#ff6318" />
      {/* White middle band (primary clownfish marking) */}
      <ellipse cx="21" cy="12" rx="4.2" ry="10" fill="white" opacity="0.88" />
      {/* Narrower white band near head */}
      <ellipse cx="35" cy="12" rx="2.8" ry="7.5" fill="white" opacity="0.62" />
      {/* Subtle dark body outline */}
      <ellipse cx="26" cy="12" rx="17" ry="10" fill="none" stroke="#1a0600" strokeWidth="1.3" opacity="0.28" />
      {/* Dorsal fin */}
      <path d="M16,8 Q21,1.5 30,5.5 L28,8 Z" fill="#ff7722" stroke="#cc3800" strokeWidth="0.7" />
      {/* Pectoral fin */}
      <ellipse cx="23" cy="17.5" rx="5.5" ry="2.5" fill="#e05010" transform="rotate(-22 23 17.5)" />
      {/* Anal fin */}
      <path d="M23,19.5 Q26,23.5 30,21.5 L28,19.5 Z" fill="#ff7722" stroke="#cc3800" strokeWidth="0.7" />
      {/* Eye */}
      <circle cx="37" cy="10"   r="2.8" fill="#0d0400" />
      <circle cx="37.5" cy="9.1" r="1.2" fill="white" opacity="0.9" />
      <circle cx="37.9" cy="8.8" r="0.5" fill="#0d0400" />
    </>
  )
}

// ── Component ─────────────────────────────────────────────────────────

export function Fish({ index }) {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const s          = useRef(null)

  if (!s.current) {
    const cfg = CONFIGS[index]
    const W   = typeof window !== 'undefined' ? window.innerWidth  : 1200
    const H   = typeof window !== 'undefined' ? window.innerHeight : 800
    s.current = {
      t:          Math.random() * 6000,
      pathRawX:   Math.random() * W,
      pathX:      Math.random() * W,
      prevPathX:  Math.random() * W,
      prevFleeX:  0,
      fleeX: 0, fleeY: 0,
      baseY: H * cfg.baseYFrac,
    }
  }

  useEffect(() => {
    const cfg = CONFIGS[index]
    let   rafId

    const loop = () => {
      const W = window.innerWidth
      const H = window.innerHeight
      const p = s.current

      p.t += 1
      p.pathRawX += cfg.speed * cfg.dir
      p.pathX     = ((p.pathRawX % W) + W) % W

      // Lerp baseY toward the correct band for the current theme (no React re-render)
      const isReef   = document.documentElement.getAttribute('data-theme') === 'shallow-reef'
      const targetY  = H * (isReef ? cfg.reefYFrac : cfg.baseYFrac)
      p.baseY       += (targetY - p.baseY) * 0.03

      const pathY = p.baseY + Math.sin(p.t * cfg.freq) * cfg.amplitude

      // Flee
      const cx   = p.pathX + p.fleeX
      const cy   = pathY   + p.fleeY
      const dx   = mouseRef.current.x - cx
      const dy   = mouseRef.current.y - cy
      const dist = Math.hypot(dx, dy)

      if (dist < 120 && dist > 0) {
        const str = ((120 - dist) / 120) * 3.2
        p.fleeX -= (dx / dist) * str
        p.fleeY -= (dy / dist) * str
      }
      p.fleeX = Math.max(-200, Math.min(200, p.fleeX * 0.955))
      p.fleeY = Math.max(-150, Math.min(150, p.fleeY * 0.955))

      const newX = p.pathX + p.fleeX
      const newY = Math.max(28, Math.min(H - 30, pathY + p.fleeY))

      // Facing: always follow path direction — no flipping on flee
      const facing = cfg.dir

      p.prevPathX = p.pathX
      p.prevFleeX = p.fleeX

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = facing === 1
          ? `translate(${newX - HW}px, ${newY - HH}px)`
          : `translate(${newX + HW}px, ${newY - HH}px) scaleX(-1)`
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [index])

  const filterId = `bio-glow-${index}`

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: W_SVG, height: H_SVG,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <svg width={W_SVG} height={H_SVG} viewBox={`0 0 ${W_SVG} ${H_SVG}`}
        overflow="visible" style={{ display: 'block' }}>
        {/* Opacity driven by CSS variable — no React re-render on theme change */}
        <g className="creature-deep">
          <DeepSeaFish filterId={filterId} />
        </g>
        <g className="creature-reef">
          <ReefFish />
        </g>
      </svg>
    </div>
  )
}
