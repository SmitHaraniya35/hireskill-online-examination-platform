import { StudentAttempt } from "../models/student_attempt.model.ts";
import { Test } from "../models/test.model.ts";
import { getAllTestService, getTestByIdService } from "./test.service.ts";
import { StudentAssignedProblem } from "../models/student_assigned_problem.model.ts";
import { HttpError } from "../utils/httpError.utils.ts";
import { ERROR_MESSAGES, HttpStatusCode } from "../constants/index.ts";
import type { 
  ProblemAnalyticsData,
  DifficultyStateData,
  LeaderboardData,
  SummaryData,
  AssignedProblemData,
  StudentAttemptData,
  Difficulty,
  ScoreRange, 
  SingleTestAnalyticsData,
  GlobalAnalyticsData,
  TestAnalyticsData,
  TestMetaData
} from "../types/controller/dashboardData.types.ts";

/******************************** HELPERS ********************************/

const calculatePercentage = (value: number, total: number): number =>
  total === 0 ? 0 : (value / total) * 100;

const round = (num: number): number =>
  parseFloat(num.toFixed(2));

/******************************** DATA FETCH ********************************/

const fetchAttempts = async (testId?: string) => {
  const query: Partial<{ test_id: string }> = {};
  if (testId) query.test_id = testId;

  const data: StudentAttemptData[] = await StudentAttempt.findActive(query)
    .populate("result")
    .populate("student");

  return data;
};

const fetchAssignedProblems = async (
  testId?: string
) => {
  const data: AssignedProblemData[] = await StudentAssignedProblem.findActive()
    .populate({
      path: "studentAttempt",
      match: testId ? { test_id: testId } : {},
    })
    .populate("codingProblem")
    .populate("submission");

  return data.filter(
    (ap: AssignedProblemData) => ap.studentAttempt || !testId
  );
};

/******************************** CORE LOGIC ********************************/

const getSummary = (attempts: StudentAttemptData[]) => {
  let completed = 0;
  let totalScore = 0;

  for (const a of attempts) {
    if (a.is_submitted) completed++;

    if (a.result && a.result.total_score > 0) {
      totalScore += calculatePercentage(
        a.result.achieved_score,
        a.result.total_score
      );
    }
  }

  const data: SummaryData = {
    totalStudents: attempts.length,
    completedStudents: completed,
    completionRate: round(
      calculatePercentage(completed, attempts.length)
    ),
    avgScore: round(totalScore / (attempts.length || 1)),
  };

  return data;
};

const getScoreDistribution = (
  attempts: StudentAttemptData[]
): Record<ScoreRange, number> => {
  const ranges: Record<ScoreRange, number> = {
    "0-20": 0,
    "21-40": 0,
    "41-60": 0,
    "61-80": 0,
    "81-100": 0,
  };

  for (const a of attempts) {
    if (!a.result || a.result.total_score === 0) continue;

    const score = calculatePercentage(
      a.result.achieved_score,
      a.result.total_score
    );

    if (score <= 20) ranges["0-20"]++;
    else if (score <= 40) ranges["21-40"]++;
    else if (score <= 60) ranges["41-60"]++;
    else if (score <= 80) ranges["61-80"]++;
    else ranges["81-100"]++;
  }

  return ranges;
};

const getDifficultyStats = (
  assignedProblems: AssignedProblemData[]
) => {
  const map: Record<Difficulty, number[]> = {
    Easy: [],
    Medium: [],
    Hard: [],
  };

  for (const ap of assignedProblems) {
    if (!ap.submission || !ap.codingProblem) continue;

    const performance = calculatePercentage(
      ap.submission.passed_test_cases,
      ap.submission.total_test_cases
    );

    map[ap.codingProblem.difficulty].push(performance);
  }

  const data: DifficultyStateData[] = (Object.keys(map) as Difficulty[]).map((difficulty) => ({
    difficulty,
    avgPerformance: round(
      map[difficulty].reduce((a, b) => a + b, 0) /
        (map[difficulty].length || 1)
    ),
  }));

  return data;
};

const getProblemAnalytics = (
  assignedProblems: AssignedProblemData[]
) => {
  const map = new Map<string, any>();

  for (const ap of assignedProblems) {
    if (!ap.submission || !ap.codingProblem) continue;

    const performance = calculatePercentage(
      ap.submission.passed_test_cases,
      ap.submission.total_test_cases
    );

    if (!map.has(ap.problem_id)) {
      map.set(ap.problem_id, {
        id: ap.problem_id,
        title: ap.codingProblem.title,
        difficulty: ap.codingProblem.difficulty,
        attempts: 0,
        totalPerformance: 0,
        successCount: 0,
      });
    }

    const entry = map.get(ap.problem_id);

    entry.attempts++;
    entry.totalPerformance += performance;
    if (performance === 100) entry.successCount++;
  }

  const data: ProblemAnalyticsData[] = Array.from(map.values()).map((p) => ({
    id: p.id,
    title: p.title,
    difficulty: p.difficulty,
    attempts: p.attempts,
    avgPerformance: round(p.totalPerformance / p.attempts),
    successRate: round((p.successCount / p.attempts) * 100),
  }));

  return data;
};

const getLeaderboard = (
  attempts: StudentAttemptData[]
) => {
  const data: LeaderboardData[] = [...attempts]
    .filter((a) => a.is_submitted === true && a.is_active === false)
    .map((a) => {
      const total = a.result?.total_score ?? 0;
      const achieved = a.result?.achieved_score ?? 0;
      return {
        testId: a.test_id,
        studentId: a.student?.id,
        name: a.student?.name,
        email: a.student?.email,
        total_score: total,
        achieved_score: achieved,
        performance: round(
          calculatePercentage(achieved, total)
        ),
        timeTaken:a.finished_at.getTime() - a.started_at.getTime(),
      };
    });

  return data.sort(
      (a, b) =>
        (b.performance ?? 0) -
        (a.performance ?? 0)
    ).slice(0, 5);
};

/******************************** TEST ANALYTICS ********************************/

const getTestWiseAnalytics = async (
  attempts: StudentAttemptData[]
) => {
  const tests = await Test.findActive().select("id title start_at");

  const testMap = new Map(
    tests.map((t: any) => [t.id, t])
  );

  const map = new Map<string, any>();

  for (const a of attempts) {
    if (!map.has(a.test_id)) {
      const t = testMap.get(a.test_id);

      map.set(a.test_id, {
        testId: a.test_id,
        title: t?.title || "Unknown Test",
        start_at: t?.start_at || null,
        totalStudents: 0,
        totalScore: 0,
        completed: 0,
      });
    }

    const entry = map.get(a.test_id);

    entry.totalStudents++;
    if (a.is_submitted) entry.completed++;

    if (a.result && a.result.total_score > 0) {
      entry.totalScore += calculatePercentage(
        a.result.achieved_score,
        a.result.total_score
      );
    }
  }

  const data: TestAnalyticsData[] = Array.from(map.values()).map((t) => ({
    testId: t.testId,
    title: t.title,
    start_at: t.start_at,
    totalStudents: t.totalStudents,
    completionRate: round(
      (t.completed / t.totalStudents) * 100
    ),
    avgScore: round(t.totalScore / t.totalStudents),
  }));

  return data;
};

const getSummaryForAllTests = async (
  attempts: StudentAttemptData[]
) => {
  const { testList } = await getAllTestService();

  const data: SummaryData = {
    totalTests: testList.length,
    ...getSummary(attempts),
  };

  return data;
};

/******************************** MAIN SERVICES ********************************/

export const getSingleTestAnalyticsService = async (
  testId: string
) => {
  const { test } = await getTestByIdService(testId);

  if (!test) {
    throw new HttpError(
      ERROR_MESSAGES.TEST_NOT_FOUND,
      HttpStatusCode.NOT_FOUND
    );
  }

  const formattedTest: TestMetaData = {
    id: test.id,
    title: test.title,
    duration_minutes: test.duration_minutes,
    start_at: test.start_at,
    total_score:
      test.count_of_easy_problem * 100 +
      test.count_of_medium_problem * 200 +
      test.count_of_hard_problem * 300,
  };

  const attempts = await fetchAttempts(testId);
  const assignedProblems = await fetchAssignedProblems(testId);

  const data: SingleTestAnalyticsData = {
    test: formattedTest,
    summary: getSummary(attempts),
    scoreDistributions: getScoreDistribution(attempts),
    difficultyStats: getDifficultyStats(assignedProblems),
    problemAnalytics: getProblemAnalytics(assignedProblems),
    leaderboard: getLeaderboard(attempts),
  };

  return data;
};

export const getAllTestsAnalyticsService = async () => {
  const tests = await Test.findActive().select("id title start_at");

  const testMap = new Map(
    tests.map((t: any) => [t.id, t])
  );

  const attempts = await fetchAttempts();
  const assignedProblems = await fetchAssignedProblems();

  const testWiseAnalytics = await getTestWiseAnalytics(attempts);

  const data: GlobalAnalyticsData = {
    summary: await getSummaryForAllTests(attempts),

    scoreTrendsTestWise: testWiseAnalytics.map((t) => ({
      testId: t.testId,
      title: t.title,
      start_at: t.start_at,
      avgScore: t.avgScore,
    })),

    topPerformers: getLeaderboard(attempts).map((p) => ({
      ...p,
      testTitle:
        testMap.get(p.testId)?.title || "Unknown Test",
    })),

    difficultyStats: getDifficultyStats(assignedProblems),
    problemAnalytics: getProblemAnalytics(assignedProblems),
    testWiseAnalytics,
  };

  return data;
};