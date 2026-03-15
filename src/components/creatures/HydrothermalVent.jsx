// ── Hydrothermal Vent — Hadal Zone ────────────────────────────────────
// Static chimney at bottom of viewport. CSS particle plume rising.
// Only visible when depth > 0.80.
import { useMemo } from 'react'
import { useOceanDepthContext } from '../../context/OceanDepthContext'

const PARTICLE_COUNT = 14

function VentSVG() {
  return (
    <svg width="54" height="88" viewBox="0 0 54 88"
      overflow="visible" style={{ display: 'block' }}>
      {/* Base glow */}
      <ellipse cx="27" cy="82" rx="28" ry="8"
        fill="rgba(255,80,20,0.22)" />

      {/* Chimney stack */}
      <path d="M12,88 L10,40 Q10,34 18,32 L36,32 Q44,34 44,40 L42,88 Z"
        fill="#1a1008" stroke="#2a1808" strokeWidth="1" />
      {/* Chimney highlight */}
      <path d="M12,88 L11,44 Q12,38 16,36 L18,36 Q16,40 15,88 Z"
        fill="rgba(60,30,10,0.40)" />

      {/* Chimney top opening */}
      <ellipse cx="27" cy="34" rx="10" ry="3"
        fill="#0e0804" stroke="#2a1808" strokeWidth="0.8" />

      {/* Warm base glow */}
      <ellipse cx="27" cy="80" rx="22" ry="6"
        fill="rgba(255,100,30,0.35)" />
      <ellipse cx="27" cy="80" rx="14" ry="3.5"
        fill="rgba(255,150,50,0.45)" />

      {/* Rock base */}
      <path d="M0,88 Q10,82 27,84 Q44,82 54,88 Z"
        fill="#120c04" />
    </svg>
  )
}

// CSS-only vent particles (no JS animation)
function VentParticles({ count }) {
  const particles = useMemo(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      left:     18 + (Math.random() - 0.5) * 18,
      duration: 1.8 + Math.random() * 1.4,
      delay:    -(Math.random() * 3),
      size:     2 + Math.random() * 3,
      opacity:  0.3 + Math.random() * 0.4,
    }))
  , [count])

  return (
    <>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position:        'absolute',
            bottom:          52,
            left:            p.left,
            width:           p.size,
            height:          p.size,
            borderRadius:    '50%',
            background:      `rgba(255,${120 + Math.round(p.opacity * 100)},40,${p.opacity})`,
            animationName:   'vent-rise',
            animationDuration: `${p.duration}s`,
            animationDelay:  `${p.delay}s`,
            animationTimingFunction: 'ease-out',
            animationIterationCount: 'infinite',
            pointerEvents:   'none',
          }}
        />
      ))}
    </>
  )
}

export function HydrothermalVent() {
  const { depthRef } = useOceanDepthContext()

  // Inline opacity transition driven by CSS var (no re-render)
  return (
    <div
      style={{
        position:   'fixed',
        bottom:     0,
        left:       '22%',
        zIndex:     3,
        pointerEvents: 'none',
        opacity:    'var(--vent-op, 0)',
        transition: 'opacity 1s ease',
      }}
    >
      {/* Vent opacity is driven by a CSS var set in OceanDepthContext — but
          since HydrothermalVent is always mounted, we use the depth context
          to set a local CSS var on this element via a className binding.
          Simpler: just use inline style with a CSS var that the depth provider sets. */}
      <div style={{ position: 'relative' }}>
        <VentParticles count={PARTICLE_COUNT} />
        <VentSVG />
      </div>
    </div>
  )
}
