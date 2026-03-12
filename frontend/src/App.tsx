import { Route, Routes, Navigate } from 'react-router-dom'
import './App.css'
import LoginAdmin from './features/auth/admin/Login.tsx'  
import ForgotPassword from './features/auth/admin/ForgotPassword.tsx'
import ResetPassword from './features/auth/admin/ResetPassword.tsx'
import NotFound from './components/shared/NotFound.tsx'
import VerifyOtp from './features/auth/admin/VerifyOtp.tsx'
import TestLinkManager from './features/test/handleTest/TestsManager.tsx'
import CodingProblem from './features/problems/CodingProblems.tsx'
import CreateCodingProblem from './features/problems/CreateCodingProblem.tsx'
import LandingPage from './components/LandingPage.tsx'
import AdminLayout from './layouts/AdminLayout.tsx'
import StudentManagementLayout from './features/student/StudentManagementLayout.tsx'
import AdminDashboardLayout from './features/Dashboard/AdminDashboardLayout.tsx'
import SubmissionDetails from './features/test/handleTest/SubmissionDetails.tsx'
import CreateNewTest from './features/test/handleTest/CreateNewTest.tsx'
import TestEntryPage from './features/test/CodingPlatform/Onboarding/TestEntryPage.tsx'
import TestInformationPage from './features/test/CodingPlatform/Onboarding/TestInformationPage.tsx'
import StudentDetailsPage from './features/test/CodingPlatform/Onboarding/StudentDetailsPage.tsx'

const App: React.FC = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/landing-page" />} />

        <Route path="/landing-page" element={<LandingPage />} />
        <Route path="/admin/login" element={<LoginAdmin />} />
        <Route path="/admin/forgot-password" element={<ForgotPassword />} />
        <Route path="/admin/verify-otp" element={<VerifyOtp />} />
        <Route path="/admin/reset-password/" element={<ResetPassword />} />
        
        {/* <Route element={<AdminRoutes/>}> */}
          <Route element={<AdminLayout/>}>
            <Route path="/admin/dashboard" element={<AdminDashboardLayout />}/>
            <Route path="/admin/create-exam" element={<TestLinkManager/>} />
            <Route path="/admin/create-exam/generate-new-test" element={<CreateNewTest/>} />
            <Route path="/admin/coding-problem" element={<CodingProblem/>}/>
            <Route path="/admin/coding-problem/create-coding-problem" element={<CreateCodingProblem />} />
            <Route path="/admin/student-management" element={<StudentManagementLayout/>}/>
            <Route path="/submission/:id" element={<SubmissionDetails />} />
          </Route>
        {/* </Route> */}
        
        <Route path="/test/:slug" element={<TestEntryPage />} />
        <Route path="/test/:slug/student-details" element={<StudentDetailsPage />} />
        <Route path="/test/:slug/instruction" element={<TestInformationPage />} />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  )
}

export default App;
