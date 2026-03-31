import { useNavigate, useParams, useBeforeUnload } from "react-router-dom";
import { useState, useEffect, useCallback } from "react";
import Stepper from "../../../components/shared/Stepper";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  emailSchema,
  type EmailInput,
} from "../../../validators/testEntryPage.validators";
import {
  studentDetailsSchema,
  type StudentDetailsInput,
} from "../../../validators/studentDetails.validators";
import testFlowService from "../../../services/testFlow.services";
import studentService from "../../../services/student.services";
import type { TestData } from "../../../types/testFlow.types";
import { CalendarIcon, ClipboardIcon, ClockIcon } from "lucide-react";

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
      const response =
        await testFlowService.validateStudentAttemptByEmailAndTestId({
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

  const expirationDate = new Date(testData.expiration_at).toLocaleString(
    "en-US",
    {
      month: "numeric",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    },
  );

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 w-full max-w-md mt-10 relative">
      {/* Header */}
      <div className="mb-7">
        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-gray-500 tracking-wide">
            Step 1 of 3
          </span>
        </div>
        <h1 className="text-[1.4rem] font-medium text-gray-900 leading-snug tracking-tight mb-1.5">
          Get access
        </h1>
        <p className="text-[14px] text-gray-400 font-normal">
          Verify your email to continue
        </p>
      </div>

      {/* Assessment card */}
      <div className="border border-gray-100 rounded-2xl p-5 mb-7">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-[9.5px] font-medium uppercase tracking-widest text-gray-400 mb-1.5">
              Assessment
            </p>
            <h2 className="text-[15px] font-medium text-gray-900 leading-snug">
              {testData.title}
            </h2>
          </div>
          <div className="shrink-0 w-9 h-9 rounded-full border border-gray-100 flex items-center justify-center text-gray-300">
            <ClipboardIcon className="w-[18px] h-[18px]" />
          </div>
        </div>

        <div className="h-px bg-gray-100 my-4" />

        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
            <ClockIcon className="w-3.5 h-3.5 text-gray-400 shrink-0" />
            <div>
              <p className="text-[9px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">
                Duration
              </p>
              <p className="text-[12px] font-medium text-gray-800">
                {testData.duration_minutes} minutes
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 bg-gray-50 border border-gray-100 rounded-xl px-3 py-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-gray-400" />
            <div>
              <p className="text-[9px] font-medium uppercase tracking-widest text-gray-400 mb-0.5">
                Expires
              </p>
              <p className="text-[12px] font-medium text-gray-800">
                {expirationDate}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 bg-[#E1F5EE] border border-[#9FE1CB] rounded-xl px-3 py-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-[#0F6E56]" />
            <p className="text-[12px] font-medium text-[#085041]">Active</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onFormSubmit)} className="mb-2">
        <div className="mb-5">
          <label className="block text-[10px] font-medium uppercase tracking-widest text-gray-400 mb-2 ml-0.5">
            Email address
          </label>
          <input
            type="email"
            {...register("email")}
            placeholder="your@email.com"
            className={`w-full px-4 py-3 text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800 font-normal
            placeholder:text-gray-300
            focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
            ${errors.email ? "border-red-300 focus:ring-red-100 focus:border-red-400" : "border-gray-200"}`}
          />
          {errors.email && (
            <p className="text-red-400 text-xs mt-1.5 ml-0.5 font-normal">
              {errors.email.message}
            </p>
          )}
        </div>

        {serverError && (
          <p className="text-red-400 text-sm mb-4 text-center font-normal">
            {serverError}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1D9E75] text-white font-medium py-3.5 rounded-xl hover:bg-[#188c67] active:scale-[0.99] transition-all text-[14px] tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Verifying…" : "Continue"}
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

        if (response.payload!.student.name) {
          reset({
            name: response.payload!.student.name,
            phone: response.payload!.student.phone
              ? String(response.payload!.student.phone)
              : " ",
            college: response.payload!.student.college,
            degree: response.payload!.student.degree,
            graduation_year: response.payload!.student.graduation_year
              ? String(response.payload!.student.graduation_year)
              : " ",
            skills: response.payload!.student.skills,
            branch: response.payload!.student.branch,
          });
        }
      } catch (error: any) {
        setServerError(
          error.response?.data?.message || "Failed to load student details",
        );
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
      setServerError(
        error.response?.data?.message || "Failed to save student details",
      );
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center mt-20">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#24a17e] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">
            Loading student details...
          </p>
        </div>
      </div>
    );
  }

return (
  <div className="bg-white border border-gray-100 rounded-[2rem] p-10 w-full max-w-2xl mt-10">

    {/* Header */}
    <div className="mb-8">
      <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-gray-500 tracking-wide">
            Step 2 of 3
          </span>
        </div>
      <h1 className="text-[1.4rem] font-medium text-gray-900 leading-snug tracking-tight mb-1">
        Complete your profile
      </h1>
      <p className="text-[14px] text-gray-400 font-normal">
        {isPublicTest ? "Fill in your details to continue" : "Verify and update your details"}
      </p>
    </div>

    <div className="h-px bg-gray-100 mb-8" />

    <form onSubmit={handleSubmit(onFormSubmit)}>

      {/* Section 1 — Personal Information */}
      <div className="mb-8 space-y-5">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
          Personal information
        </p>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
            Full name <span className="text-red-400">*</span>
          </label>
          <input
            {...register("name")}
            placeholder="Enter your full name"
            className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
              placeholder:text-gray-300 font-normal
              focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
              ${errors.name ? "border-red-300" : "border-gray-200"}`}
          />
          {errors.name && (
            <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.name.message}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              Contact phone <span className="text-red-400">*</span>
            </label>
            <input
              {...register("phone")}
              placeholder="e.g. 9876543210"
              className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
                placeholder:text-gray-300 font-normal
                focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
                ${errors.phone ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.phone && (
              <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.phone.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              Branch <span className="text-red-400">*</span>
            </label>
            <input
              {...register("branch")}
              placeholder="e.g. Computer Science"
              className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
                placeholder:text-gray-300 font-normal
                focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
                ${errors.branch ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.branch && (
              <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.branch.message}</p>
            )}
          </div>
        </div>
      </div>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Section 2 — Educational Background */}
      <div className="mb-8 space-y-5">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
          Educational background
        </p>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              College <span className="text-red-400">*</span>
            </label>
            <input
              {...register("college")}
              placeholder="College name"
              className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
                placeholder:text-gray-300 font-normal
                focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
                ${errors.college ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.college && (
              <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.college.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              Degree <span className="text-red-400">*</span>
            </label>
            <input
              {...register("degree")}
              placeholder="e.g. B.Tech"
              className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
                placeholder:text-gray-300 font-normal
                focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
                ${errors.degree ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.degree && (
              <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.degree.message}</p>
            )}
          </div>
          <div>
            <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
              Graduation year <span className="text-red-400">*</span>
            </label>
            <input
              {...register("graduation_year")}
              placeholder="e.g. 2026"
              className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
                placeholder:text-gray-300 font-normal
                focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
                ${errors.graduation_year ? "border-red-300" : "border-gray-200"}`}
            />
            {errors.graduation_year && (
              <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.graduation_year.message}</p>
            )}
          </div>
        </div>
        <p className="text-[11px] text-gray-400 italic font-normal">
          Ensure details match your academic records.
        </p>
      </div>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Section 3 — Technical Skills */}
      <div className="mb-8 space-y-5">
        <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
          Technical skills
        </p>

        <div>
          <label className="block text-[12px] font-medium text-gray-600 mb-1.5">
            Skills <span className="text-red-400">*</span>
          </label>
          <input
            {...register("skills")}
            placeholder="e.g. C++, Java, Python"
            className={`w-full px-4 py-[11px] text-[14px] border rounded-xl outline-none transition-all bg-white text-gray-800
              placeholder:text-gray-300 font-normal
              focus:ring-2 focus:ring-[#1D9E75]/15 focus:border-[#1D9E75]
              ${errors.skills ? "border-red-300" : "border-gray-200"}`}
          />
          {errors.skills && (
            <p className="text-red-400 text-xs mt-1.5 font-normal">{errors.skills.message}</p>
          )}
          <p className="text-[11px] text-gray-400 mt-2 font-normal">
            Separate each skill with a comma.
          </p>
        </div>
      </div>

      {serverError && (
        <p className="text-red-400 text-sm mb-6 text-center font-normal">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1D9E75] text-white font-medium py-3.5 rounded-xl hover:bg-[#188c67] active:scale-[0.99] transition-all text-[14px] tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {isSubmitting ? "Saving…" : "Save & continue"}
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
  const [rulesAccepted, setRulesAccepted] = useState(false);

  const handleBeginTest = async () => {
    if (!slug || !testId || !studentId || !rulesAccepted) return; 
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
      <h1 className="text-3xl font-bold mb-1 tracking-tight">
        Step 3: Test Access
      </h1>
      <p className="text-gray-500 font-bold mb-8">Test Instructions</p>

      <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm mb-8">
        <h2 className="text-xl font-bold mb-4">
          Assessment: Software Engineer
        </h2>
        <div className="grid grid-cols-2 gap-0 bg-[#f8f9fa] rounded-xl overflow-hidden border border-gray-100">
          <div className="p-4 border-r border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Total Problems
            </p>
            <p className="text-lg font-bold">2</p>
          </div>
          <div className="p-4 border-r border-gray-200">
            <p className="text-[10px] font-bold text-gray-400 uppercase">
              Total Time
            </p>
            <p className="text-lg font-bold">120 Minutes</p>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <p className="font-bold text-gray-800">Key Instructions:</p>
        <ul className="space-y-3">
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>Integrity: Plagiarism is strictly prohibited.</span>
          </li>
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>
              <strong>Fullscreen Required:</strong> Test will end if you exit
              fullscreen or switch tabs.
            </span>
          </li>
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>
              <strong>Proctoring Active:</strong> Webcam & microphone monitoring
              enabled (no talking/whispering).
            </span>
          </li>
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>
              <strong>Shortcuts Blocked:</strong> Copy/Paste (Ctrl+C/V), Print
              (Ctrl+P), Inspect (Ctrl+Shift+I) disabled.
            </span>
          </li>
          <li className="flex gap-2 text-sm text-gray-600">
            <span className="text-[#24a17e]">•</span>
            <span>
              <strong>5s Penalty:</strong> Tab switch or Alt+Tab triggers
              5-second auto-finish countdown.
            </span>
          </li>
        </ul>
      </div>

      <div className="space-y-2 mb-10">
        <p className="font-bold text-gray-800">Readiness Checklist:</p>
        <div className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={rulesAccepted}
            onChange={(e) => setRulesAccepted(e.target.checked)}
            className="accent-[#24a17e] w-4 h-4 cursor-pointer"
          />
          <span
            className={
              rulesAccepted ? "text-emerald-600 font-bold" : "text-gray-500"
            }
          >
            I have read and agree to follow all rules
          </span>
        </div>
      </div>

      <button
        onClick={handleBeginTest}
        disabled={loading || !rulesAccepted} // ✅ Disabled until checkbox checked
        className={`w-full font-bold py-4 rounded-xl shadow-lg shadow-emerald-50 transition-all duration-200 ${
          loading || !rulesAccepted
            ? "bg-gray-300 text-gray-500 cursor-not-allowed opacity-70"
            : "bg-[#24a17e] text-white hover:bg-[#1d8265] hover:shadow-emerald-100"
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
      [isTestInProgress],
    ),
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
        setFetchError(
          error.response?.data?.message || "Failed to load test details",
        );
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
    [navigate, slug],
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
          <p className="text-red-500 font-medium mb-4">
            {fetchError || "Test not found"}
          </p>
        </div>
      </div>
    );
  }

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center pt-12 px-4 pb-20 ">
      <Stepper step={step} />

      {step === 1 && (
        <Step1EmailVerification
          testData={testData}
          onSuccess={handleStep1Success}
        />
      )}

      {step === 2 && (
        <Step2StudentDetails
          flowState={flowState}
          onSuccess={handleStep2Success}
          slug={slug!}
        />
      )}

      {step === 3 && (
        <Step3Instructions
          flowState={flowState}
          slug={slug!}
          onBegin={handleBegin}
        />
      )}
    </div>
  );
};

export default TestFlowPage;
