import { motion } from 'framer-motion'

// Each blob has its own animation class for independent timing/path
const BLOBS = [
  { className: 'caustic-1', style: { width: 520, height: 420, top: '-80px', left: '5%' } },
  { className: 'caustic-2', style: { width: 380, height: 460, top: '10%', left: '40%' } },
  { className: 'caustic-3', style: { width: 440, height: 350, top: '25%', left: '65%' } },
  { className: 'caustic-4', style: { width: 300, height: 500, top: '50%', left: '15%' } },
  { className: 'caustic-5', style: { width: 460, height: 400, top: '45%', left: '55%' } },
  { className: 'caustic-6', style: { width: 350, height: 380, top: '70%', left: '30%' } },
]

export function CausticLight({ visible }) {
  return (
    <motion.div
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: 1 }}
      animate={{ opacity: visible ? 1 : 0 }}
      transition={{ duration: 0.9 }}
    >
      {BLOBS.map(({ className, style }) => (
        <div
          key={className}
          className={`caustic-blob ${className}`}
          style={{
            position: 'absolute',
            width: style.width,
            height: style.height,
            top: style.top,
            left: style.left,
          }}
        />
      ))}
    </motion.div>
  )
}
