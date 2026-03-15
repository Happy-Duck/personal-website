import { motion } from 'framer-motion'

// ── Icons ──────────────────────────────────────────────────────────────

function EmailIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="2" y="4" width="20" height="16" rx="2" />
      <polyline points="2,6 12,13 22,6" />
    </svg>
  )
}

function LinkedInIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4V9h4v1.5A6 6 0 0116 8z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  )
}

function GitHubIcon() {
  return (
    <svg width="21" height="21" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

// ── Data ───────────────────────────────────────────────────────────────

const SIGNALS = [
  {
    id:       'email',
    label:    'Email',
    sublabel: 'garhyan2@illinois.edu',
    href:     'mailto:garhyan2@illinois.edu',
    Icon:     EmailIcon,
    delay:    0,
  },
  {
    id:       'linkedin',
    label:    'LinkedIn',
    sublabel: 'linkedin.com/in/rishi-garhyan',
    href:     'https://linkedin.com/in/rishi-garhyan',
    Icon:     LinkedInIcon,
    delay:    0.1,
  },
  {
    id:       'github',
    label:    'GitHub',
    sublabel: 'github.com/Happy-Duck',
    href:     'https://github.com/Happy-Duck',
    Icon:     GitHubIcon,
    delay:    0.2,
  },
]

// ── Animation variants ─────────────────────────────────────────────────

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const headerItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// ── Signal node ────────────────────────────────────────────────────────

function SignalNode({ signal }) {
  return (
    <motion.a
      href={signal.href}
      target={signal.id !== 'email' ? '_blank' : undefined}
      rel="noopener noreferrer"
      className={`signal-node signal-node--${signal.id}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: signal.delay }}
      viewport={{ once: true, margin: '-60px' }}
      whileHover={{ y: -6 }}
    >
      {/* Glowing orb — ping ring lives inside so it inherits position context */}
      <div className={`signal-orb signal-orb--${signal.id}`}>
        <div className="signal-ring" aria-hidden="true" />
        <signal.Icon />
      </div>

      <span className="signal-label">{signal.label}</span>
      <span className="signal-sublabel">{signal.sublabel}</span>
    </motion.a>
  )
}

// ── Section ────────────────────────────────────────────────────────────

export function Contact() {
  return (
    <section
      className="relative px-6 pb-28 pt-4 w-full max-w-5xl mx-auto"
      style={{ zIndex: 10 }}
    >
      {/* Section header */}
      <motion.div
        className="mb-12"
        variants={headerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.p variants={headerItem} className="section-eyebrow font-mono text-xs tracking-[0.25em] uppercase mb-2">
          06 / Contact
        </motion.p>
        <motion.h2 variants={headerItem} className="section-heading font-black text-4xl sm:text-5xl tracking-tight leading-none mb-4">
          Contact
        </motion.h2>
        <motion.div variants={headerItem} className="section-rule h-px w-full" />
      </motion.div>

      {/* Subhead */}
      <motion.p
        className="signal-intro text-center mb-14 font-mono text-sm tracking-[0.18em] uppercase"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        viewport={{ once: true }}
      >
        — signal detected —
      </motion.p>

      {/* Signal nodes */}
      <div className="flex flex-wrap justify-center gap-8 sm:gap-14">
        {SIGNALS.map(s => <SignalNode key={s.id} signal={s} />)}
      </div>
    </section>
  )
}
