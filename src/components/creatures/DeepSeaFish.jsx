// ── Deep Sea Fish — Midnight Zone (0.30 → 0.65) ──────────────────────
// Two instances. Dark navy, bioluminescent lateral stripe.
import { useRef } from 'react'
import { useCreatureAI } from '../../hooks/useCreatureAI'

const W = 120, H = 50

const CONFIGS = [
  { centerYFrac: 0.40, speed: 0.55, amplitude: 38, freq: 0.007, dir:  1 },
  { centerYFrac: 0.62, speed: 0.40, amplitude: 28, freq: 0.009, dir: -1 },
]

const DEPTH_RANGE = { enter: 0.30, exit: 0.62 }

function SingleDeepFish({ cfg, idx, peers }) {
  const { wrapperRef } = useCreatureAI({
    W_SVG: W, H_SVG: H,
    centerYFrac: cfg.centerYFrac,
    speed:       cfg.speed,
    amplitude:   cfg.amplitude,
    freq:        cfg.freq,
    dir:         cfg.dir,
    depthRange:  DEPTH_RANGE,
    fleeRadius:  130,
    peers,
    peerIndex:   idx,
  })

  return (
    <div
      ref={wrapperRef}
      style={{ position: 'absolute', top: 0, left: 0, willChange: 'transform', pointerEvents: 'none' }}
    >
      <img src="/creatures/deepSeaFish.webp" alt="" width={W} height={H} style={{ display: 'block', transform: 'scaleX(-1) rotate(-15deg)' }} draggable={false} />
    </div>
  )
}

export function DeepSeaFish() {
  const peers = useRef(CONFIGS.map(() => null))
  return (
    <>
      {CONFIGS.map((cfg, i) => <SingleDeepFish key={i} cfg={cfg} idx={i} peers={peers} />)}
    </>
  )
}
