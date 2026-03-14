import { useEffect, useRef } from 'react'
import { useMouse } from '../../context/MouseContext'

// Wrapper size covers both creatures; each SVG is centred within it
const BOX_W = 64
const BOX_H = 72
const HW    = BOX_W / 2
const HH    = BOX_H / 2

// ── Jellyfish SVG ──────────────────────────────────────────────────────

function JellyfishSvg() {
  // Drawn at 46×72, offset to centre in 64×72 box (left offset = 9)
  const OX = 9
  return (
    <g transform={`translate(${OX}, 0)`} filter="url(#jelly-glow)">
      {/* Outer bell */}
      <path
        d={`M3,42 Q3,5 23,5 Q43,5 43,42 Z`}
        fill="rgba(0,55,120,0.62)"
        className="jelly-bell"
      />
      {/* Inner luminescent dome */}
      <path
        d={`M9,42 Q9,14 23,14 Q37,14 37,42 Z`}
        fill="rgba(0,140,220,0.22)"
        className="jelly-bell"
      />
      {/* Oral arms — soft blobs inside lower bell */}
      <ellipse cx="16" cy="36" rx="4" ry="5" fill="rgba(0,180,255,0.18)" className="jelly-bell" />
      <ellipse cx="23" cy="38" rx="3.5" ry="4" fill="rgba(0,200,255,0.15)" className="jelly-bell" />
      <ellipse cx="30" cy="36" rx="4" ry="5" fill="rgba(0,180,255,0.18)" className="jelly-bell" />
      {/* Bell rim glow */}
      <path
        d={`M3,42 Q3,5 23,5 Q43,5 43,42`}
        fill="none"
        stroke="rgba(0,220,255,0.55)"
        strokeWidth="1.2"
        className="jelly-bell"
      />
      {/* Tentacles */}
      {[9, 14, 19, 24, 29, 34, 39].map((tx, i) => (
        <line
          key={i}
          x1={tx} y1={42}
          x2={tx + (i % 2 === 0 ? -2 : 2)} y2={69}
          stroke="rgba(0,200,255,0.38)"
          strokeWidth={i % 3 === 0 ? 1.0 : 0.7}
          strokeLinecap="round"
        />
      ))}
      {/* Tentacle trailing wisps */}
      {[11, 21, 31].map((tx, i) => (
        <line
          key={`w${i}`}
          x1={tx} y1={42}
          x2={tx - 3} y2={62}
          stroke="rgba(100,220,255,0.22)"
          strokeWidth="0.5"
          strokeLinecap="round"
        />
      ))}
    </g>
  )
}

// ── Sea Turtle SVG ─────────────────────────────────────────────────────

function SeaTurtleSvg() {
  // Drawn at 64×42, offset to centre in 64×72 box (top offset = 15)
  const OY = 15
  return (
    <g transform={`translate(0, ${OY})`}>
      {/* Front flippers */}
      <path d="M14,14 Q2,4 1,11 Q2,20 12,18 Z" fill="#4d7a25" />
      <path d="M14,28 Q2,38 1,31 Q2,22 12,24 Z" fill="#4d7a25" />
      {/* Rear flippers */}
      <path d="M20,36 Q13,44 16,46 Q22,40 21,36 Z" fill="#4d7a25" />
      <path d="M36,36 Q43,44 40,46 Q34,40 35,36 Z" fill="#4d7a25" />
      {/* Shell base */}
      <ellipse cx="28" cy="21" rx="20" ry="15" fill="#3d7a22" />
      {/* Shell highlight */}
      <ellipse cx="26" cy="18" rx="10" ry="7" fill="rgba(255,255,255,0.08)" />
      {/* Scute pattern */}
      <ellipse cx="28" cy="21" rx="11" ry="8" fill="#2d6418" />
      <line x1="28" y1="6"  x2="28" y2="36" stroke="#4aaa2d" strokeWidth="1.2" />
      <line x1="8"  y1="21" x2="48" y2="21" stroke="#4aaa2d" strokeWidth="1.2" />
      <path d="M8,21 L20,9"   stroke="#4aaa2d" strokeWidth="0.9" fill="none" />
      <path d="M48,21 L36,9"  stroke="#4aaa2d" strokeWidth="0.9" fill="none" />
      <path d="M8,21 L20,33"  stroke="#4aaa2d" strokeWidth="0.9" fill="none" />
      <path d="M48,21 L36,33" stroke="#4aaa2d" strokeWidth="0.9" fill="none" />
      {/* Head */}
      <ellipse cx="50" cy="20" rx="7" ry="5.5" fill="#4d7a25" />
      <ellipse cx="48" cy="18" rx="3" ry="2" fill="rgba(255,255,255,0.08)" />
      {/* Eye */}
      <circle cx="54" cy="18" r="2.2" fill="#1a2a08" />
      <circle cx="54.8" cy="17.2" r="0.9" fill="white" opacity="0.8" />
    </g>
  )
}

// ── Component ──────────────────────────────────────────────────────────

export function DeepCreature({ theme }) {
  const wrapperRef = useRef(null)
  const mouseRef   = useMouse()
  const themeRef   = useRef(theme)
  const s          = useRef(null)

  useEffect(() => { themeRef.current = theme }, [theme])

  if (!s.current) {
    const W = typeof window !== 'undefined' ? window.innerWidth  : 1200
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    s.current = {
      t: 0,
      // jellyfish state (deep sea)
      jellyX:     W * (0.3 + Math.random() * 0.4),
      jellyY:     H * 0.65,
      // turtle state (shallow reef)
      turtleRawX: W * 0.6,
      turtleX:    W * 0.6,
      turtleDir:  -1,
      turtleBaseY: H * 0.6,
      // flee (shared)
      fleeX: 0, fleeY: 0,
      prevFleeX: 0,
      prevTurtleX: W * 0.6,
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
        // ── Jellyfish: float upward, gentle horizontal sway ──────────
        p.jellyY -= 0.26
        p.jellyX += Math.sin(p.t * 0.006) * 0.3

        // Reset to bottom when fully off-screen top
        if (p.jellyY < -(BOX_H + 20)) {
          p.jellyY   = H + BOX_H + 20
          p.jellyX   = W * (0.15 + Math.random() * 0.7)
        }

        // Keep horizontal within bounds
        p.jellyX = Math.max(BOX_W, Math.min(W - BOX_W, p.jellyX))

        pathX = p.jellyX
        pathY = p.jellyY
      } else {
        // ── Turtle: slow horizontal swim ─────────────────────────────
        p.turtleRawX += 0.28 * p.turtleDir
        p.turtleX     = ((p.turtleRawX % W) + W) % W
        pathY         = p.turtleBaseY + Math.sin(p.t * 0.005) * 48
        pathX         = p.turtleX
      }

      // ── Flee (same for both) ─────────────────────────────────────
      const cx   = pathX + p.fleeX
      const cy   = pathY + p.fleeY
      const dx   = mouseRef.current.x - cx
      const dy   = mouseRef.current.y - cy
      const dist = Math.hypot(dx, dy)

      if (dist < 120 && dist > 0) {
        const str = ((120 - dist) / 120) * 2.8
        p.fleeX -= (dx / dist) * str
        p.fleeY -= (dy / dist) * str
      }

      p.fleeX *= 0.955
      p.fleeY *= 0.955
      p.fleeX = Math.max(-180, Math.min(180, p.fleeX))
      p.fleeY = Math.max(-140, Math.min(140, p.fleeY))

      const newX = pathX + p.fleeX
      const newY = pathY + p.fleeY

      // ── Facing (turtle only — jellyfish doesn't flip) ────────────
      let facing = 1
      if (td !== 'deep-sea') {
        const rawVx  = Math.abs(p.turtleX - p.prevTurtleX) < W / 2
          ? p.turtleX - p.prevTurtleX
          : p.turtleDir * 0.28
        const totalVx = rawVx + (p.fleeX - p.prevFleeX)
        facing = totalVx >= 0 ? 1 : -1
      }

      p.prevTurtleX = p.turtleX
      p.prevFleeX   = p.fleeX

      // ── DOM update ───────────────────────────────────────────────
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

  const isDeepSea = theme === 'deep-sea'

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: 0, left: 0,
        width: BOX_W,
        height: BOX_H,
        willChange: 'transform',
        pointerEvents: 'none',
      }}
    >
      <svg
        width={BOX_W}
        height={BOX_H}
        viewBox={`0 0 ${BOX_W} ${BOX_H}`}
        overflow="visible"
        style={{ display: 'block' }}
      >
        <defs>
          <filter id="jelly-glow" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Jellyfish — deep sea */}
        <g opacity={isDeepSea ? 1 : 0} style={{ transition: 'opacity 0.85s' }}>
          <JellyfishSvg />
        </g>

        {/* Sea turtle — shallow reef */}
        <g opacity={isDeepSea ? 0 : 1} style={{ transition: 'opacity 0.85s' }}>
          <SeaTurtleSvg />
        </g>
      </svg>
    </div>
  )
}
