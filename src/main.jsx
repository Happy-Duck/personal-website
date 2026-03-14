import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { MouseProvider } from './context/MouseContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <MouseProvider>
        <App />
      </MouseProvider>
    </ThemeProvider>
  </StrictMode>,
)
