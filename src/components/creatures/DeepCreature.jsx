import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'
import { useTheme } from '../../context/ThemeContext'

const BOX_W = 66
const BOX_H = 72
const HW    = BOX_W / 2
const HH    = BOX_H / 2

// ── Jellyfish SVG ──────────────────────────────────────────────────────

function JellyfishSvg() {
  const OX = 10  // centres 46-wide jelly in 66-wide box
  return (
    <g transform={`translate(${OX}, 0)`} filter="url(#jelly-glow)">
      {/* Outer bell */}
      <path d="M3,42 Q3,5 23,5 Q43,5 43,42 Z" fill="rgba(0,55,120,0.62)" className="jelly-bell" />
      {/* Inner luminescent dome */}
      <path d="M9,42 Q9,14 23,14 Q37,14 37,42 Z" fill="rgba(0,140,220,0.22)" className="jelly-bell" />
      {/* Oral arms */}
      <ellipse cx="16" cy="36" rx="4"   ry="5" fill="rgba(0,180,255,0.18)" className="jelly-bell" />
      <ellipse cx="23" cy="38" rx="3.5" ry="4" fill="rgba(0,200,255,0.15)" className="jelly-bell" />
      <ellipse cx="30" cy="36" rx="4"   ry="5" fill="rgba(0,180,255,0.18)" className="jelly-bell" />
      {/* Bell rim glow */}
      <path d="M3,42 Q3,5 23,5 Q43,5 43,42" fill="none"
        stroke="rgba(0,220,255,0.55)" strokeWidth="1.2" className="jelly-bell" />
      {/* Tentacles */}
      {[9,14,19,24,29,34,39].map((tx, i) => (
        <line key={i} x1={tx} y1={42} x2={tx + (i%2===0 ? -2 : 2)} y2={69}
          stroke="rgba(0,200,255,0.38)" strokeWidth={i%3===0 ? 1 : 0.7} strokeLinecap="round" />
      ))}
      {[11,21,31].map((tx, i) => (
        <line key={`w${i}`} x1={tx} y1={42} x2={tx-3} y2={62}
          stroke="rgba(100,220,255,0.22)" strokeWidth="0.5" strokeLinecap="round" />
      ))}
    </g>
  )
}

// ── Sea Turtle SVG (redesigned) ────────────────────────────────────────

function SeaTurtleSvg() {
  const OY = 15  // centres 42-tall turtle in 72-tall box
  return (
    <g transform={`translate(0, ${OY})`}>
      {/* Rear flippers */}
      <path d="M15,12 Q5,4 2,9 Q4,19 13,17 Z"   fill="#4d7a25" />
      <path d="M15,30 Q5,38 2,33 Q4,23 13,25 Z"  fill="#4d7a25" />
      {/* Front flippers */}
      <path d="M20,9  Q12,1  7,5  Q10,15 18,14 Z" fill="#4d7a25" />
      <path d="M20,33 Q12,41 7,37 Q10,27 18,28 Z" fill="#4d7a25" />
      {/* Shell base */}
      <ellipse cx="31" cy="21" rx="21" ry="16" fill="#2d5a1a" />
      {/* Shell sheen */}
      <ellipse cx="27" cy="16" rx="12" ry="8" fill="rgba(120,200,60,0.15)" />
      {/* Hexagonal scute plate */}
      <path d="M16,21 L20,10 L31,7 L42,10 L46,21 L42,32 L31,35 L20,32 Z"
        fill="#3d7a22" stroke="#4aaa2d" strokeWidth="1" opacity="0.9" />
      {/* Vertebral line */}
      <line x1="31" y1="7"  x2="31" y2="35" stroke="#6ac93e" strokeWidth="1.2" opacity="0.6" />
      {/* Costal lines */}
      <line x1="16" y1="21" x2="31" y2="7"  stroke="#6ac93e" strokeWidth="0.9" opacity="0.5" />
      <line x1="46" y1="21" x2="31" y2="7"  stroke="#6ac93e" strokeWidth="0.9" opacity="0.5" />
      <line x1="16" y1="21" x2="31" y2="35" stroke="#6ac93e" strokeWidth="0.9" opacity="0.5" />
      <line x1="46" y1="21" x2="31" y2="35" stroke="#6ac93e" strokeWidth="0.9" opacity="0.5" />
      {/* Neck */}
      <path d="M51,17 Q57,15 61,18 Q63,21 61,24 Q57,27 51,25 Z" fill="#4d7a25" />
      {/* Head */}
      <ellipse cx="60" cy="21" rx="7" ry="5.5" fill="#4d7a25" />
      <ellipse cx="57" cy="18" rx="3.5" ry="2" fill="rgba(160,230,80,0.18)" />
      {/* Eye */}
      <circle cx="64" cy="19"   r="2.3" fill="#1a2a08" />
      <circle cx="64.8" cy="18.2" r="0.9" fill="rgba(255,255,255,0.75)" />
    </g>
  )
}

// ── Component ──────────────────────────────────────────────────────────

export function DeepCreature() {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const { theme }  = useTheme()
  const themeRef   = useRef(theme)
  const s          = useRef(null)

  // Keep themeRef current without restarting the rAF loop
  useEffect(() => { themeRef.current = theme }, [theme])

  if (!s.current) {
    const W = typeof window !== 'undefined' ? window.innerWidth  : 1200
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    s.current = {
      t: 0,
      jellyX:      W * (0.3 + Math.random() * 0.4),
      jellyY:      H * 0.65,
      turtleRawX:  W * 0.6,
      turtleX:     W * 0.6,
      turtleDir:  -1,
      turtleBaseY: H * 0.6,
      fleeX: 0, fleeY: 0,
      prevFleeX: 0,
    }
  }

  useEffect(() => {
    let rafId

    const loop = () => {
      const W  = window.innerWidth
      const H  = window.innerHeight
      const p  = s.current
      const td = themeRef.current

      p.t += 1

      let pathX, pathY

      if (td === 'deep-sea') {
        // Jellyfish: float upward, gentle horizontal sway
        p.jellyY -= 0.26
        p.jellyX += Math.sin(p.t * 0.006) * 0.3
        if (p.jellyY < -(BOX_H + 20)) {
          p.jellyY  = H + BOX_H + 20
          p.jellyX  = W * (0.15 + Math.random() * 0.7)
        }
        p.jellyX = Math.max(BOX_W, Math.min(W - BOX_W, p.jellyX))
        pathX = p.jellyX
        pathY = p.jellyY
      } else {
        // Turtle: slow horizontal swim
        p.turtleRawX += 0.28 * p.turtleDir
        p.turtleX     = ((p.turtleRawX % W) + W) % W
        pathY = p.turtleBaseY + Math.sin(p.t * 0.005) * 48
        pathX = p.turtleX
      }

      // Flee
      const dx   = mouseRef.current.x - (pathX + p.fleeX)
      const dy   = mouseRef.current.y - (pathY + p.fleeY)
      const dist = Math.hypot(dx, dy)

      if (dist < 120 && dist > 0) {
        const str = ((120 - dist) / 120) * 2.8
        p.fleeX -= (dx / dist) * str
        p.fleeY -= (dy / dist) * str
      }
      p.fleeX = Math.max(-180, Math.min(180, p.fleeX * 0.955))
      p.fleeY = Math.max(-140, Math.min(140, p.fleeY * 0.955))

      const newX = pathX + p.fleeX
      const newY = pathY + p.fleeY

      // Facing: always follow travel direction — no flipping on flee
      const facing = td === 'deep-sea' ? 1 : p.turtleDir

      if (wrapperRef.current) {
        wrapperRef.current.style.transform = facing === 1
          ? `translate(${newX - HW}px, ${newY - HH}px)`
          : `translate(${newX + HW}px, ${newY - HH}px) scaleX(-1)`
      }

      rafId = requestAnimationFrame(loop)
    }

    rafId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafId)
  }, [])

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        width: BOX_W, height: BOX_H,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <svg width={BOX_W} height={BOX_H} viewBox={`0 0 ${BOX_W} ${BOX_H}`}
        overflow="visible" style={{ display: 'block' }}>
        <defs>
          <filter id="jelly-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {/* Opacity driven by CSS variable — no React re-render on theme change */}
        <g className="creature-deep"><JellyfishSvg /></g>
        <g className="creature-reef"><SeaTurtleSvg /></g>
      </svg>
    </div>
  )
}
