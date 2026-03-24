export type Difficulty = "Easy" | "Medium" | "Hard";

export interface ResultData {
  id: string;
  student_attempt_id: string;
  total_score: number;
  achieved_score: number;
  total_problems: number;
  solved_problems: number;
}

export interface StudentData {
  id: string;
  name: string;
  email: string;
  phone: number;
  college: string | null;
  degree: string | null;
  branch: string | null;
  graduation_year: number | null;
  skills: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  github_url: string | null;
  complete_profile: boolean;
}

export interface TestMetaData {
    id: string;
    title: string;
    duration_minutes: number;
    start_at: Date;
    total_score: number;
}

export interface StudentAttemptData {
  student_id: string;
  test_id: string;
  started_at: Date;
  expires_at: Date;
  finished_at: Date;
  status: string;
  is_submitted: boolean;
  is_active: boolean;
  result?: ResultData;
  student?: StudentData;
}

export interface SubmissionData {
  total_test_cases: number;
  passed_test_cases: number;
}

export interface CodingProblemData {
  title: string;
  difficulty: Difficulty;
}

export interface AssignedProblemData {
  problem_id: string;
  studentAttempt?: StudentAttemptData;
  codingProblem?: CodingProblemData;
  submission?: SubmissionData;
}

export interface SummaryData {
  totalTests?: number;
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  avgScore: number;
}

export type ScoreRange = "0-20" | "21-40" | "41-60" | "61-80" | "81-100";

export interface LeaderboardData {
  testId: string;
  studentId?: string | undefined;
  name?: string | undefined;
  email?: string | undefined;
  total_score: number;
  achieved_score: number;
  performance: number;
  timeTaken: Date | number;
}

export interface DifficultyStateData {
  difficulty: Difficulty;
  avgPerformance: number;
}

export interface ProblemAnalyticsData {
  id: string;
  title: string;
  difficulty: Difficulty;
  attempts: number;
  avgPerformance: number;
  successRate: number;
}

export interface TestAnalyticsData {
    testId: string,
    title: string,
    start_at: Date | string,
    totalStudents?: number,
    completionRate?: number,
    avgScore: number,
}

export interface SingleTestAnalyticsData {
    test: TestMetaData;
    summary: SummaryData;
    scoreDistributions: Record<ScoreRange, number>;
    difficultyStats: DifficultyStateData[];
    problemAnalytics: ProblemAnalyticsData[];
    leaderboard: LeaderboardData[];
}

export interface GlobalAnalyticsData {
    summary: SummaryData;
    scoreTrendsTestWise: TestAnalyticsData[];
    topPerformers: LeaderboardData[];
    difficultyStats: DifficultyStateData[];
    problemAnalytics: ProblemAnalyticsData[];
    testWiseAnalytics: TestAnalyticsData[];
}