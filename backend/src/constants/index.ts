export const SUCCESS_MESSAGES = {
  // Database
  MONGO_DB_CONNECTION_SUCC: "MongoDB connected successfully",

  // General TTP Success
  OK: "Success",
  CREATED: "Resource created successfully",

  // Auth
  LOGIN_SUCCESS: "Logged in successfully",
  LOGOUT_SUCCESS: "Logged out successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  ACCESS_TOKEN_GENERATED: "Access token generated successfully",

  OTP_GENERATED: "Password reset OTP generated successfully",
  OTP_VERIFIED: "OTP verified successfully",

  // Admin
  ADMIN_CREATED: "Admin created successfully",
  ADMIN_FIND: "Admin retrieved successfully",

  // Test
  TEST_CREATED: "Test created successfully",
  TEST_FIND: "Test retrieved successfully",
  TEST_LIST_FETCHED: "Tests retrieved successfully",
  TEST_DELETED: "Test deleted successfully",
  TEST_UPDATED: "Test updated successfully",
  TEST_STARTED: "Test started successfully",
  TEST_FINISHED: "Test finished successfully",

  // Coding Problem
  CODING_PROBLEM_CREATED: "Coding problem created successfully",
  CODING_PROBLEM_FIND: "Coding problem retrieved successfully",
  CODING_PROBLEM_LIST_FETCHED: "Coding problems retrieved successfully",
  CODING_PROBLEM_DELETED: "Coding problem deleted successfully",
  CODING_PROBLEM_UPDATED: "Coding problem updated successfully",

  // Test Case
  TEST_CASES_CREATED: "Test cases created successfully",
  TEST_CASE_FIND: "Test case retrieved successfully",
  TEST_CASE_LIST_FETCHED: "Test cases retrieved successfully",
  TEST_CASE_DELETED: "Test case deleted successfully",
  TEST_CASE_UPDATED: "Test case updated successfully",

  // Test Link
  VALID_TEST_LINK: "Test link is valid",

  // Student
  STUDENT_CREATED: "Student created successfully",
  STUDENT_FIND: "Student retrieved successfully",
  STUDENT_LIST_FETCHED: "Students retrieved successfully",
  STUDENT_DELETED: "Student deleted successfully",
  STUDENT_UPDATED: "Student updated successfully",

  // Code Execution
  CODE_EXECUTED: "Code executed successfully",
  TESTCASES_EXECUTED: "All test cases executed successfully",

  // Student Attempt
  STUDENT_ATTEMPT_CREATED: "Student attempt created successfully",
  STUDENT_ATTEMPT_DELETED: "Student attempt deleted successfully",
  STUDENT_ATTEMPTS_OF_TEST_FETCHED: "Student attempts for the test retrieved successfully",
  STUDENT_ATTEMPT_UPDATED: "Student attempt updated successfully",

  // Judge0
  JUDGE0_SUBMISSION_FETCHED: "Judge0 submission retrieved successfully"
};


export const ERROR_MESSAGES = {
  // Database
  MONGO_DB_CONNECTION_FAIL: "Failed to connect to MongoDB",

  // General HTTP Errors
  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Not Authorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  // Token Errors
  ACCESS_TOKEN_MISSING: "Access token is missing",
  REFRESH_TOKEN_MISSING: "Refresh token is missing",
  ACCESS_TOKEN_INVALID: "Access token is invalid or expired", 
  REFRESH_TOKEN_INVALID: "Refresh token is invalid or expired", 

  // OTP Errors
  OTP_EXPIRED: "OTP is expired or invalid",
  OTP_REQUIRED: "OTP is required",
  OTP_NOT_VERIFIED: "OTP has not been verified",
  
  // // Authentication & Validation
  INVALID_CREDENTIAL: "Invalid credentials",
  INVALID_TEST_LINK: "Test link is invalid",
  EXPIRED_TEST_LINK: "Test link has expired",
  
  INPUT_VALIDATION_ERROR: "Input validation failed",
  INPUT_MISSING: "Required input(s) are missing",
  EMAIL_PASSWORD_REQUIRED: "Email and Password are required",
  EMAIL_REQUIRED: "Email is required",

  // Admin
  ADMIN_EXISTS: "Admin already exists",
  ADMIN_NOT_EXIST: "Admin does not exist",
  USER_UNAUTHORIZED: "User is Not Authorized",

  // Test
  INPUT_DATE_INVALID: "Invalid date format",
  TEST_ID_MISSING: "Test ID is missing",
  TEST_NOT_FOUND: "Test not found",
  TEST_LIST_NOT_FOUND: "No tests found",
  TEST_DELETE_FAILED: "Failed to delete test",
  TEST_UPDATE_FAILED: "Failed to update test",

  // Coding Problem
  CODING_PROBLEM_CREATE_FAILED: "Failed to create coding problem",
  CODING_PROBLEM_NOT_FOUND: "Coding problem not found",
  CODING_PROBLEM_ID_MISSING: "Coding problem ID is missing",
  CODING_PROBLEM_LIST_NOT_FOUND: "No coding problems found",
  CODING_PROBLEM_UPDATE_FAILED: "Failed to update coding problem",
  CODING_PROBLEM_DELETE_FAILED: "Failed to delete coding problem",

  // Test Case
  TEST_CASE_CREATE_FAILED: "Failed to create test case",
  TEST_CASE_ID_MISSING: "Test case ID is missing",
  TEST_CASES_NOT_FOUND: "No test cases found",
  TEST_CASE_DELETE_FAILED: "Failed to delete test case",
  TEST_CASE_UPDATE_FAILED: "Failed to update test case",

  // Student
  STUDENT_EXIST_WITH_EMAIL: "A student already exists with this email",
  STUDENT_ID_MISSING: "Student ID is missing",
  STUDENT_NOT_FOUND: "Student not found",
  STUDENT_LIST_NOT_FOUND: "No students found",

  STUDENT_ALREADY_ACTIVE: "Student is already active",
  STUDENT_ATTEMPT_CREATE_FAILED: "Failed to create student attempt",
  STUDENT_ATTEMPT_NOT_FOUND: "Student attempt not found",
  STUDENT_ATTEMPT_DELETE_FAILED: "Failed to delete student attempt",
  STUDENT_ATTEMPT_ID_MISSING: "Student attempt ID is missing",
  STUDENT_ATTEMPT_LIST_NOT_FOUND: "No student attempts found",

  // Judge0
  JUDGE0_SUBMISSION_ID_MISSING: "Judge0 submission ID is missing",

  // Submission
  SUBMISSION_CREATE_FAILED: "Failed to create submission"
}

export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500
};