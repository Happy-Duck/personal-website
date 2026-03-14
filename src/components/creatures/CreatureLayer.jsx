import { useTheme } from '../../context/ThemeContext'
import { Fish } from './Fish'
import { DeepCreature } from './DeepCreature'

export function CreatureLayer() {
  const { theme } = useTheme()

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,          // above bg effects (1-2), below content (10+)
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Fish index={0} theme={theme} />
      <Fish index={1} theme={theme} />
      <Fish index={2} theme={theme} />
      <DeepCreature theme={theme} />
    </div>
  )
}
