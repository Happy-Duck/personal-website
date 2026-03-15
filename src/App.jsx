import { MarineSnow    } from './components/MarineSnow'
import { BeachScene    } from './components/BeachScene'
import { CreatureLayer } from './components/creatures/CreatureLayer'
import { DepthGauge    } from './components/DepthGauge'
import { Hero          } from './components/Hero'
import { Experience    } from './components/Experience'
import { Skills        } from './components/Skills'
import { Projects      } from './components/Projects'
import { About         } from './components/About'
import { Contact       } from './components/Contact'
import { Footer        } from './components/Footer'

export default function App() {
  return (
    <>
      {/* ── Fixed backdrop layers (z 0–4) ─────────────────────────── */}
      {/* Smooth color-interpolated background */}
      <div className="ocean-backdrop" aria-hidden="true" />

      <div className="relative overflow-hidden">

        {/* Beach scene — only visible near surface (depth < 0.20) */}
        <BeachScene />

        {/* Depth overlay gradients */}
        <div className="overlay-deep" />
        <div className="overlay-reef" />

        {/* Sea creatures — depth-zone aware */}
        <CreatureLayer />

        {/* Marine snow — CSS-only, fades in at depth > 0.35 */}
        <MarineSnow />

        {/* Depth gauge — right edge, scroll-triggered */}
        <DepthGauge />

        {/* ── Page content (z 10) ────────────────────────────────── */}
        <Hero />
        <Experience />
        <Skills />
        <Projects />
        <About />
        <Contact />

      </div>

      {/* Footer — outside content div so ocean floor styles independently */}
      <Footer />
    </>
  )
}
