// ── Beach scene — shallow reef light mode background ───────────────────
// Pure CSS/SVG. Zero JS animation. Zero canvas.
// Animated elements (≤ 5): wave-1, wave-2, wave-3, foam — all transform/opacity only.
//
// Seamless wave loop trick:
//   SVG width = 200% of container (= 200vw)
//   Path describes exactly 2 wave cycles across that width
//   translateX(-50%) moves exactly 1 cycle → end state = start state → infinite seamless

// Two full sine-wave cycles. Amplitude varies per wave for depth layering.
const WAVE_DEEP   = 'M 0 45 C 200 5,  400 5,  600 45 C 800 85, 1000 85, 1200 45 C 1400 5,  1600 5,  1800 45 C 2000 85, 2200 85, 2400 45 V 90 H 0 Z'
const WAVE_MID    = 'M 0 45 C 200 18, 400 18, 600 45 C 800 72, 1000 72, 1200 45 C 1400 18, 1600 18, 1800 45 C 2000 72, 2200 72, 2400 45 V 90 H 0 Z'
const WAVE_SHALLOW= 'M 0 45 C 200 28, 400 28, 600 45 C 800 62, 1000 62, 1200 45 C 1400 28, 1600 28, 1800 45 C 2000 62, 2200 62, 2400 45 V 90 H 0 Z'

export function BeachScene() {
  return (
    <div className="beach-scene" aria-hidden="true">

      {/* Sky: warm late-afternoon gradient, blue → peach → amber at horizon */}
      <div className="beach-sky" />

      {/* Ocean band: deep turquoise sitting in the middle distance */}
      <div className="beach-ocean" />

      {/* Wave zone: 3 SVG waves translating left, edge-masked for natural fade */}
      <div className="beach-wave-zone">
        <svg className="beach-wave beach-wave-1" viewBox="0 0 2400 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_DEEP} />
        </svg>
        <svg className="beach-wave beach-wave-2" viewBox="0 0 2400 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_MID} />
        </svg>
        <svg className="beach-wave beach-wave-3" viewBox="0 0 2400 90" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path d={WAVE_SHALLOW} />
        </svg>
      </div>

      {/* Foam: thin line at wave break, opacity pulses */}
      <div className="beach-foam" />

      {/* Sand: warm gradient occupying the lower portion of the viewport */}
      <div className="beach-sand" />

    </div>
  )
}
