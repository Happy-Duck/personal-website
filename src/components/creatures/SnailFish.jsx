// ── Snail Fish — Hadal Zone (0.82 → 1.00) ────────────────────────────
// Deepest known fish. Ghostly, translucent, barely moves.
// Easter egg for ocean biology enthusiasts.
import { useEffect, useRef } from 'react'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 72, H = 30
const DEPTH_RANGE = { enter: 0.83, exit: 1.02 }

function SnailFishSVG() {
  return (
    <svg width={W} height={H} viewBox="0 0 72 30"
      overflow="visible" style={{ display: 'block' }}>
      {/* Tail — pointed */}
      <path d="M0,10 L8,15 L0,20 Z" fill="rgba(230,240,255,0.40)" />

      {/* Body — elongated, translucent */}
      <ellipse cx="38" cy="15" rx="30" ry="10" fill="rgba(210,230,255,0.30)"
        stroke="rgba(190,220,255,0.25)" strokeWidth="0.8" />

      {/* Dorsal fin — runs almost full length */}
      <path d="M10,8 Q30,4 60,8 L60,11 Q30,7 10,11 Z"
        fill="rgba(200,220,255,0.22)" />

      {/* Pelvic fins */}
      <path d="M30,22 Q36,28 42,22" fill="rgba(200,220,255,0.18)" />

      {/* Lateral line — faint */}
      <path d="M12,15 Q38,13 62,15"
        fill="none" stroke="rgba(200,220,255,0.30)" strokeWidth="0.7"
        strokeDasharray="3,2" />

      {/* Head */}
      <ellipse cx="64" cy="14" rx="8" ry="7" fill="rgba(220,235,255,0.35)"
        stroke="rgba(200,220,255,0.20)" strokeWidth="0.8" />

      {/* Eye — tiny */}
      <circle cx="67" cy="12" r="1.8" fill="rgba(140,180,230,0.50)" />
      <circle cx="67.4" cy="11.6" r="0.7" fill="rgba(220,240,255,0.60)" />

      {/* Snout */}
      <path d="M68,15 Q72,15 71,17" fill="none" stroke="rgba(200,220,255,0.30)" strokeWidth="0.7" />
    </svg>
  )
}

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
      <SnailFishSVG />
    </div>
  )
}
