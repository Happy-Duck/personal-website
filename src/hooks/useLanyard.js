// ── useLanyard — live Discord presence via Lanyard WebSocket ──────────
// Fetches initial state via REST, then maintains a WebSocket for live updates.
// Returns { status, activity, spotify, customStatus, loading, error }

import { useEffect, useRef, useState } from 'react'

const DISCORD_ID = '384538228608335873'
const REST_URL   = `https://api.lanyard.rest/v1/users/${DISCORD_ID}`
const WS_URL     = 'wss://api.lanyard.rest/socket'

function parsePresence(data) {
  if (!data) return null
  return {
    status:       data.discord_status || 'offline',
    activity:     data.activities?.find(a => a.type === 0) || null,   // type 0 = Playing
    spotify:      data.spotify || null,
    customStatus: data.activities?.find(a => a.type === 4) || null,   // type 4 = Custom
  }
}

export function useLanyard() {
  const [presence, setPresence] = useState(null)
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(false)
  const wsRef     = useRef(null)
  const heartbeat = useRef(null)

  useEffect(() => {
    let cancelled = false

    // ── Initial REST fetch ──────────────────────────────────────────
    fetch(REST_URL)
      .then(r => r.json())
      .then(json => {
        if (cancelled) return
        if (json.success) {
          setPresence(parsePresence(json.data))
        }
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) { setError(true); setLoading(false) }
      })

    // ── WebSocket for live updates ──────────────────────────────────
    function connect() {
      if (cancelled) return

      const ws = new WebSocket(WS_URL)
      wsRef.current = ws

      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data)

        // op 1: Hello — start heartbeat, send init
        if (msg.op === 1) {
          const interval = msg.d.heartbeat_interval

          // Send subscribe
          ws.send(JSON.stringify({
            op: 2,
            d: { subscribe_to_id: DISCORD_ID },
          }))

          // Heartbeat loop
          clearInterval(heartbeat.current)
          heartbeat.current = setInterval(() => {
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(JSON.stringify({ op: 3 }))
            }
          }, interval)
        }

        // op 0: Event (INIT_STATE or PRESENCE_UPDATE)
        if (msg.op === 0 && msg.d) {
          if (!cancelled) {
            setPresence(parsePresence(msg.d))
            setLoading(false)
          }
        }
      }

      ws.onerror = () => {
        if (!cancelled) setError(true)
      }

      ws.onclose = () => {
        clearInterval(heartbeat.current)
        // Reconnect after 5s unless unmounted
        if (!cancelled) setTimeout(connect, 5000)
      }
    }

    connect()

    return () => {
      cancelled = true
      clearInterval(heartbeat.current)
      if (wsRef.current) {
        wsRef.current.onclose = null  // prevent reconnect on intentional close
        wsRef.current.close()
      }
    }
  }, [])

  return {
    status:       presence?.status       ?? 'offline',
    activity:     presence?.activity     ?? null,
    spotify:      presence?.spotify      ?? null,
    customStatus: presence?.customStatus ?? null,
    loading,
    error,
  }
}
