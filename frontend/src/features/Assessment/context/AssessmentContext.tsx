import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import testFlowService from "../../../services/testFlow.services";
import codingProblemService from "../../../services/codingProblem.services";
import { useParams } from "react-router-dom";
import type {
  AssignedProblems,
  SaveDraftData,
} from "../../../types/testFlow.types";
import type { CodingProblemData } from "../../../types/codingProblem.types";
import type { SupportedLanguage } from "../../../constants/languages";

export type ProblemStatus = "Not Attempted" | "Attempted" | "Submitted";

interface AssessmentContextType {
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
  setCurrentAssignedProblemId: (id: string | null) => void;
  updateProblemStatus: (
    assignedProblemId: string,
    status: ProblemStatus,
  ) => void;
  toggleView: () => void;
  loadProblemDetails: (
    problemId: string,
    assignedProblemId: string,
  ) => Promise<void>;
  setCurrentProblemId: (id: string | null) => void;
  saveDraft: (id: string, data: SaveDraftData) => Promise<void>;
  setCurrentCode: (code: string) => void;
  setCurrentLanguage: (language: SupportedLanguage) => void;
  saveDraftToSession: (assignedProblemId: string, data: SaveDraftData) => void;
}

const AssessmentContext = createContext<AssessmentContextType | undefined>(
  undefined,
);

export const AssessmentProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { slug, studentAttemptId } = useParams<{
    slug: string;
    studentAttemptId: string;
  }>();

  const [assignedProblems, setAssignedProblems] = useState<AssignedProblems[]>(
    [],
  );
  const [currentProblem, setCurrentProblem] =
    useState<CodingProblemData | null>(null);
  const [currentAssignedProblemId, setCurrentAssignedProblemIdState] = useState<
    string | null
  >(null);
  const [currentProblemId, setCurrentProblemId] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState("");
  const [currentLanguage, setCurrentLanguage] =
    useState<SupportedLanguage>("C++");
  const [isDashboardView, setIsDashboardView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [testTitle, setTestTitle] = useState("");
  const [testDuration, setTestDuration] = useState(0);
  const [testExpiresAt, setTestExpiresAt] = useState("");

  const getDraftFromSession = useCallback((assignedProblemId: string) => {
    try {
      const draft = sessionStorage.getItem(`draft_${assignedProblemId}`);
      return draft ? JSON.parse(draft) : null;
    } catch {
      return null;
    }
  }, []);

  const saveDraftToSession = useCallback(
    (assignedProblemId: string, data: SaveDraftData) => {
      try {
        sessionStorage.setItem(
          `draft_${assignedProblemId}`,
          JSON.stringify({
            last_saved_code: data.last_saved_code,
            last_language: data.last_language,
            timestamp: Date.now(),
          }),
        );
      } catch (error) {
        console.error("SessionStorage save failed:", error);
      }
    },
    [],
  );

  useEffect(() => {
    if (slug && studentAttemptId) {
      fetchTestData();
    }
  }, [slug, studentAttemptId]);

  const fetchTestData = async () => {
    try {
      setLoading(true);
      const response = await testFlowService.getTestDataByStudentAttemptId(
        slug!,
        studentAttemptId!,
      );

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

  // loadProblemDetails with SessionStorage restore
  const loadProblemDetails = async (
    problemId: string,
    assignedProblemId: string,
  ) => {
    try {
      await testFlowService.attempted(assignedProblemId);

      const currenAssignedProblem = assignedProblems.find(
        (ap) => ap.id === assignedProblemId,
      );
      if (currenAssignedProblem?.status === "Not Attempted") {
        updateProblemStatus(assignedProblemId, "Attempted");
      }

      const response = await codingProblemService.getCodingProblemWithTestCases(
        problemId,
        true,
      );

      if (response.success && response.payload) {
        const { codingProblemWithTestCases } = response.payload;
        setCurrentProblem(response.payload.codingProblemWithTestCases);
        setCurrentProblemId(problemId);
        setCurrentAssignedProblemIdState(assignedProblemId);

        const draft = getDraftFromSession(assignedProblemId);
        if (draft?.last_saved_code) {
          setCurrentCode(draft.last_saved_code);
          setCurrentLanguage(draft.last_language || "C++");
        } else {
          // Fresh template
          const templateCodes = codingProblemWithTestCases.templateCodes!;
          setCurrentCode(templateCodes[0].basic_code_layout);
          setCurrentLanguage(templateCodes[0].language);
          saveDraftToSession(assignedProblemId, {
            last_language: templateCodes[0].language,
            last_saved_code: templateCodes[0].basic_code_layout
          })
          console.log(currenAssignedProblem, currentCode, currentLanguage)
        }
      }
    } catch (error) {
      console.error("Failed to load problem details:", error);
    }
  };

  const updateProblemStatus = (
    assignedProblemId: string,
    status: ProblemStatus,
  ) => {
    setAssignedProblems((prev) =>
      prev.map((p) => (p.id === assignedProblemId ? { ...p, status } : p)),
    );
  };

  const toggleView = () => {
    setIsDashboardView((prev) => !prev);
  };

  // saveDraft: Backend + SessionStorage
  // const saveDraft = async (assignedProblemId: string, data: SaveDraftData) => {
  //   try {
  //     // 1. Save to backend (persistent)
  //     const response = await testFlowService.saveDraft(assignedProblemId, data);

  //     // 2. INSTANT cache to SessionStorage
  //     saveDraftToSession(assignedProblemId, data);
  //   } catch (error: any) {
  //     // SessionStorage still works!
  //     saveDraftToSession(assignedProblemId, data);
  //   }
  // };
  const saveDraft = async (
    assignedProblemId: string | null,
    data: SaveDraftData,
  ) => {
    if (!assignedProblemId || !data.last_saved_code) return; // Silent exit if invalid

    try {
      await testFlowService.saveDraft(assignedProblemId, data);
      saveDraftToSession(assignedProblemId, data);
    } catch (error) {
      saveDraftToSession(assignedProblemId, data);
    }
  };

  const setCurrentAssignedProblemId = (id: string | null) => {
    setCurrentAssignedProblemIdState(id);
  };

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
        setCurrentAssignedProblemId,
        updateProblemStatus,
        toggleView,
        loadProblemDetails,
        setCurrentProblemId,
        saveDraft,
        setCurrentCode,
        setCurrentLanguage,
        saveDraftToSession
      }}
    >
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error("useAssessment must be used within AssessmentProvider");
  }
  return context;
};
