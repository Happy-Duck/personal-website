// ── Sea Turtle — Sunlit Zone (0.0 → 0.18) ────────────────────────────
// Large, slow, majestic. High flee threshold.
import { useCreatureAI } from '../../hooks/useCreatureAI'

const W = 88, H = 64

const DEPTH_RANGE = { enter: 0.00, peak: 0.03, exit: 0.18 }

function TurtleSVG() {
  return (
    <svg width={W} height={H} viewBox="0 0 88 64"
      overflow="visible" style={{ display: 'block' }}>

      {/* Front left flipper */}
      <ellipse cx="18" cy="22" rx="12" ry="5" fill="#2e6845"
        transform="rotate(-35 18 22)" />
      {/* Front right flipper */}
      <ellipse cx="70" cy="22" rx="12" ry="5" fill="#2e6845"
        transform="rotate(35 70 22)" />
      {/* Rear left flipper */}
      <ellipse cx="22" cy="50" rx="9" ry="4" fill="#2e6845"
        transform="rotate(30 22 50)" />
      {/* Rear right flipper */}
      <ellipse cx="66" cy="50" rx="9" ry="4" fill="#2e6845"
        transform="rotate(-30 66 50)" />

      {/* Shell — outer */}
      <ellipse cx="44" cy="35" rx="26" ry="22" fill="#3a7a4a" />
      {/* Shell — inner highlight */}
      <ellipse cx="44" cy="34" rx="20" ry="16" fill="#4a9060" />
      {/* Shell pattern — scutes */}
      <path d="M44,18 L32,28 L38,44 L44,46 L50,44 L56,28 Z"
        fill="none" stroke="#2e6845" strokeWidth="1.2" opacity="0.6" />
      <path d="M32,28 L20,30 M56,28 L68,30" fill="none" stroke="#2e6845" strokeWidth="1" opacity="0.5" />
      <path d="M38,44 L30,54 M50,44 L58,54" fill="none" stroke="#2e6845" strokeWidth="1" opacity="0.5" />
      {/* Shell sheen */}
      <ellipse cx="38" cy="26" rx="8" ry="5" fill="rgba(180,255,180,0.18)" transform="rotate(-15 38 26)" />

      {/* Head */}
      <ellipse cx="44" cy="12" rx="9" ry="8" fill="#3a7a4a" />
      {/* Head highlight */}
      <ellipse cx="42" cy="10" rx="4" ry="3" fill="rgba(180,255,180,0.18)" />
      {/* Eyes */}
      <circle cx="39" cy="10" r="2.2" fill="#0d2a10" />
      <circle cx="39.6" cy="9.3" r="0.9" fill="rgba(255,255,255,0.7)" />
      <circle cx="49" cy="10" r="2.2" fill="#0d2a10" />
      <circle cx="49.6" cy="9.3" r="0.9" fill="rgba(255,255,255,0.7)" />
      {/* Mouth */}
      <path d="M40,14 Q44,16 48,14" fill="none" stroke="#2e6845" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

export function SeaTurtle() {
  const { wrapperRef } = useCreatureAI({
    W_SVG: W, H_SVG: H,
    centerYFrac: 0.28,
    speed:       0.18,
    amplitude:   28,
    freq:        0.004,
    dir:         -1,
    depthRange:  DEPTH_RANGE,
    fleeRadius:  200,
  })

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        willChange: 'transform', pointerEvents: 'none',
      }}
    >
      <TurtleSVG />
    </div>
  )
}
