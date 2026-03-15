// ── Water Surface — underwater perspective at the top of the viewport ─
// You're below the surface. Waves ripple across the top. Sunlight filters down.
// Fades out as you descend (--beach-op driven by OceanDepthContext).
// Pure CSS/SVG — same seamless wave loop trick as before.

// Two full sine cycles → translateX(-50%) = exactly 1 cycle = infinite seamless loop
const WAVE_1 = 'M 0 45 C 200 5,  400 5,  600 45 C 800 85, 1000 85, 1200 45 C 1400 5,  1600 5,  1800 45 C 2000 85, 2200 85, 2400 45 V 0 H 0 Z'
const WAVE_2 = 'M 0 45 C 200 18, 400 18, 600 45 C 800 72, 1000 72, 1200 45 C 1400 18, 1600 18, 1800 45 C 2000 72, 2200 72, 2400 45 V 0 H 0 Z'
const WAVE_3 = 'M 0 45 C 200 28, 400 28, 600 45 C 800 62, 1000 62, 1200 45 C 1400 28, 1600 28, 1800 45 C 2000 62, 2200 62, 2400 45 V 0 H 0 Z'

export function WaterSurface() {
  return (
    <div className="water-surface" aria-hidden="true">

      {/* Sunlight glow from above — bright band at very top */}
      <div className="water-surface-glow" />

      {/* Animated surface ripples — seen from below */}
      <div className="water-surface-waves">
        <svg className="beach-wave beach-wave-1" viewBox="0 0 2400 90"
          preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_1} />
        </svg>
        <svg className="beach-wave beach-wave-2" viewBox="0 0 2400 90"
          preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_2} />
        </svg>
        <svg className="beach-wave beach-wave-3" viewBox="0 0 2400 90"
          preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_3} />
        </svg>
      </div>

    </div>
  )
}
