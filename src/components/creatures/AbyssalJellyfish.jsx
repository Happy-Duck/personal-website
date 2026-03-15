// ── Abyssal Jellyfish — Abyssal Zone (0.58 → 0.90) ───────────────────
// Large, alien, stronger glow. Slow upward drift.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 80, H = 110
const DEPTH_RANGE = { enter: 0.58, peak: 0.73, exit: 0.90 }

function AbyssJellySVG({ filterId }) {
  return (
    <svg width={W} height={H} viewBox="0 0 80 110"
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <radialGradient id={`ajg-${filterId}`} cx="50%" cy="35%" r="65%">
          <stop offset="0%"   stopColor="rgba(80,0,160,0.55)" />
          <stop offset="60%"  stopColor="rgba(40,0,100,0.35)" />
          <stop offset="100%" stopColor="rgba(20,0,60,0.15)" />
        </radialGradient>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id={`${filterId}-sm`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Bell */}
      <path d="M8,40 Q8,5 40,5 Q72,5 72,40 Q72,52 40,58 Q8,52 8,40 Z"
        fill={`url(#ajg-${filterId})`}
        stroke="rgba(160,80,255,0.40)" strokeWidth="1.2" />

      {/* Inner bell structure — alien ribbing */}
      {[15, 23, 31, 40, 49, 57, 65].map((x, i) => (
        <path key={x}
          d={`M${x},${40 - i % 2 * 2} Q${x},${12 + i % 3 * 3} ${x + 1},8`}
          fill="none" stroke="rgba(200,100,255,0.18)" strokeWidth="0.8" />
      ))}

      {/* Glowing rim */}
      <path d="M10,42 Q40,56 70,42"
        fill="none" stroke="rgba(200,100,255,0.70)" strokeWidth="1.8"
        filter={`url(#${filterId}-sm)`}
        className="bio-pulse" />

      {/* Oral arms — thick, trailing */}
      {[16, 24, 32, 40, 48, 56, 64, 72].map((x, i) => (
        <path key={x}
          d={`M${x},56 Q${x + (i % 3 - 1) * 8},${72 + i * 4} ${x + (i % 2 - 0.5) * 6},${90 + i * 2}`}
          fill="rgba(120,0,200,0.25)" stroke="rgba(160,80,255,0.35)" strokeWidth="1.2"
          className="jelly-tentacle"
          style={{ animationDelay: `${-i * 0.4}s` }} />
      ))}

      {/* Bioluminescent dots */}
      {[20, 33, 47, 60].map((cx, i) => (
        <circle key={cx} cx={cx} cy={20 + i * 5} r="2"
          fill="rgba(220,100,255,0.80)" filter={`url(#${filterId})`}
          className="bio-pulse"
          style={{ animationDelay: `${-i * 0.5}s` }} />
      ))}
    </svg>
  )
}

export function AbyssalJellyfish() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({ x: null, y: null, fleeX: 0, fleeY: 0, fleeing: false })

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
        p.x = VW * 0.65
        p.y = VH * 0.75
      }

      // Drift upward very slowly
      p.y -= 0.16
      p.x += Math.sin(p.y * 0.008) * 0.25
      if (p.y < -H - 20) {
        p.y = VH + H + 10
        p.x = (0.3 + Math.random() * 0.5) * VW
      }

      // Gentle flee
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 180 : 120
      if (dist < 120 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 0.9
        p.fleeY += (dy / dist) * 0.9
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.97; p.fleeY *= 0.97

      const nx = Math.max(W / 2, Math.min(VW - W / 2, p.x + p.fleeX))
      const ny = p.y + p.fleeY

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
      <AbyssJellySVG filterId="abyssal-jelly-glow" />
    </div>
  )
}
