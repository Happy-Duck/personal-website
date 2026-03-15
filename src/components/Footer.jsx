import { useEffect, useRef } from 'react'
import { useMouse } from '../context/MouseContext'
import { HydrothermalVent } from './creatures/HydrothermalVent'

// ── Dimensions ─────────────────────────────────────────────────────────

const CRAB_W = 64
const CRAB_H = 46

// ── Crab SVG ───────────────────────────────────────────────────────────
// Top-down view. Colors driven by CSS vars so theme cross-fades work.

function CrabSVG() {
  return (
    <svg
      width={CRAB_W}
      height={CRAB_H}
      viewBox="0 0 64 46"
      xmlns="http://www.w3.org/2000/svg"
      className="crab-svg crab-scuttle"
      aria-hidden="true"
    >
      {/* ── Walking legs — left ── */}
      <path d="M21 23 L9 29 L7 37"   className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M20 28 L8 33 L6 42"   className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M22 33 L12 38 L13 44" className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Walking legs — right ── */}
      <path d="M43 23 L55 29 L57 37"   className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M44 28 L56 33 L58 42"   className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M42 33 L52 38 L51 44"   className="crab-leg" fill="none" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />

      {/* ── Left claw ── */}
      <path
        d="M19 20 C13 17 5 13 5 8 C5 4 9 4 11 7 C13 10 15 14 18 17Z"
        className="crab-body" strokeWidth="1.2" strokeLinejoin="round"
      />
      <path
        d="M19 22 C12 22 5 25 5 20 C5 17 9 17 11 19 C13 21 16 21 18 20Z"
        className="crab-claw" strokeWidth="1" strokeLinejoin="round"
      />

      {/* ── Right claw ── */}
      <path
        d="M45 20 C51 17 59 13 59 8 C59 4 55 4 53 7 C51 10 49 14 46 17Z"
        className="crab-body" strokeWidth="1.2" strokeLinejoin="round"
      />
      <path
        d="M45 22 C52 22 59 25 59 20 C59 17 55 17 53 19 C51 21 48 21 46 20Z"
        className="crab-claw" strokeWidth="1" strokeLinejoin="round"
      />

      {/* ── Carapace (main body) ── */}
      <ellipse cx="32" cy="27" rx="16" ry="13" className="crab-body" />

      {/* Shell ridges */}
      <path d="M22 20 Q32 16 42 20" className="crab-ridge" fill="none" strokeWidth="1" strokeLinecap="round" />
      <path d="M20 26 Q32 22 44 26" className="crab-ridge" fill="none" strokeWidth="0.8" strokeLinecap="round" />

      {/* ── Eye stalks + eyes ── */}
      <line x1="27" y1="17" x2="24" y2="12" className="crab-leg" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="23.5" cy="11" r="3.2" fill="white" />
      <circle cx="24"   cy="10.5" r="1.6" fill="#111" />
      <circle cx="24.5" cy="10"   r="0.5" fill="white" />

      <line x1="37" y1="17" x2="40" y2="12" className="crab-leg" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="40.5" cy="11" r="3.2" fill="white" />
      <circle cx="40"   cy="10.5" r="1.6" fill="#111" />
      <circle cx="40.5" cy="10"   r="0.5" fill="white" />
    </svg>
  )
}

// ── Crab movement ──────────────────────────────────────────────────────

function Crab() {
  const outerRef = useRef(null)   // translateX — position
  const innerRef = useRef(null)   // scaleX    — facing direction
  const mouseRef = useMouse()

  useEffect(() => {
    const outer = outerRef.current
    const inner = innerRef.current
    if (!outer || !inner) return

    const floorEl = outer.parentElement
    let floorW    = floorEl ? floorEl.clientWidth : window.innerWidth

    const onResize = () => {
      floorW = floorEl ? floorEl.clientWidth : window.innerWidth
    }
    window.addEventListener('resize', onResize, { passive: true })

    // Track floor's top-of-viewport Y so we can compute flee distance
    // without triggering layout in the hot rAF loop.
    let floorScreenY = floorEl ? floorEl.getBoundingClientRect().top : 0
    const onScroll = () => {
      floorScreenY = floorEl ? floorEl.getBoundingClientRect().top : 0
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll,  { passive: true })

    let x       = floorW * 0.4    // start 40% from left
    let vx      = 0.38            // slow rightward drift
    let fleeX   = 0
    let facing  = 1               // 1 = right, -1 = left
    let rafId

    const tick = () => {
      const mouse = mouseRef.current

      // Crab centre in screen space
      const cx = x + CRAB_W / 2
      const cy = floorScreenY + 40   // approximate mid-height in floor zone

      // Flee
      const dx   = cx - mouse.x
      const dy   = cy - mouse.y
      const dist = Math.sqrt(dx * dx + dy * dy)
      if (dist < 150 && dist > 0) {
        fleeX += (dx / dist) * ((150 - dist) / 150) * 6.5
      }
      fleeX *= 0.90

      // Move + clamp
      x = Math.max(0, Math.min(floorW - CRAB_W, x + vx + fleeX))

      // Bounce at walls
      if (x <= 0)             vx =  Math.abs(vx)
      if (x >= floorW - CRAB_W) vx = -Math.abs(vx)

      // Facing
      const totalVx = vx + fleeX
      if (Math.abs(totalVx) > 0.08) facing = totalVx > 0 ? 1 : -1

      outer.style.transform = `translateX(${x}px)`
      inner.style.transform = `scaleX(${facing})`

      rafId = requestAnimationFrame(tick)
    }

    tick()
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [mouseRef])

  return (
    /* outer: position  |  inner: flip  |  SVG: scuttle animation */
    <div
      ref={outerRef}
      style={{ position: 'absolute', bottom: '28px', left: 0, willChange: 'transform' }}
    >
      <div ref={innerRef} style={{ transformOrigin: `${CRAB_W / 2}px ${CRAB_H / 2}px` }}>
        <CrabSVG />
      </div>
    </div>
  )
}

// ── Footer ─────────────────────────────────────────────────────────────

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="footer-wrap" style={{ zIndex: 10, position: 'relative' }}>

      {/* Ocean floor — sandy/rocky texture, crab + credits + vent live here */}
      <div className="footer-floor">
        <HydrothermalVent />
        <Crab />
        <span className="footer-credit-text font-mono text-xs tracking-[0.18em]">
          Built by Rishi Garhyan&ensp;·&ensp;{year}
        </span>
      </div>

    </footer>
  )
}
