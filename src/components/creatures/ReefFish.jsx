// ── Reef Fish — Sunlit Zone (0.0 → 0.20) ─────────────────────────────
// Small tropical clownfish. 3 instances at different lanes.
import { useCreatureAI } from '../../hooks/useCreatureAI'

const W = 40, H = 22

const CONFIGS = [
  { centerYFrac: 0.18, speed: 0.60, amplitude: 32, freq: 0.008, dir:  1, scale: 1.00 },
  { centerYFrac: 0.30, speed: 0.42, amplitude: 22, freq: 0.010, dir: -1, scale: 0.85 },
  { centerYFrac: 0.24, speed: 0.55, amplitude: 38, freq: 0.006, dir:  1, scale: 1.10 },
]

const DEPTH_RANGE = { enter: 0.00, exit: 0.16 }

function FishSVG({ scale = 1 }) {
  const s = scale
  return (
    <svg width={W * s} height={H * s} viewBox={`0 0 ${W} ${H}`}
      overflow="visible" style={{ display: 'block' }}>
      {/* Fan tail */}
      <path d={`M0,3 L9,11 L0,19 Z`} fill="#e05010" />
      <path d={`M0,3 Q4,7 9,11`}  fill="none" stroke="#b83800" strokeWidth="0.7" opacity="0.6" />
      <path d={`M0,19 Q4,15 9,11`} fill="none" stroke="#b83800" strokeWidth="0.7" opacity="0.6" />
      {/* Body */}
      <ellipse cx="24" cy="11" rx="15" ry="9" fill="#ff6318" />
      {/* White mid band */}
      <ellipse cx="19" cy="11" rx="3.8" ry="9" fill="white" opacity="0.88" />
      {/* White head band */}
      <ellipse cx="32" cy="11" rx="2.5" ry="6.5" fill="white" opacity="0.62" />
      {/* Outline */}
      <ellipse cx="24" cy="11" rx="15" ry="9" fill="none" stroke="#1a0600" strokeWidth="1.1" opacity="0.25" />
      {/* Dorsal fin */}
      <path d={`M15,7 Q20,1 27,5 L25,7 Z`} fill="#ff7722" stroke="#b83800" strokeWidth="0.6" />
      {/* Pectoral fin */}
      <ellipse cx="21" cy="16" rx="4.5" ry="2" fill="#e05010" transform="rotate(-20 21 16)" />
      {/* Eye */}
      <circle cx="34" cy="9"   r="2.5" fill="#0d0400" />
      <circle cx="34.5" cy="8.3" r="1.1" fill="white" opacity="0.9" />
      <circle cx="34.9" cy="8.0" r="0.5" fill="#0d0400" />
    </svg>
  )
}

function SingleFish({ cfg, idx }) {
  const { wrapperRef } = useCreatureAI({
    W_SVG: W * cfg.scale, H_SVG: H * cfg.scale,
    centerYFrac: cfg.centerYFrac,
    speed:       cfg.speed,
    amplitude:   cfg.amplitude,
    freq:        cfg.freq,
    dir:         cfg.dir,
    depthRange:  DEPTH_RANGE,
    fleeRadius:  110,
  })

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'absolute', top: 0, left: 0,
        willChange: 'transform', pointerEvents: 'none',
      }}
    >
      <FishSVG scale={cfg.scale} />
    </div>
  )
}

export function ReefFish() {
  return (
    <>
      {CONFIGS.map((cfg, i) => <SingleFish key={i} cfg={cfg} idx={i} />)}
    </>
  )
}
