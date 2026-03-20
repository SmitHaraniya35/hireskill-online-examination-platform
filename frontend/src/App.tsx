import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import LoginAdmin from "./features/auth/admin/Login.tsx";
import ForgotPassword from "./features/auth/admin/ForgotPassword.tsx";
import ResetPassword from "./features/auth/admin/ResetPassword.tsx";
import NotFound from "./components/shared/NotFound.tsx";
import VerifyOtp from "./features/auth/admin/VerifyOtp.tsx";
import TestLinkManager from "./features/TestManagement/TestsManager.tsx";
import CodingProblem from "./features/CodingProblemManagement/CodingProblems.tsx";
import CreateCodingProblem from "./features/CodingProblemManagement/CreateCodingProblem.tsx";
import LandingPage from "./components/LandingPage.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import StudentManagementLayout from "./features/StudentManagement/StudentManagementLayout.tsx";
import AdminDashboardLayout from "./features/DashboardManagement/AdminDashboardLayout.tsx";
import CreateNewTest from "./features/TestManagement/CreateNewTest.tsx";
import AssessmentPage from "./features/Assessment/AssessmentPage.tsx";
import StudentAttemptDetails from "./features/TestManagement/StudentResults/StudentAttemptDetailsLayout.tsx";
import StudentAttemptListView from "./features/TestManagement/StudentAttemptListsView.tsx";
import CompletionPage from "./features/Assessment/ComplitionPage.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx";
import TestFlowPage from "./features/Assessment/Onboarding/TestFlowPage.tsx";

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

        <Route element={<AdminRoutes />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboardLayout />} />
            <Route path="/admin/create-exam" element={<TestLinkManager />} />
            <Route
              path="/admin/create-exam/create-new-test"
              element={<CreateNewTest />}
            />
            <Route path="/admin/coding-problem" element={<CodingProblem />} />
            <Route
              path="/admin/coding-problem/create-coding-problem"
              element={<CreateCodingProblem />}
            />
            <Route
              path="/admin/student-management"
              element={<StudentManagementLayout />}
            />
            <Route
              path="/admin/tests/:testId/attempts"
              element={<StudentAttemptListView />}
            />
            <Route path="/submission/:id" element={<StudentAttemptDetails />} />
          </Route>
        </Route>

        <Route path="/test/:slug" element={<TestFlowPage />} />
        <Route
          path="/test/:slug/start/:studentAttemptId"
          element={
            // <StudentProtectedRoute>
              <AssessmentPage />
            // </StudentProtectedRoute>
          }
        />
        <Route path="/test/complete" element={<CompletionPage />} />

        <Route path="/*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
