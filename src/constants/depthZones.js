// ── Ocean depth zone definitions ──────────────────────────────────────
// All depths are normalized 0.0 (surface) → 1.0 (abyss floor)
// depthMeters: Math.round(depth * 6000)

export const DEPTH_ZONES = {
  SUNLIT:   { min: 0.00, max: 0.20, label: 'Sunlit Zone',   meters: '0–200m'      },
  TWILIGHT: { min: 0.20, max: 0.50, label: 'Twilight Zone', meters: '200–1000m'   },
  MIDNIGHT: { min: 0.50, max: 0.72, label: 'Midnight Zone', meters: '1000–4000m'  },
  ABYSSAL:  { min: 0.72, max: 1.00, label: 'Abyssal Zone',  meters: '4000–6000m'  },
}

export function getZone(depth) {
  for (const [key, zone] of Object.entries(DEPTH_ZONES)) {
    if (depth >= zone.min && depth < zone.max) return { key, ...zone }
  }
  return { key: 'ABYSSAL', ...DEPTH_ZONES.ABYSSAL }
}

// Smooth ease-in-out for opacity ramps
export function easeInOut(t) {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c
}

// Compute creature opacity from depth + depthRange
// Creatures stay at full opacity (1) throughout their zone.
// Only brief fade-in/fade-out at the boundaries (FADE depth units each).
const FADE = 0.025
export function creatureOpacity(depth, range) {
  const { enter, exit } = range
  if (depth <= enter || depth >= exit) return 0
  if (depth < enter + FADE) return easeInOut((depth - enter) / FADE)
  if (depth > exit  - FADE) return easeInOut((exit - depth)  / FADE)
  return 1
}
