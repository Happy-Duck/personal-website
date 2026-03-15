// ── useLanyard — live Discord presence via Lanyard WebSocket ──────────
// Fetches initial state via REST, then maintains a WebSocket for live updates.
// Returns { status, activity, spotify, customStatus, loading, error }

import { useEffect, useRef, useState } from 'react'

const DISCORD_ID = '384538228608335873'
const REST_URL   = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
const WS_URL     = 'wss://api.lanyard.rest/socket'

function parsePresence(data) {
  if (!data) return null

  const activities = data.activities || []

  return {
    status: data.discord_status || 'offline',
    activities,
    activity:
      activities.find(a =>
        a.type !== 4 &&
        a.name &&
        a.name !== 'Custom Status'
      ) || null,
    spotify: data.spotify || null,
    customStatus: activities.find(a => a.type === 4) || null,
  }
}

export function useLanyard() {
  const [presence, setPresence] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const wsRef = useRef(null)
  const heartbeat = useRef(null)

  useEffect(() => {
    let cancelled = false

    fetch(REST_URL)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return
        if (json.success) {
          setPresence(parsePresence(json.data))
          setError(false)
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    function connect() {
      if (cancelled) return

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval

          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_ID },
          }))

          clearInterval(heartbeat.current)
          heartbeat.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }))
            }
          }, interval)
        }

        if (msg.op === 0 && msg.d) {
          if (!cancelled) {
            setPresence(parsePresence(msg.d))
            setLoading(false)
            setError(false)
          }
        }
      }

      ws.onerror = () => {
        if (!cancelled) setError(true)
      }

      ws.onclose = () => {
        clearInterval(heartbeat.current)
        if (!cancelled) setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      cancelled = true
      clearInterval(heartbeat.current)
      if (wsRef.current) {
        wsRef.current.onclose = null
        wsRef.current.close()
      }
    }
  }, [])

  return {
    status:       presence?.status       ?? 'offline',
    activities:   presence?.activities   ?? [],
    activity:     presence?.activity     ?? null,
    spotify:      presence?.spotify      ?? null,
    customStatus: presence?.customStatus ?? null,
    loading,
    error,
  }
}