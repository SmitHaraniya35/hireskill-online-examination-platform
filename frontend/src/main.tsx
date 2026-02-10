import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import {AdminAuthProvider} from "./context/AdminAuthContext.tsx";
import {UserAuthProvider} from "./context/UserAuthContext.tsx";
import "react-datepicker/dist/react-datepicker.css";


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AdminAuthProvider>
        <UserAuthProvider>
          <App />
        </UserAuthProvider>
      </AdminAuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
