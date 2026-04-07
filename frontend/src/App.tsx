import { Route, Routes, Navigate } from "react-router-dom";
import "./App.css";
import { lazy, Suspense } from "react";

import LandingPage from "./components/LandingPage.tsx";
import AdminLayout from "./layouts/AdminLayout.tsx";
import AdminRoutes from "./routes/AdminRoutes.tsx";
import StudentProtectedRoute from "./routes/StudentProtectedRoute.tsx";
import AdminAuthProviderWrapper from "./routes/AdminAuthProviderWrapper.tsx";

// Lazy imports
const AdminLogin = lazy(() => import("./features/auth/admin/Login.tsx"));
const ForgotPassword = lazy(
  () => import("./features/auth/admin/ForgotPassword.tsx"),
);
const VerifyOtp = lazy(() => import("./features/auth/admin/VerifyOtp.tsx"));
const ResetPassword = lazy(
  () => import("./features/auth/admin/ResetPassword.tsx"),
);
const TestLinkManager = lazy(
  () => import("./features/TestManagement/TestsManager.tsx"),
);
const CodingProblem = lazy(
  () => import("./features/CodingProblemManagement/CodingProblems.tsx"),
);
const CreateCodingProblem = lazy(
  () => import("./features/CodingProblemManagement/CreateCodingProblem.tsx"),
);
const CreateNewTest = lazy(
  () => import("./features/TestManagement/CreateNewTest.tsx"),
);
const StudentManagementLayout = lazy(
  () => import("./features/StudentManagement/StudentManagementLayout.tsx"),
);
const StudentDetailPage = lazy(
  () => import("./features/StudentManagement/StudentDetailPage.tsx"),
);
const StudentAttemptListView = lazy(
  () => import("./features/TestManagement/StudentAttemptListsView.tsx"),
);
const StudentAttemptDetails = lazy(
  () =>
    import("./features/TestManagement/StudentResults/StudentAttemptDetailsLayout.tsx"),
);
const TestFlowPage = lazy(
  () => import("./features/Assessment/Onboarding/TestFlowPage.tsx"),
);
const AssessmentPage = lazy(
  () => import("./features/Assessment/AssessmentPage.tsx"),
);
const CompletionPage = lazy(
  () => import("./features/Assessment/CompletionPage.tsx"),
);
const Dashboard = lazy(() => import("./features/DashboardManagement/Dashboard.tsx"));
const NotFound = lazy(() => import("./components/shared/NotFound.tsx"));

// Simple Loader (replace with spinner UI)
const Loader = () => (
  <div className="flex justify-center items-center h-screen">Loading...</div>
);

const App: React.FC = () => {
  return (
    <Suspense fallback={<Loader />}>
      <Routes>
        <Route element={<AdminAuthProviderWrapper />}>
          <Route path="/" element={<Navigate to="/landing-page" />} />
          <Route path="/landing-page" element={<LandingPage />} />

          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/forgot-password" element={<ForgotPassword />} />
          <Route path="/admin/verify-otp" element={<VerifyOtp />} />
          <Route path="/admin/reset-password/" element={<ResetPassword />} />

          <Route element={<AdminRoutes />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin/dashboard" element={<Dashboard />} />
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
                path="/admin/student-management/students/:id"
                element={<StudentDetailPage />}
              />
              <Route
                path="/admin/tests/:testId/attempts"
                element={<StudentAttemptListView />}
              />
              <Route
                path="/submission/:id"
                element={<StudentAttemptDetails />}
              />
            </Route>
          </Route>
        </Route>

        <Route path="/test/:slug" element={<TestFlowPage />} />

        <Route
          path="/test/:slug/start/:studentAttemptId"
          element={
            <StudentProtectedRoute>
              <AssessmentPage />
            </StudentProtectedRoute>
          }
        />

        <Route
          path="/test/complete"
          element={
              <CompletionPage />
          }
        />
        {/* <Route path="/admin/student-management/create-student" element={<CreateStudent />} */}
  
        {/* FIXED: No auth wrapper */}
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default App;
