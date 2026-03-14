import { motion } from 'framer-motion'
import { useTheme } from '../context/ThemeContext'

function SunIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
      <circle cx="12" cy="12" r="4.5" />
      <line x1="12" y1="2" x2="12" y2="5" />
      <line x1="12" y1="19" x2="12" y2="22" />
      <line x1="4.22" y1="4.22" x2="6.34" y2="6.34" />
      <line x1="17.66" y1="17.66" x2="19.78" y2="19.78" />
      <line x1="2" y1="12" x2="5" y2="12" />
      <line x1="19" y1="12" x2="22" y2="12" />
      <line x1="4.22" y1="19.78" x2="6.34" y2="17.66" />
      <line x1="17.66" y1="6.34" x2="19.78" y2="4.22" />
    </svg>
  )
}

function AbyssIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="12" cy="12" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.2" opacity="0.55" />
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="0.7" opacity="0.28" />
    </svg>
  )
}

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  const isDeepSea = theme === 'deep-sea'

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col items-center gap-1">
      {/* Depth label */}
      <motion.span
        className="text-[10px] font-mono tracking-[0.2em] uppercase select-none"
        animate={{ color: isDeepSea ? 'rgba(0,212,255,0.55)' : 'rgba(220,80,60,0.7)' }}
        transition={{ duration: 0.8 }}
      >
        {isDeepSea ? '9,842 m' : '12 m'}
      </motion.span>

      {/* Toggle pill */}
      <motion.button
        onClick={toggleTheme}
        className="relative flex items-center rounded-full border backdrop-blur-md cursor-pointer overflow-hidden p-1 gap-0"
        animate={{
          borderColor: isDeepSea ? 'rgba(0,212,255,0.45)' : 'rgba(220,80,60,0.45)',
          backgroundColor: isDeepSea ? 'rgba(2,8,24,0.72)' : 'rgba(255,255,255,0.52)',
          boxShadow: isDeepSea
            ? '0 0 16px rgba(0,212,255,0.18), inset 0 0 12px rgba(0,212,255,0.06)'
            : '0 0 16px rgba(255,140,60,0.18), inset 0 0 12px rgba(255,200,80,0.06)',
        }}
        transition={{ duration: 0.8 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.94 }}
        aria-label={isDeepSea ? 'Rise to shallow reef' : 'Descend to deep sea'}
        title={isDeepSea ? 'Rise to shallow reef' : 'Descend to deep sea'}
      >
        {/* Sliding highlight */}
        <motion.span
          className="absolute top-1 bottom-1 w-[calc(50%-2px)] rounded-full"
          animate={{
            left: isDeepSea ? 'calc(50% + 1px)' : '4px',
            backgroundColor: isDeepSea
              ? 'rgba(0,212,255,0.15)'
              : 'rgba(255,130,80,0.2)',
          }}
          transition={{ type: 'spring', stiffness: 340, damping: 32 }}
        />

        {/* Shallow reef side — sun */}
        <motion.span
          className="relative z-10 w-10 h-9 flex items-center justify-center"
          animate={{ color: isDeepSea ? 'rgba(0,212,255,0.35)' : '#ff7c4d' }}
          transition={{ duration: 0.6 }}
        >
          <SunIcon />
        </motion.span>

        {/* Deep sea side — abyss orb */}
        <motion.span
          className="relative z-10 w-10 h-9 flex items-center justify-center"
          animate={{ color: isDeepSea ? '#00d4ff' : 'rgba(100,80,140,0.4)' }}
          transition={{ duration: 0.6 }}
        >
          <AbyssIcon />
        </motion.span>
      </motion.button>

      {/* Mode label */}
      <motion.span
        className="text-[9px] font-mono tracking-[0.15em] uppercase select-none"
        animate={{ color: isDeepSea ? 'rgba(0,212,255,0.4)' : 'rgba(220,80,60,0.55)' }}
        transition={{ duration: 0.8 }}
      >
        {isDeepSea ? 'deep sea' : 'reef'}
      </motion.span>
    </div>
  )
}
