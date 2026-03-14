import { useEffect, useRef } from 'react'

const PARTICLE_COUNT = 110

function createParticle(canvasWidth, canvasHeight, randomY = true) {
  const isBio = Math.random() < 0.18
  return {
    x:          Math.random() * canvasWidth,
    y:          randomY ? Math.random() * canvasHeight : -6,
    size:       Math.random() * 1.8 + 0.4,
    speed:      Math.random() * 0.35 + 0.1,
    opacity:    Math.random() * 0.55 + 0.15,
    drift:      (Math.random() - 0.5) * 0.25,
    wobble:     Math.random() * Math.PI * 2,
    wobbleSpeed: Math.random() * 0.018 + 0.004,
    isBio,
    color: isBio
      ? `rgba(${Math.random() > 0.5 ? '80,220,255' : '100,160,255'}, `
      : 'rgba(220,235,255, ',
  }
}

export function MarineSnow() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    let   rafId
    const particles = []

    const resize = () => {
      canvas.width  = window.innerWidth
      canvas.height = window.innerHeight
      particles.length = 0
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle(canvas.width, canvas.height, true))
      }
    }

    resize()
    window.addEventListener('resize', resize, { passive: true })

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (const p of particles) {
        p.y      += p.speed
        p.wobble += p.wobbleSpeed
        p.x      += p.drift + Math.sin(p.wobble) * 0.28

        if (p.y > canvas.height + 6) Object.assign(p, createParticle(canvas.width, canvas.height, false))
        if (p.x > canvas.width  + 4) p.x = -4
        if (p.x < -4)                p.x = canvas.width + 4

        if (p.isBio) {
          ctx.shadowBlur  = 6
          ctx.shadowColor = p.color.replace('rgba', 'rgb').replace(', ', ')').slice(0, -2) + ')'
        } else {
          ctx.shadowBlur = 0
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `${p.color}${p.opacity})`
        ctx.fill()
      }

      ctx.shadowBlur = 0
      rafId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
    }
  }, [])

  // Opacity controlled by CSS variable --marine-snow-op via .marine-snow class
  return (
    <canvas
      ref={canvasRef}
      className="marine-snow fixed inset-0 pointer-events-none"
      style={{ zIndex: 1 }}
    />
  )
}
