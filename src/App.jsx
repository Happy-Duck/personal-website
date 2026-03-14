import { MarineSnow } from './components/MarineSnow'
import { CausticLight } from './components/CausticLight'
import { ThemeToggle } from './components/ThemeToggle'
import { CreatureLayer } from './components/creatures/CreatureLayer'
import { Hero } from './components/Hero'
import { Projects } from './components/Projects'

export default function App() {
  return (
    <div className="theme-bg relative overflow-hidden">

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

      {/* Hero */}
      <Hero />

      {/* Projects */}
      <Projects />

    </div>
  )
}
