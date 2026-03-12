import HeroSection from "./HeroSection";
import TestPerformanceGraph from "./TestPerformanceGraph";
import ErrorDistributionGraph from "./ErrorDistributionGraph";
import ProblemAnalyticsSection from "./ProblemAnalyticsSection";

const AdminDashboardLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-6 space-y-6">
      <h1 className="text-2xl font-semibold text-gray-800">
        Admin Dashboard
      </h1>

      <HeroSection />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TestPerformanceGraph />
        </div>

        <ErrorDistributionGraph />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6">
        <ProblemAnalyticsSection />
      </div>
    </div>
  );
};

export default AdminDashboardLayout;