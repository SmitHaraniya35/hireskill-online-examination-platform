import { useNavigate, useParams } from "react-router-dom";
import Stepper from "../../../../components/shared/Stepper";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailInput } from "../../../../validators/testEntryPage.validators";
import testFlowService from "../../../../services/testFlow.services";
import type { TestData } from "../../../../types/testFlow.types"

const TestEntryPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();
  const [serverError, setServerError] = useState("");
  const [testData, setTestData] = useState<TestData | undefined>(undefined);
  const [loading, setLoading] = useState(true);

  // Fetch test details using slug
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!slug) return;
      
      try {
        setLoading(true);
        const response = await testFlowService.getTestBySlug(slug);
        setTestData(response.payload!.test);
      } catch (error: any) {
        setServerError(error.response?.data?.message || "Failed to load test details");
      } finally {
        setLoading(false);
      }
    };

    fetchTestDetails();
  }, [slug]);

  // React Hook Form with Zod validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onTouched"
  });

  const onFormSubmit = async (data: EmailInput) => {
    if (!testData) return;
    
    setServerError('');
    try {
      const response = await testFlowService.validateStudentAttemptByEmail({
        test_id: testData.id,
        email: data.email
      });
      
      // Navigate to student details page with studentId and testId
      navigate(`/test/${slug}/student-details`, {
        state: {
          studentId: response.payload!.studentId,
          testId: testData.id,
          email: data.email
        }
      });
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Validation failed");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#24a17e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (!testData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">Test not found</p>
          <button
            onClick={() => navigate('/')}
            className="bg-[#24a17e] text-white px-6 py-2 rounded-lg hover:bg-[#1d8265]"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Format expiration date
  const expirationDate = new Date(testData!.expiration_at).toLocaleString('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center pt-12 px-4 font-mono">
      <Stepper step={1} />

      <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] w-full max-w-md border border-gray-100 mt-10 relative">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
          Step 1: Get Access
        </h1>
        <p className="text-gray-500 font-semibold mb-8">Verify your email</p>

        {/* Info Box */}
        <div className="bg-[#fcfcfc] border border-gray-100 p-6 rounded-2xl mb-8 shadow-sm">
          <h2 className="text-xl font-bold text-gray-800 leading-tight">
            {testData!.title}
          </h2>
          <div className="mt-2 space-y-1">
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Duration: {testData!.duration_minutes} minutes
            </p>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
              Expires at: {expirationDate}
            </p>
          </div>
        </div>

        {/* Form Field */}
        <form onSubmit={handleSubmit(onFormSubmit)} className="mb-10">
          <div>
            <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">
              Email Address
            </label>
            <input
              type="email"
              {...register("email")}
              placeholder="e.g. om@ddu.ac.in"
              className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#24a17e]/20 focus:border-[#24a17e] transition-all bg-white text-gray-700 font-medium ${
                errors.email ? 'border-red-500' : 'border-gray-200'
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 ml-1">{errors.email.message}</p>
            )}
          </div>

          {serverError && (
            <p className="text-red-500 text-sm mt-4 text-center">{serverError}</p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#24a17e] text-white font-bold py-4 rounded-xl hover:bg-[#1d8265] transition-all text-lg shadow-lg shadow-emerald-100 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-6"
          >
            {isSubmitting ? "Verifying..." : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TestEntryPage;