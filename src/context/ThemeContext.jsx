import { createContext, useContext, useState } from 'react'

const ThemeContext = createContext(null)

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem('ocean-theme') ?? 'deep-sea'
  )

  const toggleTheme = () => {
    setTheme(prev => {
      const next = prev === 'deep-sea' ? 'shallow-reef' : 'deep-sea'
      localStorage.setItem('ocean-theme', next)
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
