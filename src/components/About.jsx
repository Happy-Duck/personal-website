import { useState, useEffect, useRef, useCallback } from 'react'
import { motion } from 'framer-motion'
import { useLanyard } from '../hooks/useLanyard'

// ── Data ───────────────────────────────────────────────────────────────

const LOG_ENTRIES = [
  'Published Pelagos on Steam — 30k+ downloads, adopted by schools across three states.',
  'Building VR modules for ESA\'s Comet Interceptor Mission at the Immersive Learning Lab.',
  'Game dev, VR/XR, and building things people actually interact with.',
  'Outside of code: fly fishing, game jams, and exploring what games can do as a medium.',
]

// UIUC coordinates
const COORDS = '40.1020° N, 88.2272° W'
const LOCATION = 'Urbana, IL'

// ── Typewriter hook ────────────────────────────────────────────────────

function useTypewriter(lines) {
  const [displayed, setDisplayed] = useState([])
  const [done, setDone]           = useState(false)
  const started = useRef(false)

  const start = useCallback(() => {
    if (started.current) return
    started.current = true

    const full = lines.join('\n')
    let i = 0

    function tick() {
      if (i >= full.length) {
        setDone(true)
        return
      }
      i++
      setDisplayed(full.slice(0, i).split('\n'))
      const variance = (Math.random() - 0.5) * 20
      setTimeout(tick, 40 + variance)
    }
    tick()
  }, [lines])

  return { displayed, done, start }
}

// ── Animation variants ─────────────────────────────────────────────────

const headerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
}

const headerItem = {
  hidden: { opacity: 0, y: 16 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

// ── Discord presence ───────────────────────────────────────────────────

function resolveActivityImage(activity) {
  if (!activity) return null
  const assets = activity.assets
  const appId  = activity.application_id
  const img = assets?.large_image || assets?.small_image
  if (!img) return null
  if (img.startsWith('mp:external/'))
    return `https://media.discordapp.net/external/${img.slice(12)}`
  if (appId)
    return `https://cdn.discordapp.com/app-assets/${appId}/${img}.png`
  return null
}

const appIconCache = {}

function useAppIcon(appId) {
  const [iconUrl, setIconUrl] = useState(null)

  useEffect(() => {
    if (!appId) { setIconUrl(null); return }

    if (appIconCache[appId]) {
      setIconUrl(appIconCache[appId])
      return
    }

    let cancelled = false
    fetch(`https://discord.com/api/v9/applications/${appId}/rpc`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (cancelled || !data?.icon) return
        const url = `https://cdn.discordapp.com/app-icons/${appId}/${data.icon}.png`
        appIconCache[appId] = url
        setIconUrl(url)
      })
      .catch(() => {})

    return () => { cancelled = true }
  }, [appId])

  return iconUrl
}

function LivePresence() {
  const { activities, spotify, loading, error } = useLanyard()
  const activity = activities?.find(a => a.type !== 4) || null

  let thumb = null
  let line  = null
  let sub   = null

  if (!loading && !error) {
    if (spotify) {
      line  = spotify.song
      sub   = `by ${spotify.artist}`
      thumb = spotify.album_art_url
    } else if (activity) {
      line  = activity.name
      thumb = resolveActivityImage(activity)
    }
  }

  const needsAppIcon = !thumb && activity?.application_id
  const appIcon = useAppIcon(needsAppIcon ? activity.application_id : null)
  if (!thumb && appIcon) thumb = appIcon

  // Nothing active → render nothing
  if (loading || error || !line) return null

  return (
    <div className="log-presence">
      <span className="log-presence-label">live transmission //</span>
      <div className="log-presence-content">
        {thumb && (
          <img src={thumb} alt="" className="log-presence-thumb" loading="lazy" />
        )}
        <div className="log-presence-text">
          <span className="log-presence-main">{line}</span>
          {sub && <span className="log-presence-sub">{sub}</span>}
        </div>
      </div>
    </div>
  )
}

// ── Typewriter log entries ─────────────────────────────────────────────

function TypewriterLog() {
  const { displayed, done, start } = useTypewriter(LOG_ENTRIES)
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          start()
          obs.disconnect()
        }
      },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [start])

  return (
    <div ref={ref} className="log-entries">
      {displayed.map((line, i) => (
        <p key={i} className="log-entry">
          <span className="log-prompt" aria-hidden="true">&gt;</span>
          <span>
            {line}
            {!done && i === displayed.length - 1 && (
              <span className="typewriter-cursor" aria-hidden="true">|</span>
            )}
          </span>
        </p>
      ))}
    </div>
  )
}

// ── Section ────────────────────────────────────────────────────────────

export function About() {
  return (
    <section
      className="relative px-6 pb-28 pt-4 w-full max-w-5xl mx-auto"
      style={{ zIndex: 10 }}
    >
      {/* Section header */}
      <motion.div
        className="mb-10"
        variants={headerStagger}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
      >
        <motion.h2 variants={headerItem} className="section-heading font-black text-4xl sm:text-5xl tracking-tight leading-none mb-4">
          About
        </motion.h2>
        <motion.div variants={headerItem} className="section-rule h-px w-full" />
      </motion.div>

      {/* Captain's log card */}
      <motion.div
        className="log-card"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.78, ease: [0.22, 1, 0.36, 1] }}
        viewport={{ once: true, margin: '-60px' }}
      >
        {/* Header bar */}
        <div className="log-header">
          <div className="log-header-left">
            <span className="log-title">Captain's Log</span>
            <span className="log-id">UIUC — CS '27 — 4.0 GPA</span>
          </div>
          <div className="log-header-right">
            <span className="log-coords">{COORDS}</span>
            <span className="log-location">{LOCATION}</span>
          </div>
        </div>

        <div className="log-divider" />

        {/* Log entries — typewriter */}
        <TypewriterLog />

        {/* Live Discord presence — only shows when active */}
        <LivePresence />

      </motion.div>
    </section>
  )
}
