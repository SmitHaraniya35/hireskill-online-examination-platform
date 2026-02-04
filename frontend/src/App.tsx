import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/admin/Login.tsx'
import ForgotPassword from './pages/admin/ForgotPassword.tsx'
import ResetPassword from './pages/admin/ResetPassword.tsx'
import NotFound from './components/NotFound.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'
import AdminRoutes from './routes/AdminRoutes.tsx'
import VerifyOtp from './pages/admin/VerifyOtp.tsx'

const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="admin/login" />} />

      <Route path="/admin/login" element={<Login />} />
      <Route path="/admin/forgot-password" element={<ForgotPassword />} />
      <Route path="/admin/verify-otp" element={<VerifyOtp />} />
      <Route path="/admin/reset-password/" element={<ResetPassword />} />
      {/* <Route element={<AdminRoutes/>}> */}
        <Route 
          path="/admin/dashboard"
          element={
            // <ProtectedRoute>
              <Dashboard />
            /* </ProtectedRoute> */
          }
        />
        {/* <Route path="/admin/create-exam" element={<CreateExam />} /> */}
      {/* </Route> */}
      
      <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
