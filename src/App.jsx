import { MarineSnow } from './components/MarineSnow'
import { CausticLight } from './components/CausticLight'
import { ThemeToggle } from './components/ThemeToggle'
import { CreatureLayer } from './components/creatures/CreatureLayer'

export default function App() {
  return (
    <div className="theme-bg relative min-h-screen overflow-hidden">

      {/* Background effects */}
      <MarineSnow />
      <CausticLight />

      {/* Depth overlay — two persistent divs, opacity cross-fades via CSS var */}
      <div className="overlay-deep" />
      <div className="overlay-reef" />

      {/* Sea creatures — behind all UI */}
      <CreatureLayer />

      {/* Toggle */}
      <ThemeToggle />

      {/* Content */}
      <div className="relative min-h-screen flex items-center justify-center" style={{ zIndex: 10 }}>
        <h1 className="site-title text-6xl font-bold tracking-tight select-none">
          Rishi Garhyan
        </h1>
      </div>

    </div>
  )
}
