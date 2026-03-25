import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";

import Header from "./Header";
import ResultSummary from "./ResultSummary";
import Problems from "./Problems";
import ProblemDetails from "./ProblemDetails";
import type { GetStudentAttemptSubmissionDetailsAndResultResponse } from "../../../types/studentAttempts.types";
import type { GetSubmissionResponse } from "../../../types/submission.types";
import StudentAttemptService from "../../../services/studentAttempt.services";
import submissionService from "../../../services/submission.services";

// ── Helpers ───────────────────────────────────────────────────────────────────

const computeDuration = (startedAt: string, finishedAt: string): number => {
  if (!startedAt || !finishedAt) return 0;
  const diff = new Date(finishedAt).getTime() - new Date(startedAt).getTime();
  return Math.round(diff / 60_000);
};

// ── Component ─────────────────────────────────────────────────────────────────

const StudentAttemptDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [pageData, setPageData] =
    useState<GetStudentAttemptSubmissionDetailsAndResultResponse | null>(null);
  const [pageLoading, setPageLoading] = useState(true);
  const [pageError, setPageError] = useState<string | null>(null);

  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(null);
  const [submissionData, setSubmissionData] = useState<GetSubmissionResponse | null>(null);
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);

  // Fetch main page data
  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      setPageLoading(true);
      setPageError(null);
      try {
        const response = await StudentAttemptService.getStudentAttemptSubmissionDetailsAndResult(id);
        setPageData(response.payload!);

        // Auto-select first submitted problem
        const first = response.payload!.studentAssignedProblems.find(
          (p) => !(p.status === "Not Attempted") && p.submission?.id
        );
        if (first?.submission?.id) {
          setSelectedSubmissionId(first.submission.id);
        }
      } catch (err: unknown) {
        setPageError(
          err instanceof Error ? err.message : "Failed to load attempt details."
        );
      } finally {
        setPageLoading(false);
      }
    };
    fetchData();
  }, [id]);

  // Fetch submission detail when a problem is selected
  useEffect(() => {
    if (!selectedSubmissionId) return;
    const fetchSubmission = async () => {
      setSubmissionLoading(true);
      setSubmissionError(null);
      setSubmissionData(null);
      try {
        const response = await submissionService.getSubmissionService(selectedSubmissionId);
        setSubmissionData(response.payload!);
      } catch (err: unknown) {
        setSubmissionError(
          err instanceof Error ? err.message : "Failed to load submission."
        );
      } finally {
        setSubmissionLoading(false);
      }
    };
    fetchSubmission();
  }, [selectedSubmissionId]);

  const handleSelectProblem = useCallback((submissionId: string) => {
    setSelectedSubmissionId(submissionId);
  }, []);

  const handleBack = () => navigate(-1);

  // Full-page loading
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-3">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
        <p className="text-sm text-gray-500">Loading attempt details…</p>
      </div>
    );
  }

  // Full-page error
  if (pageError || !pageData) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center gap-4">
        <p className="text-sm text-red-500">{pageError || "No data found."}</p>
        <button
          onClick={handleBack}
          className="text-sm font-semibold text-white bg-indigo-500 hover:bg-indigo-600 px-4 py-2 rounded-lg transition-colors"
        >
          ← Go Back
        </button>
      </div>
    );
  }

  const { student, test, studentAttempt, result, studentAssignedProblems } = pageData;

  const durationMinutes = computeDuration(
    studentAttempt.started_at,
    studentAttempt.finished_at
  );

  return (
    <div className="min-h-screen bg-gray-100 px-6 py-6 flex flex-col gap-5">
      {/* Header */}
      <Header
        student={student}
        test={test}
        studentAttempt={studentAttempt}
        onBack={handleBack}
      />

      {/* Two-column layout — equal height, scroll on overflow */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start lg:items-stretch">
        {/* Left column */}
        <div className="flex flex-col gap-5 min-h-0">
          <ResultSummary
            result={result}
            totalDurationMinutes={durationMinutes}
          />
          {/* Problems fills remaining height and scrolls internally */}
          <div className="flex-1 min-h-0  overflow-hidden flex flex-col">
            <Problems
              problems={studentAssignedProblems}
              selectedSubmissionId={selectedSubmissionId}
              onSelectProblem={handleSelectProblem}
            />
          </div>
        </div>

        {/* Right column — sticky, scrollable internally */}
        <div className="lg:sticky lg:top-6 self-start">
          <ProblemDetails
            data={submissionData}
            loading={submissionLoading}
            error={submissionError}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentAttemptDetails;