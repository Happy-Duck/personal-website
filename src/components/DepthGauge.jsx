// ── Depth Gauge — fixed right edge, scroll-triggered visibility ───────
// Hidden on mobile. Fades in on scroll, out after 1.8s inactivity.
// Opacity driven by CSS var --gauge-opacity (set by OceanDepthContext).
import { useOceanDepth } from '../hooks/useOceanDepth'

export function DepthGauge() {
  const { depth, depthMeters, zone } = useOceanDepth()
  const markerTop = Math.round(depth * 140)  // 0–140px track

  return (
    <div
      className="depth-gauge"
      style={{ opacity: 1 }}
      aria-hidden="true"
    >
      {/* Zone name */}
      <span className="depth-gauge-zone">{zone.label}</span>

      {/* Track + marker */}
      <div className="depth-gauge-track">
        <div
          className="depth-gauge-marker"
          style={{ top: markerTop }}
        />
      </div>

      {/* Depth in meters */}
      <span className="depth-gauge-meters">{depthMeters.toLocaleString()}m</span>
    </div>
  )
}
