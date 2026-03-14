import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('ocean-theme') ?? 'deep-sea'
  )

  // Sync data-theme attribute on mount (in case index.html inline script missed it)
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'deep-sea' ? 'shallow-reef' : 'deep-sea'
      localStorage.setItem('ocean-theme', next)

      // Single DOM write → CSS variables cascade, no React re-renders per frame
      document.documentElement.setAttribute('data-theme', next)

      // Disable backdrop-filter on toggle during the transition window
      document.body.classList.add('theme-transitioning')
      setTimeout(() => document.body.classList.remove('theme-transitioning'), 800)

      return next
    })
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export const useTheme = () => useContext(ThemeContext)
