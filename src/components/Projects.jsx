import { useRef } from 'react'
import { motion } from 'framer-motion'

// ── Data ───────────────────────────────────────────────────────────────

const FEATURED = {
  title:       'Pelagos: A Marine Adventure',
  description: 'A narrative-driven marine exploration game built entirely in Unity. Self-published on Steam and downloaded 30k+ times. Later adopted by schools across three states as an interactive environmental science teaching tool.',
  stack:       ['Unity', 'C#', 'Steam', 'Steamworks SDK'],
  stats:       ['30k+ downloads', 'Used in schools'],
  github:      '#',
}

const PROJECTS = [
  {
    title:       'Gust & Glory',
    description: "A puzzle Metroidvania built around wind mechanics and momentum-based traversal. Developed with UIUC's ACM GameBuilders club.",
    stack:       ['GameMaker Studio', 'GML'],
    github:      '#',
  },
  {
    title:       'SportsBot',
    description: 'Discord bot delivering live scores, player stats, and schedule alerts through a clean slash-command interface backed by REST sports APIs.',
    stack:       ['Python', 'discord.py', 'REST API'],
    github:      '#',
  },
  {
    title:       'Tide Toss',
    description: 'Physics-based local multiplayer game built in 48 hours for a game jam. Features wave simulation and realistic buoyancy mechanics.',
    stack:       ['Unity', 'C#', 'Physics2D'],
    github:      '#',
  },
  {
    title:       'Computer Vision Research',
    description: 'Benchmark comparison of Faster R-CNN (Detectron2) against YOLOv8 for real-time object detection on the COCO dataset. Analysed accuracy–latency tradeoffs.',
    stack:       ['Python', 'Detectron2', 'YOLOv8', 'COCO'],
    github:      '#',
  },
]

// ── Icons ──────────────────────────────────────────────────────────────

function GitHubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

// ── Animation variants ─────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 36 },
  show: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1], delay },
  }),
}

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const headerItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// ── Parallax card shell ────────────────────────────────────────────────
// Framer Motion handles scroll-in; direct DOM sets transform on mouse-move
// so the two never conflict (outer motion.div vs inner plain div).

function ParallaxCard({ children, featured = false, delay = 0 }) {
  const innerRef = useRef(null)

  const onMouseMove = (e) => {
    const el   = innerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx   = (e.clientX - rect.left  - rect.width  / 2) / (rect.width  / 2)
    const dy   = (e.clientY - rect.top   - rect.height / 2) / (rect.height / 2)
    const maxR = featured ? 3 : 4.5
    el.style.transform  = `perspective(900px) rotateX(${-dy * maxR}deg) rotateY(${dx * maxR}deg) translateY(-7px)`
    el.style.transition = 'transform 0.07s linear, box-shadow 0.07s linear'
  }

  const onMouseLeave = () => {
    const el = innerRef.current
    if (!el) return
    el.style.transform  = ''
    el.style.transition = 'transform 0.55s cubic-bezier(0.22,1,0.36,1), box-shadow 0.55s ease, border-color 0.55s ease'
  }

  return (
    <motion.div
      variants={fadeUp}
      custom={delay}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-60px' }}
    >
      <div
        ref={innerRef}
        className={`project-card h-full${featured ? ' project-card--featured' : ''}`}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </div>
    </motion.div>
  )
}

// ── Featured card ──────────────────────────────────────────────────────

function FeaturedCard({ project }) {
  return (
    <ParallaxCard featured>
      {/* All content sits above the ::before shimmer via z-index */}
      <div className="relative z-10 flex flex-col gap-4 h-full">

        {/* Header row */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <span className="card-badge inline-flex items-center self-start px-2.5 py-0.5 rounded-full text-[10px] font-mono tracking-widest uppercase">
              ✦ Featured
            </span>
            <h3 className="card-title font-bold leading-tight text-xl sm:text-2xl">
              {project.title}
            </h3>
          </div>
          <a
            href={project.github}
            aria-label="GitHub"
            className="card-link mt-0.5 shrink-0 hover:scale-110 transition-transform duration-150"
          >
            <GitHubIcon />
          </a>
        </div>

        {/* Description */}
        <p className="card-body text-sm sm:text-base leading-relaxed">
          {project.description}
        </p>

        {/* Stats */}
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {project.stats.map(s => (
            <span key={s} className="card-stat text-xs font-mono tracking-wide">
              ◈ {s}
            </span>
          ))}
        </div>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-2 mt-auto pt-2">
          {project.stack.map(t => (
            <span key={t} className="card-pill px-2.5 py-0.5 rounded-full text-[11px] font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </ParallaxCard>
  )
}

// ── Standard card ──────────────────────────────────────────────────────

function ProjectCard({ project, delay }) {
  return (
    <ParallaxCard delay={delay}>
      <div className="flex flex-col gap-3 h-full">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title font-semibold leading-snug text-base sm:text-lg">
            {project.title}
          </h3>
          <a
            href={project.github}
            aria-label="GitHub"
            className="card-link mt-0.5 shrink-0 hover:scale-110 transition-transform duration-150"
          >
            <GitHubIcon />
          </a>
        </div>

        {/* Description */}
        <p className="card-body text-sm leading-relaxed">
          {project.description}
        </p>

        {/* Stack pills */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-1">
          {project.stack.map(t => (
            <span key={t} className="card-pill px-2 py-0.5 rounded-full text-[11px] font-mono">
              {t}
            </span>
          ))}
        </div>
      </div>
    </ParallaxCard>
  )
}

// ── Section ────────────────────────────────────────────────────────────

export function Projects() {
  return (
    <section
      className="relative px-6 pb-28 pt-4 w-full max-w-5xl mx-auto"
      style={{ zIndex: 10 }}
    >
      {/* Section header */}
      <motion.div
        className="mb-10"
        variants={headerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p variants={headerItem} className="section-eyebrow font-mono text-xs tracking-[0.25em] uppercase mb-2">
          04 / Projects
        </motion.p>
        <motion.h2 variants={headerItem} className="section-heading font-black text-4xl sm:text-5xl tracking-tight leading-none mb-4">
          Work
        </motion.h2>
        <motion.div variants={headerItem} className="section-rule h-px w-full" />
      </motion.div>

      {/* Featured */}
      <div className="mb-5">
        <FeaturedCard project={FEATURED} />
      </div>

      {/* Standard grid */}
      <div className="grid sm:grid-cols-2 gap-5">
        {PROJECTS.map((p, i) => (
          <ProjectCard key={p.title} project={p} delay={i * 0.07} />
        ))}
      </div>
    </section>
  )
}
