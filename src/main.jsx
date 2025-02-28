import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { TonConnectUIProvider } from '@tonconnect/ui-react'

const manifestURL = "https://raw.githubusercontent.com/ton-community/tutorials/main/03-client/test/public/tonconnect-manifest.json";

createRoot(document.getElementById('root')).render(
  <TonConnectUIProvider manifestUrl={manifestURL}>
    <App />
  </TonConnectUIProvider>,
)
