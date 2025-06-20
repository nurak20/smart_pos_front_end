import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider, LanguageProvider } from './website/provider/Provider.jsx'

createRoot(document.getElementById('root')).render(
  <LanguageProvider>
    <BrowserRouter>
      <StrictMode>
        <AppProvider>
          <App />
        </AppProvider>
      </StrictMode>
      <></>
    </BrowserRouter>
  </LanguageProvider>

)
