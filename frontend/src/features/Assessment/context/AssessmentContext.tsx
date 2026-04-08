import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import testFlowService from "../../../services/testFlow.services";
import codingProblemService from "../../../services/codingProblem.services";
import type { AssignedProblems, SaveDraftData } from "../../../types/testFlow.types";
import type { CodingProblemData } from "../../../types/codingProblem.types";
import type { SupportedLanguage } from "../../../constants/languages";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ProblemStatus = "Not Attempted" | "Attempted" | "Submitted";

interface AssessmentContextType {
  // Data
  assignedProblems: AssignedProblems[];
  currentProblem: CodingProblemData | null;
  currentAssignedProblemId: string | null;
  currentProblemId: string | null;
  currentCode: string;
  currentLanguage: SupportedLanguage;
  isDashboardView: boolean;
  loading: boolean;
  testTitle: string;
  testDuration: number;
  testExpiresAt: string;
  studentAttemptId: string;

  // Actions
  setCurrentCode: (code: string) => void;
  setCurrentLanguage: (language: SupportedLanguage) => void;
  setCurrentAssignedProblemId: (id: string | null) => void;
  setCurrentProblemId: (id: string | null) => void;
  updateProblemStatus: (assignedProblemId: string, status: ProblemStatus) => void;
  toggleView: () => void;
  loadProblemDetails: (problemId: string, assignedProblemId: string) => Promise<void>;
  saveDraft: (assignedProblemId: string | null, data: SaveDraftData) => Promise<void>;
  saveDraftToSession: (assignedProblemId: string, data: SaveDraftData) => void;
}

// ─── Context Setup ────────────────────────────────────────────────────────────

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

const saveDraftToSession = (assignedProblemId: string, data: SaveDraftData) => {
  try {
    sessionStorage.setItem(
      `draft_${assignedProblemId}`,
      JSON.stringify({
        last_saved_code: data.last_saved_code,
        last_language: data.last_language,
        timestamp: Date.now(),
      })
    );
  } catch (error) {
    console.error("Failed to save draft to sessionStorage:", error);
  }
};

const getDraftFromSession = (assignedProblemId: string): SaveDraftData | null => {
  try {
    const raw = sessionStorage.getItem(`draft_${assignedProblemId}`);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

// ─── Provider ─────────────────────────────────────────────────────────────────

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { slug, studentAttemptId } = useParams<{
    slug: string;
    studentAttemptId: string;
  }>();

  // ── State ──────────────────────────────────────────────────────────────────
  const [assignedProblems, setAssignedProblems] = useState<AssignedProblems[]>([]);
  const [currentProblem, setCurrentProblem] = useState<CodingProblemData | null>(null);
  const [currentAssignedProblemId, setCurrentAssignedProblemId] = useState<string | null>(null);
  const [currentProblemId, setCurrentProblemId] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>("C++");
  const [isDashboardView, setIsDashboardView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(0);
  const [testExpiresAt, setTestExpiresAt] = useState("");

  // ── Fetch test data on mount ───────────────────────────────────────────────
  useEffect(() => {
    if (slug && studentAttemptId) {
      fetchTestData();
    }
  }, [slug, studentAttemptId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await testFlowService.getTestDataByStudentAttemptId(slug!, studentAttemptId!);

      if (response.success && response.payload) {
        const { test, studentAttempt, assignedProblems } = response.payload;
        setTestTitle(test.title);
        setTestDuration(test.duration_minutes);
        setTestExpiresAt(studentAttempt.expires_at);
        setAssignedProblems(assignedProblems);
      }
    } catch (error) {
      console.error("Failed to fetch test data:", error);
    } finally {
      setLoading(false);
    }
  };

  // ── Load a specific problem ────────────────────────────────────────────────
  /**
   * Called when the user clicks a problem in the Sidebar or ProblemCard.
   *
   * KEY RULE: We resolve ALL values (code, language) BEFORE calling setState.
   * This way, React can batch all the setState calls together into ONE re-render,
   * instead of firing 4-5 separate re-renders with stale/intermediate data.
   */
  const loadProblemDetails = useCallback(async (
    problemId: string,
    assignedProblemId: string
  ) => {
    try {
      // Mark problem as "Attempted" if it hasn't been started yet
      await testFlowService.attempted(assignedProblemId);

      const matchedProblem = assignedProblems.find((ap) => ap.id === assignedProblemId);
      if (matchedProblem?.status === "Not Attempted") {
        updateProblemStatus(assignedProblemId, "Attempted");
      }

      // Fetch the full problem data from server
      const response = await codingProblemService.getCodingProblemWithTestCases(problemId, true);

      if (!response.success || !response.payload) return;

      const problem = response.payload.codingProblemWithTestCases;

      // Check if user already has saved code for this problem (from sessionStorage)
      const savedDraft = getDraftFromSession(assignedProblemId);

      // Decide what code + language to show in the editor
      // Priority: saved draft > fresh template
      const resolvedLanguage: SupportedLanguage =
        (savedDraft?.last_language as SupportedLanguage) ?? (problem.templateCodes![0].language as SupportedLanguage);

      const resolvedCode: string =
        savedDraft?.last_saved_code ?? problem.templateCodes![0].basic_code_layout;

      // Set ALL state at once — React batches these into a single re-render
      setCurrentProblem(problem);
      setCurrentProblemId(problemId);
      setCurrentAssignedProblemId(assignedProblemId);
      setCurrentLanguage(resolvedLanguage);
      setCurrentCode(resolvedCode);

      // If no draft existed, save the fresh template to session so future
      // language switches can fall back to it
      if (!savedDraft?.last_saved_code) {
        saveDraftToSession(assignedProblemId, {
          last_language: resolvedLanguage,
          last_saved_code: resolvedCode,
        });
      }
    } catch (error) {
      console.error("Failed to load problem details:", error);
    }
  }, [assignedProblems]);

  // ── Save draft (server + session) ─────────────────────────────────────────
  /**
   * Saves the user's code to the backend AND sessionStorage.
   * If the backend call fails, sessionStorage still has the data as a backup.
   */
  const saveDraft = useCallback(async (
    assignedProblemId: string | null,
    data: SaveDraftData
  ) => {
    // Skip silently if we don't have the required data
    if (!assignedProblemId || !data.last_saved_code) return;

    try {
      await testFlowService.saveDraft(assignedProblemId, data);
      saveDraftToSession(assignedProblemId, data); // keep session in sync
    } catch (error) {
      // Backend failed, but we still save locally so the user doesn't lose work
      saveDraftToSession(assignedProblemId, data);
    }
  }, []);

  // ── Other actions ──────────────────────────────────────────────────────────

  const updateProblemStatus =  async (assignedProblemId: string, status: ProblemStatus) => {
    await testFlowService.submitted(assignedProblemId)
    setAssignedProblems((prev) =>
      prev.map((p) => (p.id === assignedProblemId ? { ...p, status } : p))
    );
  };

  const toggleView = () => setIsDashboardView((prev) => !prev);

  // ── Provide everything to child components ─────────────────────────────────
  return (
    <AssessmentContext.Provider
      value={{
        assignedProblems,
        currentProblem,
        currentAssignedProblemId,
        currentProblemId,
        currentCode,
        currentLanguage,
        isDashboardView,
        loading,
        testTitle,
        testDuration,
        testExpiresAt,
        studentAttemptId: studentAttemptId!,
        setCurrentCode,
        setCurrentLanguage,
        setCurrentAssignedProblemId,
        setCurrentProblemId,
        updateProblemStatus,
        toggleView,
        loadProblemDetails,
        saveDraft,
        saveDraftToSession,
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

// ─── Custom Hook ──────────────────────────────────────────────────────────────

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used inside <AssessmentProvider>.");
  }
  return context;
};