export interface SubmitCodeRequest {
    source_code: string;
    language_id: number;
    problem_id: string;
}

export interface Judge0Submission  {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  number_of_runs?: number;
  cpu_time_limit?: number; 
  cpu_extra_time?: number;
  wall_time_limit?: number; 
  memory_limit?: number; 
  stack_limit?: number; 
  enable_per_process_and_thread_time_limit?: boolean;
  enable_per_process_and_thread_memory_limit?: boolean;
  max_file_size?: number;
} 

export interface Judge0BatchSubmission {
    submissions: Judge0Submission [];
}

export interface Judge0Result {
  stdout?: string;
  time?: string;
  memory?: number;
  stderr?: string;
  token?: string;
  compile_output?: string;
  message?: string;
  status: {
    id: number;
    description: string;
  };
}

export interface Judge0BatchResult {
    submissions: Judge0Result[]
}
