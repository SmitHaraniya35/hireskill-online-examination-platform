import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import testLinkService from "../../services/test.services";
import codingProblemService from "../../services/codingProblem.services";
import type { Test } from "../../types/test.types";
import {
  testSchema,
  type TestFormInput,
} from "../../validators/createNewTest.validators";
import { toast } from "react-toastify";
import { ArrowLeft } from "lucide-react";

interface DisplayProblem {
  id: string;
  title: string;
  difficulty: string;
  topic: string[];
}

interface SelectedCounts {
  easy: number;
  medium: number;
  hard: number;
}

// Helper: parse "2026-05-03T14:00:00.000Z" into form fields
const parseISOToFields = (iso: string) => {
  const date = new Date(iso);
  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: String(date.getUTCMonth() + 1).padStart(2, "0"),
    year: String(date.getUTCFullYear()),
    time: `${String(date.getUTCHours()).padStart(2, "0")}:${String(date.getUTCMinutes()).padStart(2, "0")}`,
  };
};

const CreateNewTest: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("editId"); // null = create mode, string = edit mode
  const isEditMode = !!editId;

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(isEditMode); // show spinner while prefetching
  const [problemsLoading, setProblemsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allProblems, setAllProblems] = useState<DisplayProblem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<DisplayProblem[]>(
    [],
  );
  const [selectedProblems, setSelectedProblems] = useState<Set<string>>(
    new Set(),
  );
  const [searchTerm, setSearchTerm] = useState("");
  // const [topicFilter, setTopicFilter] = useState("");
  const [topicFilters, setTopicFilters] = useState<string[]>([]);
  const [difficultyFilter, setDifficultyFilter] = useState("");
  const [uniqueTopics, setUniqueTopics] = useState<string[]>([]);

  const [easyCount, setEasyCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);
  const [totalProblems, setTotalProblems] = useState(0);

  const [difficultyCounts, setDifficultyCounts] = useState<SelectedCounts>({
    easy: 0,
    medium: 0,
    hard: 0,
  });
  const [topicDropdownOpen, setTopicDropdownOpen] = useState(false);
  const [topicSearch, setTopicSearch] = useState("");
  const topicDropdownRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<TestFormInput>({
    resolver: zodResolver(testSchema),
    defaultValues: {
      title: "",
      duration: "",
      start_time: "09:00",
      start_day: "",
      start_month: "",
      start_year: "",
      expiry_time: "23:59",
      day: "",
      month: "",
      year: "",
    },
  });

  // ── Fetch all coding problems ──────────────────────────────────────────────
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setProblemsLoading(true);
        const response = await codingProblemService.getAllCodingProblems();
        const problems = response.payload?.codingProblemList;
        const displayProblems: DisplayProblem[] = problems!.map(
          (problem: any) => ({
            id: problem.id!,
            title: problem.title,
            difficulty: problem.difficulty,
            topic: problem.topic || [],
          }),
        );
        setAllProblems(displayProblems);
        setFilteredProblems(displayProblems);
        const topics = new Set<string>();
        displayProblems.forEach((p: DisplayProblem) =>
          p.topic.forEach((t) => topics.add(t)),
        );
        setUniqueTopics(Array.from(topics));
      } catch (error) {
        toast.error("Failed to load coding problems");
      } finally {
        setProblemsLoading(false);
      }
    };
    fetchProblems();
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        topicDropdownRef.current &&
        !topicDropdownRef.current.contains(e.target as Node)
      ) {
        setTopicDropdownOpen(false);
        setTopicSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── If edit mode, prefetch test details and populate form ──────────────────
  useEffect(() => {
    if (!isEditMode || !editId) return;

    const fetchTestDetails = async () => {
      try {
        setPageLoading(true);
        const res = await testLinkService.getTestDetails(editId);
        const test: Test = res.payload!.test;

        // Parse ISO dates back into individual form fields
        const start = parseISOToFields(test.start_at!);
        const expiry = parseISOToFields(test.expiration_at);

        reset({
          title: test.title,
          duration: String(test.duration_minutes),
          start_day: start.day,
          start_month: start.month,
          start_year: start.year,
          start_time: start.time,
          day: expiry.day,
          month: expiry.month,
          year: expiry.year,
          expiry_time: expiry.time,
        });

        // Restore difficulty counts
        setEasyCount(test.count_of_easy_problem ?? 0);
        setMediumCount(test.count_of_medium_problem ?? 0);
        setHardCount(test.count_of_hard_problem ?? 0);

        // Pre-select the problems that belong to this test
        if (test.codingProblem && test.codingProblem.length > 0) {
          setSelectedProblems(new Set(test.codingProblem.map((p) => p.id)));
        }
      } catch (err: any) {
        toast.error(
          err.response?.data?.message || "Failed to load test details",
        );
        navigate("/admin/create-exam");
      } finally {
        setPageLoading(false);
      }
    };

    fetchTestDetails();
  }, [editId, isEditMode]);

  // ── Auto-calculate total ───────────────────────────────────────────────────
  useEffect(() => {
    setTotalProblems(easyCount + mediumCount + hardCount);
  }, [easyCount, mediumCount, hardCount]);

  // ── Filter problems ────────────────────────────────────────────────────────
  useEffect(() => {
    let filtered = [...allProblems];
    if (searchTerm)
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    if (difficultyFilter)
      filtered = filtered.filter(
        (p) => p.difficulty.toLowerCase() === difficultyFilter.toLowerCase(),
      );
    // if (topicFilter)
    //   filtered = filtered.filter((p) => p.topic.includes(topicFilter));
    if (topicFilters.length > 0)
      filtered = filtered.filter((p) =>
        topicFilters.every((t) => p.topic.includes(t)),
      );

    setFilteredProblems(filtered);
  }, [searchTerm, difficultyFilter, topicFilters, allProblems]);

  // ── Track selected difficulty counts ──────────────────────────────────────
  useEffect(() => {
    const counts = { easy: 0, medium: 0, hard: 0 };
    selectedProblems.forEach((id) => {
      const problem = allProblems.find((p) => p.id === id);
      if (problem) {
        const d = problem.difficulty.toLowerCase();
        if (d === "easy") counts.easy++;
        else if (d === "medium") counts.medium++;
        else if (d === "hard") counts.hard++;
      }
    });
    setDifficultyCounts(counts);
  }, [selectedProblems, allProblems]);

  const toggleProblemSelection = (problemId: string) => {
    const next = new Set(selectedProblems);
    next.has(problemId) ? next.delete(problemId) : next.add(problemId);
    setSelectedProblems(next);
  };

  const validateDifficultyDistribution = (): boolean => {
    if (difficultyCounts.easy < easyCount) {
      toast.error(
        `Need at least ${easyCount} easy problems (selected: ${difficultyCounts.easy})`,
      );
      return false;
    }
    if (difficultyCounts.medium < mediumCount) {
      toast.error(
        `Need at least ${mediumCount} medium problems (selected: ${difficultyCounts.medium})`,
      );
      return false;
    }
    if (difficultyCounts.hard < hardCount) {
      toast.error(
        `Need at least ${hardCount} hard problems (selected: ${difficultyCounts.hard})`,
      );
      return false;
    }
    return true;
  };

  const onSubmit = async (data: TestFormInput) => {
    if (!validateDifficultyDistribution()) return;
    setLoading(true);
    setIsError(false);
    setErrorMsg("");

    // Format start_at
    const [startHh, startMm] = data.start_time.split(":").map(Number);
    const formattedStart = `${data.start_year}-${String(Number(data.start_month)).padStart(2, "0")}-${String(Number(data.start_day)).padStart(2, "0")}T${String(startHh).padStart(2, "0")}:${String(startMm).padStart(2, "0")}:00Z`;

    // Format expiration_at
    const [hh, mm] = data.expiry_time.split(":").map(Number);
    const formattedExpiration = `${data.year}-${String(Number(data.month)).padStart(2, "0")}-${String(Number(data.day)).padStart(2, "0")}T${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}:00Z`;

    const testData: Partial<Test> = {
      title: data.title.trim(),
      duration_minutes: Number(data.duration),
      start_at: formattedStart,
      expiration_at: formattedExpiration,
      count_of_total_problem: totalProblems,
      count_of_easy_problem: easyCount,
      count_of_medium_problem: mediumCount,
      count_of_hard_problem: hardCount,
      coding_problem_ids: Array.from(selectedProblems),
    };

    try {
      if (isEditMode && editId) {
        await testLinkService.updateTest(editId, testData as Test);
        toast.success("Test Updated Successfully!");
      } else {
        await testLinkService.createTest(testData as Test);
        toast.success("Test Created Successfully!");
      }
      navigate("/admin/create-exam");
    } catch (err: any) {
      setIsError(true);
      setErrorMsg(err.response?.data?.message || "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleCountChange = (
    type: "easy" | "medium" | "hard",
    value: number,
  ) => {
    if (type === "easy") setEasyCount(value);
    if (type === "medium") setMediumCount(value);
    if (type === "hard") setHardCount(value);
  };

  const isValidDistribution =
    difficultyCounts.easy >= easyCount &&
    difficultyCounts.medium >= mediumCount &&
    difficultyCounts.hard >= hardCount;

  const totalSelected = selectedProblems.size;
  const progressPercent = Math.min(
    100,
    Math.round((totalSelected / Math.max(totalProblems, 1)) * 100),
  );

  const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
    const d = difficulty.toLowerCase();
    const cls =
      d === "easy"
        ? "bg-green-100 text-green-800"
        : d === "medium"
          ? "bg-yellow-100 text-yellow-800"
          : "bg-red-100 text-red-800";
    return (
      <span
        className={`inline-block px-3 py-0.5 rounded-sm text-xs font-semibold ${cls}`}
      >
        {difficulty}
      </span>
    );
  };

  // Show loading spinner while prefetching edit data
  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-gray-500 text-sm animate-pulse">
          Loading test details...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav */}

      {/* Page Body */}
      <div className="max-w-screen-xl mx-auto px-6 py-7">
        {/* Page Title Row */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEditMode
              ? "Edit Test / Assessment"
              : "Create New Test / Assessment"}
          </h1>
          <button
              onClick={() => navigate("/admin/create-exam")}
              className="cursor-pointer group inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-gray-500 hover:text-[#1DA077] hover:bg-[#1DA077]/8 border border-transparent hover:border-[#1DA077]/20 transition-all duration-200"
            >
              <ArrowLeft className="w-3.5 h-3.5 transition-transform duration-200 group-hover:-translate-x-0.5" />
              Back to Tests
            </button>
        </div>

        {isError && errorMsg && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-lg px-4 py-3 mb-5">
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid grid-cols-2 gap-5">
            {/* ===== LEFT COLUMN ===== */}
            <div className="flex flex-col gap-5">
              {/* Test Metadata & Scheduling */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">
                  Test Metadata &amp; Scheduling
                </h2>

                {/* Test Title */}
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Test Title
                  </label>
                  <input
                    type="text"
                    placeholder="Software Engineering Intern - 2026 Screening"
                    {...register("title")}
                    className={`w-full px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 transition ${
                      errors.title ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.title.message}
                    </p>
                  )}
                </div>

                {/* Duration */}
                <div className="mb-5">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    placeholder="60"
                    {...register("duration")}
                    className={`w-28 px-3 py-2.5 text-sm border rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 transition ${
                      errors.duration ? "border-red-400" : "border-gray-300"
                    }`}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.duration.message}
                    </p>
                  )}
                </div>

                {/* Start & Expiration */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Start Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Start Date &amp; Time
                    </label>
                    <div className="flex items-center gap-1 flex-wrap">
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 2v4M16 2v4M3 10h18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <input
                        {...register("start_day")}
                        placeholder="DD"
                        maxLength={2}
                        className="w-9 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <span className="text-gray-400 text-xs">/</span>
                      <input
                        {...register("start_month")}
                        placeholder="MM"
                        maxLength={2}
                        className="w-9 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <span className="text-gray-400 text-xs">/</span>
                      <input
                        {...register("start_year")}
                        placeholder="YYYY"
                        maxLength={4}
                        className="w-14 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <input
                        type="time"
                        {...register("start_time")}
                        className="px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                    </div>
                    {(errors.start_day ||
                      errors.start_month ||
                      errors.start_year ||
                      errors.start_time) && (
                      <p className="text-red-500 text-xs mt-1">
                        Valid start date and time required
                      </p>
                    )}
                  </div>

                  {/* Expiration Date */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                      Expiration Date &amp; Time
                    </label>
                    <div className="flex items-center gap-1 flex-wrap">
                      <svg
                        className="w-3.5 h-3.5 text-gray-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <rect
                          x="3"
                          y="4"
                          width="18"
                          height="18"
                          rx="2"
                          stroke="currentColor"
                          strokeWidth="2"
                        />
                        <path
                          d="M8 2v4M16 2v4M3 10h18"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                        />
                      </svg>
                      <input
                        {...register("day")}
                        placeholder="DD"
                        maxLength={2}
                        className="w-9 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <span className="text-gray-400 text-xs">/</span>
                      <input
                        {...register("month")}
                        placeholder="MM"
                        maxLength={2}
                        className="w-9 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <span className="text-gray-400 text-xs">/</span>
                      <input
                        {...register("year")}
                        placeholder="YYYY"
                        maxLength={4}
                        className="w-14 text-center px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                      <input
                        type="time"
                        {...register("expiry_time")}
                        className="px-1 py-2 text-xs border border-gray-300 rounded-md bg-gray-50 focus:outline-none focus:border-green-500"
                      />
                    </div>
                    {(errors.day ||
                      errors.month ||
                      errors.year ||
                      errors.expiry_time) && (
                      <p className="text-red-500 text-xs mt-1">
                        Valid expiration date and time required
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Problem Difficulty Distribution */}
              <div className="bg-white rounded-xl border border-gray-200 p-6">
                <h2 className="text-base font-bold text-gray-900 mb-5">
                  Problem Difficulty Distribution
                </h2>

                <div className="flex items-center gap-3 mb-5 w-full h-15 rounded-md border border-gray-200 bg-gray-50">
                  <div className="flex-1 text-center">
                    <span className="font-bold text-gray-900 text-sm">
                      Total Problems: {totalProblems}{" "}
                    </span>
                    <span className="text-gray-500 text-xs font-normal">
                      (Auto-calculated)
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
                        Easy
                      </span>
                    </div>
                    <input
                      min="0"
                      value={easyCount}
                      onChange={(e) =>
                        handleCountChange("easy", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 transition"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
                        Medium
                      </span>
                    </div>
                    <input
                      min="0"
                      value={mediumCount}
                      onChange={(e) =>
                        handleCountChange(
                          "medium",
                          parseInt(e.target.value) || 0,
                        )
                      }
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 transition"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
                        Hard
                      </span>
                    </div>
                    <input
                      min="0"
                      value={hardCount}
                      onChange={(e) =>
                        handleCountChange("hard", parseInt(e.target.value) || 0)
                      }
                      className="w-full px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* ===== RIGHT COLUMN: Problem Browser ===== */}
            <div className="bg-white rounded-xl border border-gray-200 p-6 flex flex-col">
              <h2 className="text-base font-bold text-gray-900 mb-4">
                Problem Browser
              </h2>

              {/* Filter & Search */}
              <div className="mb-4">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Filter &amp; Search
                </p>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <svg
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        cx="11"
                        cy="11"
                        r="7"
                        stroke="currentColor"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 21l-4-4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search problems..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:border-green-500 transition"
                    />
                  </div>
                  {/* <select
                    value={topicFilter}
                    onChange={(e) => setTopicFilter(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 transition"
                  >
                    <option value="">Select topic</option>
                    {uniqueTopics.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select> */}
                  <div className="relative" ref={topicDropdownRef}>
                    <button
                      type="button"
                      onClick={() => setTopicDropdownOpen((o) => !o)}
                      className="flex items-center justify-between gap-2 px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 transition min-w-[140px]"
                    >
                      <span
                        className={
                          topicFilters.length > 0
                            ? "text-gray-800"
                            : "text-gray-400"
                        }
                      >
                        {topicFilters.length === 0
                          ? "Select topic"
                          : topicFilters.length === 1
                            ? topicFilters[0]
                            : `${topicFilters.length} topics`}
                      </span>
                      <svg
                        className={`w-4 h-4 text-gray-400 flex-shrink-0 transition-transform ${topicDropdownOpen ? "rotate-180" : ""}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>

                    {topicDropdownOpen && (
                      <div className="absolute z-30 top-full mt-1 w-56 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
                        {/* Fixed Search */}
                        <div className="p-2 border-b border-gray-100">
                          <input
                            autoFocus
                            value={topicSearch}
                            onChange={(e) => setTopicSearch(e.target.value)}
                            placeholder="Search topic..."
                            className="w-full px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:border-gray-400"
                          />
                        </div>

                        {/* Scrollable Options */}
                        <div className="max-h-48 overflow-y-auto">
                          {uniqueTopics.filter((t) =>
                            t.toLowerCase().includes(topicSearch.toLowerCase()),
                          ).length === 0 ? (
                            <p className="text-sm text-gray-400 text-center py-3">
                              No topics found
                            </p>
                          ) : (
                            uniqueTopics
                              .filter((t) =>
                                t
                                  .toLowerCase()
                                  .includes(topicSearch.toLowerCase()),
                              )
                              .map((t) => {
                                const isSelected = topicFilters.includes(t);
                                return (
                                  <button
                                    key={t}
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setTopicFilters((prev) =>
                                        isSelected
                                          ? prev.filter((x) => x !== t)
                                          : [...prev, t],
                                      );
                                    }}
                                    className={`w-full text-left px-4 py-2 text-sm transition-colors flex items-center gap-2 ${
                                      isSelected
                                        ? "bg-green-50 text-green-700"
                                        : "text-gray-700 hover:bg-gray-50"
                                    }`}
                                  >
                                    {/* Checkbox */}
                                    <div
                                      className={`w-4 h-4 rounded border flex-shrink-0 flex items-center justify-center transition-colors ${
                                        isSelected
                                          ? "bg-green-600 border-green-600"
                                          : "border-gray-300"
                                      }`}
                                    >
                                      {isSelected && (
                                        <svg
                                          className="w-2.5 h-2.5 text-white"
                                          viewBox="0 0 10 10"
                                          fill="none"
                                        >
                                          <path
                                            d="M2 5l2.5 2.5 3.5-4"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                      )}
                                    </div>
                                    {t}
                                  </button>
                                );
                              })
                          )}
                        </div>

                        {/* Footer */}
                        {topicFilters.length > 0 && (
                          <div className="px-4 py-2 border-t border-gray-100 flex items-center justify-between">
                            <span className="text-xs text-gray-400">
                              {topicFilters.length} selected
                            </span>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setTopicFilters([]);
                              }}
                              className="text-xs text-red-400 hover:text-red-600 transition-colors"
                            >
                              Clear all
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <select
                    value={difficultyFilter}
                    onChange={(e) => setDifficultyFilter(e.target.value)}
                    className="px-3 py-2.5 text-sm border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-green-500 transition"
                  >
                    <option value="">Difficulty</option>
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              {/* Problem List */}
              <p className="text-sm font-bold text-gray-900 mb-2">
                Problem List
              </p>
              <div className="border border-gray-200 rounded-lg overflow-hidden flex-1">
                <div className="overflow-y-auto max-h-72">
                  <table className="w-full">
                    <thead className="bg-gray-50 sticky top-0">
                      <tr>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left w-16">
                          Select
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                          Problem Title
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                          Difficulty
                        </th>
                        <th className="px-4 py-3 text-xs font-semibold text-gray-500 text-left">
                          Topic
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {problemsLoading ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-10 text-sm text-gray-400"
                          >
                            Loading problems...
                          </td>
                        </tr>
                      ) : filteredProblems.length === 0 ? (
                        <tr>
                          <td
                            colSpan={4}
                            className="text-center py-10 text-sm text-gray-400"
                          >
                            No problems found
                          </td>
                        </tr>
                      ) : (
                        filteredProblems.map((problem) => {
                          const checked = selectedProblems.has(problem.id);
                          return (
                            <tr
                              key={problem.id}
                              onClick={() => toggleProblemSelection(problem.id)}
                              className={`border-t border-gray-100 cursor-pointer transition-colors ${
                                checked ? "bg-green-50" : "hover:bg-gray-50"
                              }`}
                            >
                              <td className="px-4 py-3">
                                <div
                                  className={`w-4 h-4 rounded flex items-center justify-center mx-auto border transition-colors ${
                                    checked
                                      ? "bg-green-700 border-green-700"
                                      : "border-gray-300 bg-white"
                                  }`}
                                >
                                  {checked && (
                                    <svg
                                      className="w-2.5 h-2.5 text-white"
                                      viewBox="0 0 10 10"
                                      fill="none"
                                    >
                                      <path
                                        d="M2 5l2.5 2.5 3.5-4"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                      />
                                    </svg>
                                  )}
                                </div>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-800">
                                {problem.title}
                              </td>
                              <td className="px-4 py-3">
                                <DifficultyBadge
                                  difficulty={problem.difficulty}
                                />
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600">
                                {problem.topic.join(", ")}
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Validation Bar */}
              <div className="mt-4">
                <p className="text-sm font-bold text-gray-900 mb-2">
                  Validation Bar
                </p>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-2">
                  <div
                    className="h-full bg-green-500 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-sm font-semibold text-gray-800 mb-1">
                  Selected Problems: {totalSelected} / {totalProblems} Required
                </p>
                <div className="flex items-center gap-4 text-xs flex-wrap">
                  <span
                    className={
                      difficultyCounts.easy >= easyCount
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    Selected: {difficultyCounts.easy}/{easyCount} Easy{" "}
                    {difficultyCounts.easy >= easyCount ? "✓" : "✗"}
                  </span>
                  <span
                    className={
                      difficultyCounts.medium >= mediumCount
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {difficultyCounts.medium}/{mediumCount} Medium{" "}
                    {difficultyCounts.medium >= mediumCount ? "✓" : "✗"}
                  </span>
                  <span
                    className={
                      difficultyCounts.hard >= hardCount
                        ? "text-green-600"
                        : "text-red-500"
                    }
                  >
                    {difficultyCounts.hard}/{hardCount} Hard{" "}
                    {difficultyCounts.hard >= hardCount ? "✓" : "✗"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate("/admin/create-exam")}
              className="cursor-pointer px-8 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                loading || !isValidDistribution || totalSelected < totalProblems
              }
              className="cursor-pointer px-8 py-2.5 rounded-lg text-white text-sm font-semibold bg-gray-900 hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? isEditMode
                  ? "Updating..."
                  : "Creating..."
                : isEditMode
                  ? "Update Test"
                  : "Create Test & Publish"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateNewTest;
