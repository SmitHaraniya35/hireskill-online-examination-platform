import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import Login from './pages/admin/Login.tsx'
import ForgotPassword from './pages/admin/ForgotPassword.tsx'
import ResetPassword from './pages/admin/ResetPassword.tsx'
import NotFound from './components/NotFound.tsx'
import Dashboard from './pages/admin/Dashboard.tsx'
import AdminRoutes from './routes/AdminRoutes.tsx'
import VerifyOtp from './pages/admin/VerifyOtp.tsx'
import TestLinkManager from './components/TestLinkManager.tsx'
import CodingProblem from './pages/admin/CodingProblems.tsx'
import AddNewProblem from './pages/admin/AddNewProblem.tsx'

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
        <Route path="/admin/create-exam" element={<TestLinkManager/>} />
        <Route path="/admin/coding-problem" element={<CodingProblem/>}/>
        <Route path="/admin/coding-problem/add-new-problem" element={<AddNewProblem/>}/>
      {/* /* </Route> */ }
      
      <Route path="/*" element={<NotFound />} />
    </Routes>
  )
}

export default App;
