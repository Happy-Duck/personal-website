// ── Deep Sea Fish — Midnight Zone (0.30 → 0.65) ──────────────────────
// Two instances. Dark navy, bioluminescent lateral stripe.
import { useCreatureAI } from '../../hooks/useCreatureAI'

const W = 50, H = 26

const CONFIGS = [
  { centerYFrac: 0.40, speed: 0.55, amplitude: 38, freq: 0.007, dir:  1 },
  { centerYFrac: 0.62, speed: 0.40, amplitude: 28, freq: 0.009, dir: -1 },
]

const DEPTH_RANGE = { enter: 0.30, exit: 0.62 }

function DeepFishSVG({ filterId }) {
  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`}
      overflow="visible" style={{ display: 'block' }}>
      <defs>
        <filter id={filterId} x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="1.8" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Tail */}
      <path d="M0,3 L10,13 L0,23 Z" fill="#071428" />
      {/* Body */}
      <ellipse cx="28" cy="13" rx="19" ry="9.5" fill="#0d2040" />
      {/* Dorsal fin */}
      <path d="M17,8 Q23,2 32,6 Z" fill="#091530" />
      {/* Pectoral fin */}
      <ellipse cx="22" cy="18" rx="5.5" ry="2.5" fill="#091530" transform="rotate(-20 22 18)" />
      {/* Bioluminescent lateral stripe — pulses */}
      <path d="M14,13 Q24,10 36,13"
        stroke="rgba(0,210,255,0.65)" strokeWidth="1.4" fill="none"
        filter={`url(#${filterId})`} className="bio-pulse" />
      {/* Bio dots */}
      <circle cx="15" cy="13" r="1.4" fill="#00ffee" filter={`url(#${filterId})`} className="bio-pulse" opacity="0.9" />
      <circle cx="23" cy="11" r="1.1" fill="#00aaff" filter={`url(#${filterId})`} className="bio-pulse"
        style={{ animationDelay: '-0.6s' }} opacity="0.85" />
      <circle cx="31" cy="13" r="1.4" fill="#00ffee" filter={`url(#${filterId})`} className="bio-pulse"
        style={{ animationDelay: '-1.2s' }} opacity="0.9" />
      {/* Eye */}
      <circle cx="41" cy="11" r="2.6" fill="#001422" />
      <circle cx="41.8" cy="10.2" r="1.1" fill="#00d4ff" />
    </svg>
  )
}

function SingleDeepFish({ cfg, idx }) {
  const { wrapperRef } = useCreatureAI({
    W_SVG: W, H_SVG: H,
    centerYFrac: cfg.centerYFrac,
    speed:       cfg.speed,
    amplitude:   cfg.amplitude,
    freq:        cfg.freq,
    dir:         cfg.dir,
    depthRange:  DEPTH_RANGE,
    fleeRadius:  130,
  })

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <DeepFishSVG filterId={`deep-fish-${idx}`} />
    </div>
  )
}

export function DeepSeaFish() {
  return (
    <>
      {CONFIGS.map((cfg, i) => <SingleDeepFish key={i} cfg={cfg} idx={i} />)}
    </>
  )
}
