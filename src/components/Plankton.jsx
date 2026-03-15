// ── Plankton — CSS-only, shallow-zone particles ───────────────────────
// Tiny green/yellow particles drifting upward. Visible at depth < 0.30.
// Opacity driven by --plankton-opacity CSS var set in OceanDepthContext.
import { useMemo } from 'react'

const PARTICLE_COUNT = 28

export function Plankton() {
  const particles = useMemo(() =>
    Array.from({ length: PARTICLE_COUNT }, (_, i) => {
      const shade = Math.random()
      return {
        id:       i,
        left:     Math.random() * 100,
        size:     Math.random() * 2.0 + 0.5,
        duration: Math.random() * 11 + 7,
        delay:    -(Math.random() * 18),
        opacity:  Math.random() * 0.35 + 0.15,
        color:    shade < 0.4
          ? `rgba(80,200,100,`    // green
          : shade < 0.7
          ? `rgba(120,210,80,`    // yellow-green
          : `rgba(160,220,120,`,  // light green
      }
    })
  , [])

  return (
    <div className="plankton-wrap" aria-hidden="true">
      {particles.map(p => (
        <div
          key={p.id}
          className="plankton-particle"
          style={{
            left:              `${p.left}vw`,
            width:             p.size,
            height:            p.size,
            background:        `${p.color}${p.opacity})`,
            animationDuration: `${p.duration}s`,
            animationDelay:    `${p.delay}s`,
          }}
        />
      ))}
    </div>
  )
}
