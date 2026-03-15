// ── Giant Squid — Abyssal Zone (0.55 → 0.88) ─────────────────────────
// Enters from one side, slowly traverses, exits, long pause before return.
import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useOceanDepthContext } from '../../context/OceanDepthContext'
import { creatureOpacity } from '../../constants/depthZones'

const W = 130, H = 55
const DEPTH_RANGE = { enter: 0.58, exit: 0.88 }
const TRAVERSE_SPEED = 0.28
const PAUSE_FRAMES   = 420  // ~7s at 60fps

function GiantSquidSVG({ filterId }) {
  return (
    <svg width={W} height={H} viewBox="0 0 130 55"
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <filter id={filterId} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      {/* Long tentacles trailing */}
      {[0,1,2,3,4,5,6,7].map(i => {
        const baseX = 5 + i * 2
        const baseY = 22 + (i % 4) * 3
        return (
          <path key={i}
            d={`M${baseX},${baseY} Q${baseX - 18 - i * 2},${baseY + 8 + i} ${baseX - 28 - i * 3},${baseY + 2}`}
            fill="none" stroke="rgba(100,140,200,0.35)" strokeWidth="1.0"
            className="jelly-tentacle"
            style={{ animationDelay: `${-i * 0.35}s` }} />
        )
      })}
      {/* Two long tentacles */}
      <path d="M6,26 Q-20,38 -48,30" fill="none" stroke="rgba(80,120,180,0.50)" strokeWidth="1.4"
        className="jelly-tentacle" style={{ animationDelay: '-1.5s' }} />
      <path d="M6,29 Q-20,20 -48,25" fill="none" stroke="rgba(80,120,180,0.50)" strokeWidth="1.4"
        className="jelly-tentacle" style={{ animationDelay: '-2.5s' }} />

      {/* Fins */}
      <path d="M108,27 L130,14 L130,40 Z" fill="#0a1424" />

      {/* Mantle */}
      <ellipse cx="68" cy="27" rx="60" ry="20" fill="#0c1a2c" />
      {/* Mantle shading */}
      <ellipse cx="66" cy="24" rx="40" ry="12" fill="rgba(15,30,55,0.50)" />
      {/* Mantle highlight */}
      <ellipse cx="55" cy="20" rx="20" ry="6" fill="rgba(30,60,100,0.20)" />

      {/* Bioluminescent spots — few, dim */}
      {[30,50,70,90].map((cx, i) => (
        <circle key={cx} cx={cx} cy="27" r="1.8"
          fill="rgba(0,180,255,0.50)" filter={`url(#${filterId})`}
          className="bio-pulse"
          style={{ animationDelay: `${-i * 0.7}s` }} />
      ))}

      {/* Eyes — large, haunting */}
      <circle cx="114" cy="22" r="7" fill="#060e1c" />
      <circle cx="114" cy="22" r="5" fill="#040a14" stroke="rgba(0,150,255,0.25)" strokeWidth="1" />
      <circle cx="116" cy="20" r="2" fill="rgba(0,120,220,0.45)" filter={`url(#${filterId})`} />
    </svg>
  )
}

export function GiantSquid() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()

  const s = useRef({
    x:       null,
    y:       null,
    dir:     1,
    phase:   'traverse',  // 'traverse' | 'pause'
    pauseT:  0,
    fleeX:   0, fleeY: 0,
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

      // Initialize off-screen left
      if (p.x === null) {
        p.x   = -W - 20
        p.y   = VH * 0.55
        p.dir = 1
      }

      if (p.phase === 'traverse') {
        p.x += TRAVERSE_SPEED * p.dir
        // Slow Y drift
        p.y += Math.sin(p.x * 0.005) * 0.3

        // Crossed viewport — start pause
        if (p.dir === 1 && p.x > VW + W + 20) {
          p.phase  = 'pause'
          p.pauseT = 0
          p.x      = VW + W + 30
          p.dir    = -1
          p.y      = VH * 0.5 + (Math.random() - 0.5) * VH * 0.2
        } else if (p.dir === -1 && p.x < -W - 20) {
          p.phase  = 'pause'
          p.pauseT = 0
          p.x      = -W - 30
          p.dir    = 1
          p.y      = VH * 0.5 + (Math.random() - 0.5) * VH * 0.2
        }
      } else {
        p.pauseT++
        if (p.pauseT > PAUSE_FRAMES) p.phase = 'traverse'
      }

      // Gentle flee
      const mx = mouseRef.current.x, my = mouseRef.current.y
      const dx = p.x - mx, dy = p.y - my
      const dist = Math.hypot(dx, dy)
      const hyst = p.fleeing ? 220 : 160
      if (dist < 160 && dist > 0) {
        p.fleeing = true
        p.fleeX += (dx / dist) * 1.5
        p.fleeY += (dy / dist) * 1.5
      } else if (dist > hyst) { p.fleeing = false }
      p.fleeX *= 0.97; p.fleeY *= 0.97

      const nx = p.x + p.fleeX
      const ny = Math.max(20, Math.min(VH - 20, p.y + p.fleeY))
      const flip = p.dir === 1 ? '' : ' scaleX(-1)'

      el.style.transform = `translate(${nx - W / 2}px, ${ny - H / 2}px)${flip}`
      el.style.opacity   = opacity.toFixed(3)
    })

    return unsubscribe
  }, [subscribe])

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <GiantSquidSVG filterId="giant-squid-glow" />
    </div>
  )
}
