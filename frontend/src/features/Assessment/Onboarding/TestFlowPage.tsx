import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Stepper from "../../../components/shared/Stepper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { emailSchema, type EmailInput } from "../../../validators/testEntryPage.validators"
import { studentDetailsSchema, type StudentDetailsInput } from "../../../validators/studentDetails.validators";
import testFlowService from "../../../services/testFlow.services"
import studentService from "../../../services/student.services";
import type { TestData } from '../../../types/testFlow.types';

// ─── Step type ────────────────────────────────────────────────────────────────
type Step = 1 | 2 | 3;

// ─── Shared state passed forward between steps ────────────────────────────────
interface FlowState {
  studentId?: string;
  testId?: string;
}

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 1 — Email Verification
// ═══════════════════════════════════════════════════════════════════════════════
interface Step1Props {
  testData: TestData;
  onSuccess: (state: FlowState) => void;
}

const Step1EmailVerification = ({ testData, onSuccess }: Step1Props) => {
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EmailInput>({
    resolver: zodResolver(emailSchema),
    mode: "onTouched",
  });

  const onFormSubmit = async (data: EmailInput) => {
    setServerError("");
    try {
      const response = await testFlowService.validateStudentAttemptByEmailAndTestId({
        test_id: testData.id,
        email: data.email,
      });
      onSuccess({
        studentId: response.payload!.studentId,
        testId: testData.id,
      });
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Validation failed");
    }
  };

  const expirationDate = new Date(testData.expiration_at).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  });

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.04)] w-full max-w-md border border-gray-100 mt-10 relative">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-2 tracking-tight">
        Step 1: Get Access
      </h1>
      <p className="text-gray-500 font-semibold mb-8">Verify your email</p>

      <div className="bg-[#fcfcfc] border border-gray-100 p-6 rounded-2xl mb-8 shadow-sm">
        <h2 className="text-xl font-bold text-gray-800 leading-tight">{testData.title}</h2>
        <div className="mt-2 space-y-1">
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
            Duration: {testData.duration_minutes} minutes
          </p>
          <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">
            Expires at: {expirationDate}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onFormSubmit)} className="mb-10">
        <div>
          <label className="block text-[10px] font-black text-gray-400 uppercase mb-2 tracking-widest ml-1">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="Enter valid email address"
            className={`w-full p-4 border rounded-xl outline-none focus:ring-2 focus:ring-[#24a17e]/20 focus:border-[#24a17e] transition-all bg-white text-gray-700 font-medium ${
              errors.email ? "border-red-500" : "border-gray-200"
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
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 2 — Student Details
// ═══════════════════════════════════════════════════════════════════════════════
interface Step2Props {
  flowState: FlowState;
  onSuccess: () => void;
  slug: string;
}

const Step2StudentDetails = ({ flowState, onSuccess }: Step2Props) => {
  const { studentId } = flowState;
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isPublicTest, setIsPublicTest] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentDetailsInput>({
    resolver: zodResolver(studentDetailsSchema),
    mode: "onTouched",
  });

  useEffect(() => {
    const fetchStudentDetails = async () => {
      if (!studentId) {
        setIsPublicTest(true);
        return;
      }
      try {
        setLoading(true);
        setIsPublicTest(false);
        const response = await studentService.getStudentById(studentId);
        
        if (response.payload!.student.name){
          reset({
          name: response.payload!.student.name,
          phone: response.payload!.student.phone ? String(response.payload!.student.phone): " ",
          college: response.payload!.student.college,
          degree: response.payload!.student.degree,
          graduation_year: response.payload!.student.graduation_year ? String(response.payload!.student.graduation_year): " ",
          skills: response.payload!.student.skills,
          branch: response.payload!.student.branch,
        });
        }
        
      } catch (error: any) {
        setServerError(error.response?.data?.message || "Failed to load student details");
      } finally {
        setLoading(false);
      }
    };
    fetchStudentDetails();
  }, [studentId, reset]);

  const onFormSubmit = async (data: StudentDetailsInput) => {
    if (!studentId) {
      setServerError("Student ID not found");
      return;
    }
    setServerError("");
    try {
      await testFlowService.completeStudentDetails(data, studentId);
      onSuccess();
    } catch (error: any) {
      setServerError(error.response?.data?.message || "Failed to save student details");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#24a17e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading student details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-4xl border border-gray-100 mt-10">
      <h1 className="text-3xl font-bold text-center mb-2">Welcome, Complete Your Profile</h1>
      <p className="text-center text-gray-400 font-bold mb-10">
        {isPublicTest ? "Fill your details" : "Verify and update your details"}
      </p>

      <form onSubmit={handleSubmit(onFormSubmit)}>
        <div className="grid grid-cols-12 gap-6">
          {/* Section 1 */}
          <div className="col-span-12 md:col-span-7 space-y-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Section 1: Personal Information
            </p>
            <div>
              <label className="text-xs font-bold text-gray-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                {...register("name")}
                className={`w-full p-3 border rounded-lg mt-1 ${errors.name ? "border-red-500" : "border-gray-200"}`}
                placeholder="Enter your full name"
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Contact Phone <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  className={`w-full p-3 border rounded-lg mt-1 ${errors.phone ? "border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. 9876543210"
                />
                {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Branch <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("branch")}
                  className={`w-full p-3 border rounded-lg mt-1 ${errors.branch ? "border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. Computer Science"
                />
                {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>}
              </div>
            </div>
          </div>

          {/* Resume Box */}
          <div className="col-span-12 md:col-span-5 flex flex-col pt-6">
            <div className="border-2 border-dashed border-gray-200 rounded-2xl flex-1 flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-white transition-colors cursor-pointer">
              <div className="text-gray-300 text-3xl mb-2">📤</div>
              <p className="text-xs font-bold text-gray-600">Resume Upload (Optional)</p>
              <p className="text-[10px] text-gray-400 mt-1">
                {isPublicTest ? "No file uploaded" : "Current File: Student_Resume.pdf"}
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div className="col-span-12 space-y-4 mt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Section 2: Educational Background
            </p>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600">
                  College <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("college")}
                  className={`w-full p-3 border rounded-lg ${errors.college ? "border-red-500" : "border-gray-200"}`}
                  placeholder="College name"
                />
                {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college.message}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Degree <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("degree")}
                  className={`w-full p-3 border rounded-lg ${errors.degree ? "border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. B.Tech"
                />
                {errors.degree && <p className="text-red-500 text-xs mt-1">{errors.degree.message}</p>}
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600">
                  Graduation Year <span className="text-red-500">*</span>
                </label>
                <input
                  {...register("graduation_year")}
                  className={`w-full p-3 border rounded-lg ${errors.graduation_year ? "border-red-500" : "border-gray-200"}`}
                  placeholder="e.g. 2026"
                />
                {errors.graduation_year && (
                  <p className="text-red-500 text-xs mt-1">{errors.graduation_year.message}</p>
                )}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 italic">
              Please ensure details match your academic records.
            </p>
          </div>

          {/* Section 3 */}
          <div className="col-span-12 space-y-4 mt-4">
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
              Section 3: Technical Skills
            </p>
            <div>
              <label className="text-xs font-bold text-gray-600">
                Skills <span className="text-red-500">*</span>
              </label>
              <input
                {...register("skills")}
                className={`w-full p-3 border rounded-lg ${errors.skills ? "border-red-500" : "border-gray-200"}`}
                placeholder="e.g. C++, Java, Python"
              />
              {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills.message}</p>}
            </div>
          </div>
        </div>

        {serverError && <p className="text-red-500 text-sm mt-6 text-center">{serverError}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#24a17e] text-white font-bold py-4 rounded-xl mt-10 hover:bg-[#1d8265] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Saving..." : "Save & Continue"}
        </button>
      </form>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// STEP 3 — Instructions
// ═══════════════════════════════════════════════════════════════════════════════
interface Step3Props {
  flowState: FlowState;
  slug: string;
  onBegin: (studentAttemptId: string) => void;
}

const Step3Instructions = ({ flowState, slug, onBegin }: Step3Props) => {
  const { studentId, testId } = flowState;
  const [loading, setLoading] = useState(false);

  const handleBeginTest = async () => {
    if (!slug || !testId || !studentId) return;
    setLoading(true);
    try {
      const response = await testFlowService.startTest(slug, testId, studentId);
      if (response.success && response.payload) {
        onBegin(response.payload.studentAttemptId);
      }
    } catch (error) {
      console.error("Failed to start test:", error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] w-full max-w-2xl mt-10 border border-gray-100">
      <h1 className="text-3xl font-bold mb-1 tracking-tight">Step 3: Test Access</h1>
      <p className="text-gray-500 font-bold mb-8">Test Instructions</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">Assessment: Software Engineer</h2>
        <div className="grid grid-cols-3 gap-0 bg-[#f8f9fa] rounded-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-r border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Problems</p>
            <p className="text-lg font-bold">2</p>
          </div>
          <div className="p-4 border-r border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Total Time</p>
            <p className="text-lg font-bold">120 Minutes</p>
          </div>
          <div className="p-4">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Remaining Time</p>
            <p className="text-lg font-bold text-gray-400">[Not Started]</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <p className="font-bold text-gray-800">Key and Instructions:</p>
        <ul className="space-y-3">
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>Environment Check: Complete system test before starting.</span>
          </li>
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>Integrity: Plagiarism is strictly prohibited.</span>
          </li>
        </ul>
      </div>

      <div className="space-y-2 mb-10">
        <p className="font-bold text-gray-800">Readiness Checklist:</p>
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <input type="checkbox" checked readOnly className="accent-[#24a17e]" />
          <span>
            Read rules – <span className="text-emerald-600 font-bold">Ready</span>
          </span>
        </div>
      </div>

      <button
        onClick={handleBeginTest}
        disabled={loading}
        className={`w-full bg-[#24a17e] text-white font-bold py-4 rounded-xl shadow-lg shadow-emerald-50 transition-all ${
          loading ? "opacity-70 cursor-not-allowed" : "hover:bg-[#1d8265]"
        }`}
      >
        {loading ? "Starting..." : "Begin Test"}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════════
// ROOT — Single-page flow at /test/:slug
// ═══════════════════════════════════════════════════════════════════════════════
const TestFlowPage = () => {
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const [step, setStep] = useState<Step>(1);
  const [flowState, setFlowState] = useState<FlowState>({});
  const [testData, setTestData] = useState<TestData | undefined>(undefined);
  const [loadingTest, setLoadingTest] = useState(true);
  const [fetchError, setFetchError] = useState("");

  // ── Block in-app navigation (back button, router link clicks) ────────────
  // Only active after email is verified (step > 1)
  const isTestInProgress = step > 1;

  // ── Block tab close / page refresh ────────────────────────────────────────
  // Browser standard: shows a native "Leave page?" dialog on refresh/close
  useBeforeUnload(
    useCallback(
      (e) => {
        if (isTestInProgress) e.preventDefault();
      },
      [isTestInProgress]
    )
  );

  // ── Fetch test by slug ─────────────────────────────────────────────────────
  useEffect(() => {
    const fetchTestDetails = async () => {
      if (!slug) return;
      try {
        setLoadingTest(true);
        const response = await testFlowService.getTestBySlug(slug);
        setTestData(response.payload!.test);
      } catch (error: any) {
        setFetchError(error.response?.data?.message || "Failed to load test details");
      } finally {
        setLoadingTest(false);
      }
    };
    fetchTestDetails();
  }, [slug]);

  // ── Step transition handlers ───────────────────────────────────────────────
  const handleStep1Success = useCallback((state: FlowState) => {
    setFlowState(state);
    setStep(2);
  }, []);

  const handleStep2Success = useCallback(() => {
    setStep(3);
  }, []);

  const handleBegin = useCallback(
    (studentAttemptId: string) => {
      navigate(`/test/${slug}/start/${studentAttemptId}`);
    },
    [navigate, slug]
  );

  // ── Loading / error states ─────────────────────────────────────────────────
  if (loadingTest) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#24a17e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading test details...</p>
        </div>
      </div>
    );
  }

  if (fetchError || !testData) {
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">{fetchError || "Test not found"}</p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center pt-12 px-4 pb-20 ">
      <Stepper step={step} />

      {step === 1 && (
        <Step1EmailVerification testData={testData} onSuccess={handleStep1Success} />
      )}

      {step === 2 && (
        <Step2StudentDetails
          flowState={flowState}
          onSuccess={handleStep2Success}
          slug={slug!}
        />
      )}

      {step === 3 && (
        <Step3Instructions flowState={flowState} slug={slug!} onBegin={handleBegin} />
      )}
    </div>
  );
};

export default TestFlowPage;