import { motion } from 'framer-motion'

// ── Data ───────────────────────────────────────────────────────────────
// type: 'orb' | 'shell' | 'stone'
// grad: [highlight, base]  —  fed into radial-gradient inline style

const GROUPS = [
  {
    label: 'Languages',
    items: [
      {
        name:    'C++',
        type:    'orb',
        grad:    ['#7dd3fc', '#2563eb'],
        glow:    'rgba(80,160,255,0.55)',
        tooltip: 'Systems & engine-level code',
      },
      {
        name:    'C#',
        type:    'shell',
        grad:    ['#c084fc', '#7c3aed'],
        glow:    'rgba(168,100,255,0.52)',
        tooltip: 'Used in Pelagos & VR Lab',
      },
      {
        name:    'Java',
        type:    'stone',
        grad:    ['#fbbf24', '#ea580c'],
        glow:    'rgba(250,160,50,0.50)',
        tooltip: 'Algorithms & coursework',
      },
      {
        name:    'Python',
        type:    'orb',
        grad:    ['#4ade80', '#059669'],
        glow:    'rgba(50,210,130,0.52)',
        tooltip: 'Computer vision research',
      },
    ],
  },
  {
    label: 'Tools & Frameworks',
    items: [
      {
        name:    'Unity',
        type:    'shell',
        grad:    ['#e2e8f0', '#64748b'],
        glow:    'rgba(148,163,184,0.55)',
        tooltip: 'Steam-published game',
      },
      {
        name:    'Unreal Engine',
        type:    'orb',
        grad:    ['#f87171', '#b91c1c'],
        glow:    'rgba(220,60,60,0.55)',
        tooltip: 'C++ game engine',
      },
      {
        name:    'Blender',
        type:    'stone',
        grad:    ['#fb923c', '#c2410c'],
        glow:    'rgba(245,120,50,0.55)',
        tooltip: '3D modeling for VR Lab',
      },
      {
        name:    'Django',
        type:    'shell',
        grad:    ['#4ade80', '#15803d'],
        glow:    'rgba(50,180,80,0.52)',
        tooltip: 'Web backend framework',
      },
      {
        name:    'SQL',
        type:    'stone',
        grad:    ['#cbd5e1', '#7ea5c8'],
        glow:    'rgba(140,175,210,0.45)',
        tooltip: 'Database queries & schema',
      },
    ],
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

const groupContainer = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.07, delayChildren: 0.05 } },
}

const gemVariant = {
  hidden: { opacity: 0, y: 36 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.68, ease: [0.22, 1, 0.36, 1] } },
}

// ── Skill item ─────────────────────────────────────────────────────────

function SkillItem({ item }) {
  return (
    <motion.div className="skill-item-wrap" variants={gemVariant}>
      {/* Outer wrapper holds tooltip above the gem */}
      <div className="skill-gem-outer">
        <motion.div
          className={`skill-gem skill-gem--${item.type}`}
          style={{
            background: `radial-gradient(circle at 34% 28%, ${item.grad[0]}, ${item.grad[1]})`,
            boxShadow:  `0 0 20px ${item.glow}, 0 4px 14px rgba(0,0,0,0.38), inset 0 1px 0 rgba(255,255,255,0.28)`,
          }}
          whileHover={{ y: -10, scale: 1.1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 20 }}
        >
          {/* Light-catch highlight — 3D illusion */}
          <div className="skill-gem-shine" />
        </motion.div>

        {/* Tooltip — sits above the gem via CSS, independent of transform */}
        <div className="skill-tooltip" role="tooltip">
          {item.tooltip}
          <div className="skill-tooltip-arrow" />
        </div>
      </div>

      <span className="skill-label">{item.name}</span>
    </motion.div>
  )
}

// ── Skill group ────────────────────────────────────────────────────────

function SkillGroup({ group }) {
  return (
    <div>
      <motion.p
        className="skill-group-label font-mono text-xs tracking-[0.22em] uppercase mb-5"
        initial={{ opacity: 0, x: -10 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        viewport={{ once: true }}
      >
        {group.label}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-6"
        variants={groupContainer}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-60px' }}
      >
        {group.items.map(item => (
          <SkillItem key={item.name} item={item} />
        ))}
      </motion.div>
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────

export function Skills() {
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
          03 / Skills
        </motion.p>
        <motion.h2 variants={headerItem} className="section-heading font-black text-4xl sm:text-5xl tracking-tight leading-none mb-4">
          Skills
        </motion.h2>
        <motion.div variants={headerItem} className="section-rule h-px w-full" />
      </motion.div>

      {/* Groups */}
      <div className="flex flex-col gap-12">
        {GROUPS.map(group => (
          <SkillGroup key={group.label} group={group} />
        ))}
      </div>
    </section>
  )
}
