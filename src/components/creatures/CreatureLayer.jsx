import { Fish } from './Fish'
import { DeepCreature } from './DeepCreature'

// No theme prop — fish use CSS variables, DeepCreature reads theme internally
export function CreatureLayer() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 3,
        pointerEvents: 'none',
        overflow: 'hidden',
      }}
    >
      <Fish index={0} />
      <Fish index={1} />
      <Fish index={2} />
      <DeepCreature />
    </div>
  )
}
