export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export interface ISummary {
  totalStudents: number;
  completedStudents: number;
  completionRate: number;
  avgScore: number;
  totalTests?: number;
}

export interface ILeaderboard {
  studentId?: string;
  name?: string;
  email?: string;
  performance: number;
  total_score: number;
  achieved_score: number;
  timeTaken: number;
  testId?: string;
  testTitle?: string;
}

// In dashboard.types.ts
export interface ISingleTestResponse {
  test: {
    id: string;
    title: string;
    duration_minutes: number;
    start_at: string;
    total_score: number;
  };
  summary: {
    totalStudents: number;
    completedStudents: number;
    completionRate: number;
    avgScore: number;
  };
  scoreDistributions: {  // Changed from scoreDistribution to scoreDistributions
    [key: string]: number;  // Dynamic keys like "0-20", "21-40", etc.
  };
  difficultyStats: Array<{
    difficulty: Difficulty;
    avgPerformance: number;
  }>;
  problemAnalytics: Array<{
    id: string;
    title: string;
    difficulty: Difficulty;
    attempts: number;
    avgPerformance: number;
    successRate: number;
  }>;
  leaderboard: ILeaderboard[];
}

export interface IGlobalResponse {
  summary: ISummary;
  scoreTrendsTestWise: {
    testId: string;
    title: string;
    start_at: string;
    avgScore: number;
  }[];
  topPerformers: ILeaderboard[];
  difficultyStats: { difficulty: Difficulty; avgPerformance: number }[];
  problemAnalytics: IProblemAnalytics[];
  testWiseAnalytics: {
    testId: string;
    title: string;
    start_at: string;
    totalStudents: number;
    completionRate: number;
    avgScore: number;
  }[];
}