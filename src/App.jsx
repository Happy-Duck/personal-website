import { motion } from 'framer-motion'
import { useTheme } from './context/ThemeContext'
import { MarineSnow } from './components/MarineSnow'
import { CausticLight } from './components/CausticLight'
import { ThemeToggle } from './components/ThemeToggle'

const THEMES = {
  'deep-sea': {
    bg: '#020818',
    textColor: '#a8d8f0',
    textShadow: '0 0 40px rgba(0,180,255,0.4), 0 0 80px rgba(0,80,200,0.2)',
  },
  'shallow-reef': {
    bg: '#0096c7',
    textColor: '#fff8f0',
    textShadow: '0 2px 24px rgba(255,200,80,0.45), 0 0 60px rgba(255,140,60,0.2)',
  },
}

export default function App() {
  const { theme } = useTheme()
  const isDeepSea = theme === 'deep-sea'
  const t = THEMES[theme]

  return (
    <motion.div
      className="relative min-h-screen overflow-hidden"
      animate={{ backgroundColor: t.bg }}
      transition={{ duration: 0.85 }}
    >
      {/* Animated backgrounds */}
      <MarineSnow visible={isDeepSea} />
      <CausticLight visible={!isDeepSea} />

      {/* Overlay gradient to add depth */}
      <motion.div
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 2 }}
        animate={{
          background: isDeepSea
            ? 'radial-gradient(ellipse at 50% 60%, rgba(0,40,120,0.35) 0%, rgba(2,8,24,0.0) 70%)'
            : 'radial-gradient(ellipse at 50% 0%, rgba(255,240,180,0.25) 0%, rgba(0,150,199,0.0) 65%)',
        }}
        transition={{ duration: 0.85 }}
      />

      {/* Toggle */}
      <ThemeToggle />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center" style={{ zIndex: 10 }}>
        <motion.h1
          className="text-6xl font-bold tracking-tight select-none"
          animate={{ color: t.textColor, textShadow: t.textShadow }}
          transition={{ duration: 0.85 }}
        >
          Rishi Garhyan
        </motion.h1>
      </div>
    </motion.div>
  )
}
