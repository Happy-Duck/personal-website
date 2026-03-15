import { motion } from 'framer-motion'

// ── Data ───────────────────────────────────────────────────────────────

const NOTES = [
  'CS student at UIUC — expected Dec 2027, 4.0 GPA.',
  'Passionate about game development, VR/XR, and building things people actually interact with.',
  'Published a game on Steam that ended up in classrooms across three states (Pelagos).',
  'Currently building VR experiences for the European Space Agency.',
  'Outside of code: fly fishing, game jams, and exploring what games can do as a medium.',
]

const CURRENTLY = [
  { key: 'at',       value: 'UIUC, Champaign IL'                  },
  { key: 'building', value: 'ESA Comet Interceptor VR module'      },
  { key: 'playing',  value: null /* placeholder — fill in later */ },
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

const noteStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.09, delayChildren: 0.15 } },
}

const noteLine = {
  hidden: { opacity: 0, x: -14 },
  show:   { opacity: 1, x: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } },
}

const currStagger = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
}

const currRow = {
  hidden: { opacity: 0, y: 10 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
}

// ── Section ────────────────────────────────────────────────────────────

export function About() {
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
          05 / About
        </motion.p>
        <motion.h2 variants={headerItem} className="section-heading font-black text-4xl sm:text-5xl tracking-tight leading-none mb-4">
          About
        </motion.h2>
        <motion.div variants={headerItem} className="section-rule h-px w-full" />
      </motion.div>

      {/* Field-notes card */}
      <motion.div
        className="about-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >

        {/* ── Main notes ── */}
        <p className="about-section-label">Field Notes</p>
        <div className="about-divider" />

        <motion.ul
          className="about-entries"
          variants={noteStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {NOTES.map(note => (
            <motion.li key={note} className="about-entry" variants={noteLine}>
              <span className="about-bullet" aria-hidden="true">◦</span>
              <span>{note}</span>
            </motion.li>
          ))}
        </motion.ul>

        {/* ── Currently ── */}
        <div className="about-divider about-divider--spaced" />

        <p className="about-section-label">Currently</p>

        <motion.dl
          className="about-currently"
          variants={currStagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-40px' }}
        >
          {CURRENTLY.map(({ key, value }) => (
            <motion.div key={key} className="about-curr-row" variants={currRow}>
              <dt className="about-curr-key">{key}</dt>
              <span className="about-curr-sep" aria-hidden="true">·</span>
              {value
                ? <dd className="about-curr-val">{value}</dd>
                : <dd className="about-curr-val about-curr-blank">···</dd>
              }
            </motion.div>
          ))}
        </motion.dl>

      </motion.div>
    </section>
  )
}
