import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider, LanguageProvider } from './website/provider/Provider.jsx'
import { AuthProvider } from './layout/auth/AuthContext.jsx'

createRoot(document.getElementById('root')).
  render(
    <AuthProvider>

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

    </AuthProvider>

  )
