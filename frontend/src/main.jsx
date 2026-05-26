import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n'
import App from './App.jsx'
import { ToastProvider } from './context/ToastContext'

// Suppress Recharts ResponsiveContainer warnings (React 18 Strict Mode bug)
const originalWarn = console.warn;
console.warn = (...args) => {
  if (args[0] && typeof args[0] === 'string' && args[0].includes('width') && args[0].includes('height') && args[0].includes('of chart should be greater than 0')) {
    return;
  }
  originalWarn(...args);
};
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
