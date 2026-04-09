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
  email?: string;
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
        email: data.email,
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
          {isPublicTest
            ? "Fill in your details to continue"
            : "Verify and update your details"}
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
              Email address
            </label>
            <input
              type="text"
              value={flowState.email}
              disabled
              className="w-full px-4 py-[11px] text-[14px] border border-gray-200 rounded-xl bg-gray-50 text-gray-500 font-normal cursor-not-allowed"
            />
          </div>

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
              <p className="text-red-400 text-xs mt-1.5 font-normal">
                {errors.name.message}
              </p>
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
                <p className="text-red-400 text-xs mt-1.5 font-normal">
                  {errors.phone.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1.5 font-normal">
                  {errors.branch.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1.5 font-normal">
                  {errors.college.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1.5 font-normal">
                  {errors.degree.message}
                </p>
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
                <p className="text-red-400 text-xs mt-1.5 font-normal">
                  {errors.graduation_year.message}
                </p>
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
              <p className="text-red-400 text-xs mt-1.5 font-normal">
                {errors.skills.message}
              </p>
            )}
            <p className="text-[11px] text-gray-400 mt-2 font-normal">
              Separate each skill with a comma.
            </p>
          </div>
        </div>

        {serverError && (
          <p className="text-red-400 text-sm mb-6 text-center font-normal">
            {serverError}
          </p>
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-[2rem] p-10 w-full max-w-2xl mt-10">
      {/* Header — Matches Step 1 & 2 */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 bg-gray-50 border border-gray-100 rounded-full px-3 py-1 mb-5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span className="text-[11px] font-medium text-gray-500 tracking-wide">
            Step 3 of 3
          </span>
        </div>
        <h1 className="text-[1.4rem] font-medium text-gray-900 leading-snug tracking-tight mb-1">
          Test Access & Instructions
        </h1>
        <p className="text-[14px] text-gray-400 font-normal">
          Please review the guidelines carefully before starting.
        </p>
      </div>

      <div className="h-px bg-gray-100 mb-8" />

      {/* Content Section — Matches Step 2's spacing */}
      <div className="mb-8 space-y-6">
        <div className="space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Key Instructions
          </p>
          
          <ul className="space-y-4">
            {[
              { label: "Integrity", text: "Plagiarism is strictly prohibited." },
              { label: "Fullscreen Required", text: "Test will end if you exit fullscreen or switch tabs." },
              { label: "Proctoring Active", text: "Webcam & microphone monitoring enabled (no talking)." },
              { label: "Shortcuts Blocked", text: "Copy/Paste and Inspect element are disabled." },
              { label: "Penalty", text: "Tab switching triggers a 5-second auto-finish countdown." },
            ].map((item, idx) => (
              <li key={idx} className="flex gap-3 items-start">
                <div className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[#1D9E75] shrink-0" />
                <p className="text-[14px] text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-800">{item.label}:</span> {item.text}
                </p>
              </li>
            ))}
          </ul>
        </div>

        <div className="h-px bg-gray-100" />

        <div className="space-y-4">
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-400">
            Readiness Checklist
          </p>
          
          <label className="flex items-center gap-3 p-4 border border-gray-100 rounded-xl bg-gray-50/50 cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="checkbox"
              checked={rulesAccepted}
              onChange={(e) => setRulesAccepted(e.target.checked)}
              className="accent-[#1D9E75] w-4 h-4 cursor-pointer"
            />
            <span className={`text-[13px] font-medium transition-colors ${rulesAccepted ? "text-[#0F6E56]" : "text-gray-500"}`}>
              I have read and agree to follow all rules mentioned above
            </span>
          </label>
        </div>
      </div>

      {/* Button — Matches Step 1 & 2 Styling */}
      <button
        onClick={handleBeginTest}
        disabled={loading || !rulesAccepted}
        className="w-full bg-[#1D9E75] text-white font-medium py-3.5 rounded-xl hover:bg-[#188c67] active:scale-[0.99] transition-all text-[14px] tracking-wide disabled:opacity-40 disabled:cursor-not-allowed"
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
