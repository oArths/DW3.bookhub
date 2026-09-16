import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Login from './pages/login/index.jsx';


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Login />
  </StrictMode>,
)
