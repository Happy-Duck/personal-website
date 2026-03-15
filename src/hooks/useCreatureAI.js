// ── useCreatureAI — horizontal sinusoidal swimmer with mouse flee ─────
// Subscribes to OceanDepthContext's single rAF loop.
// Updates wrapperRef.current.style.transform (translate) directly.
// Updates innerRef.current.style.transform (scaleX for facing) if provided.

import { useEffect, useRef } from 'react'
import { useMouse } from '../context/MouseContext'
import { useOceanDepthContext } from '../context/OceanDepthContext'
import { creatureOpacity } from '../constants/depthZones'

export function useCreatureAI({
  W_SVG       = 50,
  H_SVG       = 24,
  centerYFrac = 0.5,
  speed       = 0.5,
  amplitude   = 40,
  freq        = 0.007,
  dir         = 1,          // 1 = moves right, -1 = moves left
  depthRange,               // { enter, peak, exit }
  fleeRadius  = 130,
}) {
  const wrapperRef = useRef(null)
  const innerRef   = useRef(null)
  const mouseRef   = useMouse()
  const { subscribe } = useOceanDepthContext()
  const isMobile   = useRef(false)

  // Persistent animation state (outside React state to avoid re-renders)
  const s = useRef(null)
  if (!s.current) {
    const W = typeof window !== 'undefined' ? window.innerWidth  : 1200
    const H = typeof window !== 'undefined' ? window.innerHeight : 800
    s.current = {
      t:          Math.random() * 6000,
      pathRawX:   Math.random() * W,
      pathX:      Math.random() * W,
      fleeX:      0,
      fleeY:      0,
      fleeing:    false,
      baseY:      H * centerYFrac,
    }
  }

  useEffect(() => {
    isMobile.current = window.matchMedia('(pointer: coarse)').matches

    const unsubscribe = subscribe((depth) => {
      const opacity = creatureOpacity(depth, depthRange)
      const el = wrapperRef.current
      if (!el) return

      // Skip position updates when invisible
      if (opacity < 0.01) {
        el.style.opacity = '0'
        return
      }

      const W = window.innerWidth
      const H = window.innerHeight
      const p = s.current

      p.t         += 1
      p.pathRawX  += speed * dir
      p.pathX      = ((p.pathRawX % W) + W) % W

      const pathY = p.baseY + Math.sin(p.t * freq) * amplitude

      // Mouse flee
      if (!isMobile.current) {
        const mx   = mouseRef.current.x
        const my   = mouseRef.current.y
        const cx   = p.pathX + p.fleeX
        const cy   = pathY   + p.fleeY
        const dx   = mx - cx
        const dy   = my - cy
        const dist = Math.hypot(dx, dy)
        const hyst = p.fleeing ? fleeRadius + 60 : fleeRadius

        if (dist < fleeRadius && dist > 0) {
          p.fleeing = true
          const str = ((fleeRadius - dist) / fleeRadius) * 3.5
          // Lerp flee vector toward away-direction (lerp factor 0.18 when fleeing)
          const targetFleeX = -(dx / dist) * str * 40
          const targetFleeY = -(dy / dist) * str * 30
          p.fleeX += (targetFleeX - p.fleeX) * 0.18
          p.fleeY += (targetFleeY - p.fleeY) * 0.18
        } else if (dist > hyst) {
          p.fleeing = false
          // Ease back to path (lerp factor 0.06)
          p.fleeX += (0 - p.fleeX) * 0.06
          p.fleeY += (0 - p.fleeY) * 0.06
        }

        p.fleeX = Math.max(-220, Math.min(220, p.fleeX))
        p.fleeY = Math.max(-160, Math.min(160, p.fleeY))
      }

      const newX = p.pathX + p.fleeX
      const newY = Math.max(20, Math.min(H - 20, pathY + p.fleeY))

      el.style.transform = dir === 1
        ? `translate(${newX - W_SVG / 2}px, ${newY - H_SVG / 2}px)`
        : `translate(${newX + W_SVG / 2}px, ${newY - H_SVG / 2}px) scaleX(-1)`
      el.style.opacity = opacity.toFixed(3)

      // Inner flip for creatures that need separate scaleX (optional)
      if (innerRef.current) {
        innerRef.current.style.transform = `scaleX(${dir})`
      }
    })

    return unsubscribe
  }, [subscribe, depthRange, speed, dir, freq, amplitude, centerYFrac, fleeRadius, W_SVG, H_SVG])

  return { wrapperRef, innerRef }
}
