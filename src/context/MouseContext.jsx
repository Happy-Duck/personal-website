import { createContext, useContext, useEffect, useRef } from 'react'

const MouseContext = createContext(null)

export function MouseProvider({ children }) {
  const mouseRef = useRef({ x: -9999, y: -9999 })

  useEffect(() => {
    const onMove = (e) => {
      mouseRef.current = { x: e.clientX, y: e.clientY }
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <MouseContext.Provider value={mouseRef}>
      {children}
    </MouseContext.Provider>
  )
}

export const useMouse = () => useContext(MouseContext)
