import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { OceanDepthProvider } from './context/OceanDepthContext.jsx'
import { MouseProvider      } from './context/MouseContext.jsx'

window.history.scrollRestoration = 'manual'
window.scrollTo(0, 0)

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <OceanDepthProvider>
      <MouseProvider>
        <App />
      </MouseProvider>
    </OceanDepthProvider>
  </StrictMode>,
)
