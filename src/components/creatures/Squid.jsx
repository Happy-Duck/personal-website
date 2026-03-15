// ── Squid — Twilight Zone (0.18 → 0.45) ──────────────────────────────
// Darting bursts followed by slow glides. Bioluminescent dots.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 64, H = 28
const DEPTH_RANGE = { enter: 0.15, exit: 0.37 }

function SquidSVG({ filterId }) {
  return (
    <svg width={W} height={H} viewBox="0 0 64 28"
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Trailing tentacles — 8 short */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const baseX = 2 + i * 1.2
        const baseY = 10 + (i % 3) * 2.5
        return (
          <path key={i}
            d={`M${baseX},${baseY} Q${baseX - 6},${baseY + 4 + i} ${baseX - 10},${baseY + 2}`}
            fill="none" stroke="rgba(180,220,255,0.45)" strokeWidth="0.8"
            className="jelly-tentacle"
            style={{ animationDelay: `${-i * 0.22}s` }} />
        )
      })}
      {/* Two long tentacles */}
      <path d="M3,13 Q-8,20 -18,16" fill="none" stroke="rgba(150,200,255,0.55)" strokeWidth="1"
        className="jelly-tentacle" style={{ animationDelay: '-1s' }} />
      <path d="M3,15 Q-8,10 -18,12" fill="none" stroke="rgba(150,200,255,0.55)" strokeWidth="1"
        className="jelly-tentacle" style={{ animationDelay: '-2s' }} />

      {/* Mantle / body */}
      <ellipse cx="38" cy="14" rx="24" ry="9.5" fill="#1a3050" />
      {/* Mantle highlight */}
      <ellipse cx="36" cy="12" rx="16" ry="5" fill="rgba(60,100,160,0.35)" />

      {/* Fins */}
      <path d="M52,14 L62,8 L62,20 Z" fill="#162840" />

      {/* Bioluminescent dots along body */}
      {[20,28,36,44,50].map((cx, i) => (
        <circle key={cx} cx={cx} cy="13" r="1.4"
          fill="#00d4ff" filter={`url(#${filterId})`}
          className="bio-pulse"
          style={{ animationDelay: `${i * -0.4}s` }} />
      ))}

      {/* Eyes */}
      <circle cx="58" cy="12" r="3" fill="#0a1830" />
      <circle cx="58.8" cy="11.3" r="1.2" fill="#00aaff" opacity="0.8" />
    </svg>
  )
}

export function Squid() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x: null, y: null,
    pathRawX: 0,
    t: 0,
    fleeX: 0, fleeY: 0,
    fleeing: false,
    dartPhase: 0,       // 0 = glide, 1 = dart
    dartTimer: 0,
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
        p.x       = Math.random() * VW
        p.y       = 0.40 * VH
        p.pathRawX = p.x
      }

      // Dart / glide cycle
      p.dartTimer++
      if (p.dartTimer > 120 && p.dartPhase === 0) { p.dartPhase = 1; p.dartTimer = 0 }
      if (p.dartTimer > 25  && p.dartPhase === 1) { p.dartPhase = 0; p.dartTimer = 0 }

      const speed = p.dartPhase === 1 ? 3.5 : 0.45
      p.t++
      p.pathRawX += speed * -1  // squids move left by default
      p.x = ((p.pathRawX % VW) + VW) % VW
      p.y = VH * 0.42 + Math.sin(p.t * 0.009) * 45

      // Flee
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 190 : 130
      if (dist < 130 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 4.5
        p.fleeY += (dy / dist) * 4.5
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.93; p.fleeY *= 0.93

      const nx = p.x + p.fleeX
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
      <SquidSVG filterId="squid-glow" />
    </div>
  )
}
