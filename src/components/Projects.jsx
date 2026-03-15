import { useRef } from 'react'
import { motion } from 'framer-motion'

// ── Data ───────────────────────────────────────────────────────────────

const FEATURED = {
  title:       'Pelagos: A Marine Adventure',
  description: 'A narrative-driven marine exploration game built entirely in Unity. Self-published on Steam and downloaded 30k+ times. Later adopted by schools across three states as an interactive environmental science teaching tool.',
  stack:       ['Unity', 'C#', 'Steam', 'Steamworks SDK'],
  stats:       ['30k+ downloads', 'Used in schools'],
  link:      'https://store.steampowered.com/app/2645390/Pelagos_A_Marine_Adventure',
}

const PROJECTS = [
  {
    title:       'Flarp',
    description: "A puzzle Metroidvania built around wind mechanics and momentum-based traversal. Developed with UIUC's ACM GameBuilders club.",
    stack:       ['GameMaker Studio', 'GML'],
    link:      'https://orangepainting.itch.io/flarp',
  },
  {
    title:       'SportsBot',
    description: 'Discord bot delivering live scores, player stats, and schedule alerts through a clean slash-command interface backed by REST sports APIs.',
    stack:       ['Python', 'discord.py', 'REST API'],
    link:      'https://github.com/Happy-Duck/DiscordSportsBot',
  },
  {
    title:       'Tide Toss',
    description: 'Physics-based local multiplayer game built in 48 hours for a game jam. Features wave simulation and realistic buoyancy mechanics.',
    stack:       ['Unity', 'C#', 'Physics2D'],
    link:      'https://happy-ducky.itch.io/tide-toss',
  },
  {
    title:       'Computer Vision Research',
    description: 'Benchmark comparison of Faster R-CNN (Detectron2) against YOLOv8 for real-time object detection on the COCO dataset. Analysed accuracy–latency tradeoffs.',
    stack:       ['Python', 'Detectron2', 'YOLOv8', 'COCO'],
    link:      '#',
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

function SteamIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M11.979 0C5.678 0 .511 4.86.022 11.037l6.432 2.658a3.387 3.387 0 011.912-.585c.064 0 .127.003.19.007l2.862-4.148v-.058a4.533 4.533 0 014.528-4.528 4.533 4.533 0 014.528 4.528 4.534 4.534 0 01-4.528 4.529h-.105l-4.082 2.913c0 .052.004.104.004.157a3.39 3.39 0 01-3.39 3.393 3.406 3.406 0 01-3.327-2.727L.436 15.27C1.862 20.307 6.486 24 11.979 24c6.627 0 12-5.373 12-12S18.606 0 11.979 0zM7.54 18.21l-1.473-.61a2.542 2.542 0 004.578-.87 2.543 2.543 0 00-2.54-2.541c-.168 0-.333.017-.494.049l1.523.63a1.87 1.87 0 01-1.594 3.342zm8.406-7.79a3.023 3.023 0 01-3.02-3.019 3.023 3.023 0 013.02-3.02 3.023 3.023 0 013.02 3.02 3.023 3.023 0 01-3.02 3.02z" />
    </svg>
  )
}

function ItchIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M3.13 1.338C2.08 1.96.02 4.328 0 4.95v1.03c0 1.303 1.22 2.45 2.325 2.45 1.33 0 2.436-1.06 2.436-2.34 0 1.28 1.04 2.34 2.37 2.34 1.33 0 2.28-1.06 2.28-2.34 0 1.28 1.1 2.34 2.43 2.34h.17c1.33 0 2.43-1.06 2.43-2.34 0 1.28.95 2.34 2.28 2.34 1.33 0 2.37-1.06 2.37-2.34 0 1.28 1.1 2.34 2.43 2.34 1.11 0 2.33-1.15 2.33-2.45V4.95c-.02-.62-2.08-2.99-3.13-3.612C18.886.96 14.165.867 12 .867c-2.17 0-6.89.093-8.87.47zm7.38 7.6c-.36.64-1.07 1.098-1.92 1.098-.86 0-1.58-.46-1.93-1.1-.36.64-1.18 1.1-2.03 1.1-.39 0-.74-.1-1.06-.26v7.78c0 2.1.43 2.76.95 3.27.56.54 2.4 1.83 6.42 1.83 4.04 0 5.87-1.3 6.43-1.83.52-.51.95-1.17.95-3.27v-7.78c-.32.16-.68.26-1.07.26-.85 0-1.67-.46-2.03-1.1-.35.64-1.07 1.1-1.93 1.1-.85 0-1.56-.46-1.92-1.1zm-1.6 4.26c.78-.08 1.64.42 2.11 1.07.47-.65 1.33-1.15 2.11-1.07 1.14.12 2.2 1.23 2.22 3.2 0 2.87-2.5 5.09-4.33 6.17-1.83-1.08-4.33-3.3-4.33-6.17.02-1.97 1.08-3.08 2.22-3.2z" />
    </svg>
  )
}

function ExternalLinkIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" />
      <polyline points="15 3 21 3 21 9" />
      <line x1="10" y1="14" x2="21" y2="3" />
    </svg>
  )
}

function linkIcon(url) {
  if (url.includes('steampowered.com')) return { Icon: SteamIcon, label: 'Steam' }
  if (url.includes('itch.io'))          return { Icon: ItchIcon,  label: 'itch.io' }
  if (url.includes('github.com'))       return { Icon: GitHubIcon, label: 'GitHub' }
  return { Icon: ExternalLinkIcon, label: 'Link' }
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
  const { Icon, label } = linkIcon(project.link)
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
            href={project.link}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={label}
            className="card-link mt-0.5 shrink-0 hover:scale-110 transition-transform duration-150"
          >
            <Icon />
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
  const { Icon, label } = linkIcon(project.link)
  const hasLink = project.link && project.link !== '#'
  return (
    <ParallaxCard delay={delay}>
      <div className="flex flex-col gap-3 h-full">

        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="card-title font-semibold leading-snug text-base sm:text-lg">
            {project.title}
          </h3>
          {hasLink && (
            <a
              href={project.link}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="card-link mt-0.5 shrink-0 hover:scale-110 transition-transform duration-150"
            >
              <Icon />
            </a>
          )}
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
