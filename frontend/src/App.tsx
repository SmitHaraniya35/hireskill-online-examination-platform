import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import LoginAdmin from './features/auth/admin/Login.tsx'  
import ForgotPassword from './features/auth/admin/ForgotPassword.tsx'
import ResetPassword from './features/auth/admin/ResetPassword.tsx'
import NotFound from './components/shared/NotFound.tsx'
import Dashboard from './components/Dashboard.tsx'
import VerifyOtp from './features/auth/admin/VerifyOtp.tsx'
import TestLinkManager from './features/test/handleTest/TestsManager.tsx'
import CodingProblem from './features/problems/CodingProblems.tsx'
import AddNewProblem from './features/problems/AddNewProblem.tsx'
import LandingPage from './components/LandingPage.tsx'
import AdminRoutes from './routes/AdminRoutes.tsx'
// import Navbar from './components/shared/Navbar.tsx'
import TestEntry from './features/test/CodingPlatform/TestEntry.tsx'
import TestInstruction from './features/test/CodingPlatform/TestInstruction.tsx'
import CodingSection from './features/test/CodingPlatform/CodingSection/CodingSection.tsx'

const App: React.FC = () => {
  return (
    <>
      {/* <Navbar/> */}
      <Routes>
        <Route path="/" element={<Navigate to="/landing-page" />} />

        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin/reset-password/" element={<ResetPassword />} />
        
        <Route element={<AdminRoutes/>}>
          <Route path="/admin/dashboard" element={<Dashboard />}/>
          <Route path="/admin/create-exam" element={<TestLinkManager/>} />
          <Route path="/admin/coding-problem" element={<CodingProblem/>}/>
          <Route path="/admin/coding-problem/add-new-problem"
            element={
              <AddNewProblem
                closeModal={() => {}}
                refreshLinks={() => {}}
              />
            }
          />
        </Route>
        
        
        {/* Candidate test flow */}
        <Route path="/test/:slug" element={<TestEntry />} />
        <Route path="/test/:slug/instruction" element={<TestInstruction />} />
        <Route path="/test/:slug/editor/:studentAttemptId" element={<CodingSection />} />
        
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
