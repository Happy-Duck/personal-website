import { MarineSnow } from './components/MarineSnow'
import { CausticLight } from './components/CausticLight'
import { ThemeToggle } from './components/ThemeToggle'
import { CreatureLayer } from './components/creatures/CreatureLayer'
import { Hero } from './components/Hero'
import { Experience } from './components/Experience'
import { Skills } from './components/Skills'
import { Projects } from './components/Projects'
import { About } from './components/About'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'

export default function App() {
  return (
    <>
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

      {/* Experience */}
      <Experience />

      {/* Skills */}
      <Skills />

      {/* Projects */}
      <Projects />

      {/* About */}
      <About />

      {/* Contact */}
      <Contact />

    </div>

    {/* Footer — outside theme-bg so it can style the ocean floor independently */}
    <Footer />
    </>
  )
}
