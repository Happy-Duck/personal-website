// ── Ocean depth zone definitions ──────────────────────────────────────
// All depths are normalized 0.0 (surface) → 1.0 (hadal trench)
// depthMeters: Math.round(depth * 11000)

export const DEPTH_ZONES = {
  SUNLIT:   { min: 0.00, max: 0.15, label: 'Sunlit Zone',   meters: '0–200m'      },
  TWILIGHT: { min: 0.15, max: 0.35, label: 'Twilight Zone', meters: '200–1000m'   },
  MIDNIGHT: { min: 0.35, max: 0.60, label: 'Midnight Zone', meters: '1000–4000m'  },
  ABYSSAL:  { min: 0.60, max: 0.85, label: 'Abyssal Zone',  meters: '4000–6000m'  },
  HADAL:    { min: 0.85, max: 1.00, label: 'Hadal Zone',    meters: '6000–11000m' },
}

export function getZone(depth) {
  for (const [key, zone] of Object.entries(DEPTH_ZONES)) {
    if (depth >= zone.min && depth < zone.max) return { key, ...zone }
  }
  return { key: 'HADAL', ...DEPTH_ZONES.HADAL }
}

// Smooth ease-in-out for opacity ramps
export function easeInOut(t) {
  const c = Math.max(0, Math.min(1, t))
  return c < 0.5 ? 2 * c * c : -1 + (4 - 2 * c) * c
}

// Compute creature opacity from depth + depthRange
export function creatureOpacity(depth, range) {
  const { enter, peak, exit } = range
  if (depth <= enter || depth >= exit) return 0
  if (depth < peak) return easeInOut((depth - enter) / (peak - enter))
  return easeInOut(1 - (depth - peak) / (exit - peak))
}
