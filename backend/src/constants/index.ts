export const SUCCESS_MESSAGES = {
  // Database
  DATABASE_CONNECTED: "Database connected successfully",

  // General
  OK: "Operation completed successfully",
  CREATED: "Resource created successfully",

  // Authentication
  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",
  PASSWORD_RESET_SUCCESS: "Password reset successful",
  ACCESS_TOKEN_GENERATED: "Access token generated successfully",
  OTP_GENERATED: "Password reset OTP generated successfully",
  OTP_VERIFIED: "OTP verified successfully",

  // Admin
  ADMIN_CREATED: "Admin created successfully",
  ADMIN_RETRIEVED: "Admin retrieved successfully",
  CLIENT_CREATED: "Client created successfully",

  // Test
  TEST_CREATED: "Test created successfully",
  TEST_RETRIEVED: "Test retrieved successfully",
  TESTS_RETRIEVED: "Tests retrieved successfully",
  TEST_DELETED: "Test deleted successfully",
  TEST_UPDATED: "Test updated successfully",
  TEST_STARTED: "Test started successfully",
  TEST_COMPLETED: "Test completed successfully",

  // Coding Problem
  CODING_PROBLEM_CREATED: "Coding problem created successfully",
  CODING_PROBLEM_RETRIEVED: "Coding problem retrieved successfully",
  CODING_PROBLEMS_RETRIEVED: "Coding problems retrieved successfully",
  CODING_PROBLEM_DELETED: "Coding problem deleted successfully",
  CODING_PROBLEM_UPDATED: "Coding problem updated successfully",

  // Test Case
  TEST_CASE_CREATED: "Test case created successfully",
  TEST_CASE_RETRIEVED: "Test case retrieved successfully",
  TEST_CASES_RETRIEVED: "Test cases retrieved successfully",
  TEST_CASE_DELETED: "Test case deleted successfully",
  TEST_CASE_UPDATED: "Test case updated successfully",

  // Test Link
  TEST_LINK_VALID: "Test link is valid",

  // Student
  STUDENT_CREATED: "Student created successfully",
  STUDENT_RETRIEVED: "Student retrieved successfully",
  STUDENTS_RETRIEVED: "Students retrieved successfully",
  STUDENT_DELETED: "Student deleted successfully",
  STUDENT_UPDATED: "Student updated successfully",

  // Code Execution
  CODE_EXECUTED: "Code executed successfully",
  TEST_CASES_EXECUTED: "All test cases executed successfully",

  // Student Attempt
  STUDENT_ATTEMPT_CREATED: "Student attempt created successfully",
  STUDENT_ATTEMPT_DELETED: "Student attempt deleted successfully",
  STUDENT_ATTEMPTS_RETRIEVED: "Student attempts retrieved successfully",
  STUDENT_ATTEMPT_UPDATED: "Student attempt updated successfully",
  STUDENT_ATTEMPT_VALIDATED_AND_EDITOR_ACCESS_GRANTED : "Student attempt validated successfully. Editor access granted.",

  // Judge0
  JUDGE0_SUBMISSION_RETRIEVED: "Judge0 submission retrieved successfully"
};

export const ERROR_MESSAGES = {
  // Database
  DATABASE_CONNECTION_FAILED: "Failed to connect to the database",

  // General HTTP Errors
  BAD_REQUEST: "Bad request",
  UNAUTHORIZED: "Unauthorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Resource not found",
  INTERNAL_SERVER_ERROR: "Internal server error",

  INVALID_API_CREDENTIALS: "Invalid API credentials",
  CLIENT_ID_AND_CLIENT_API_KEY_REQUIRED: "x-client-id and x-api-key are required",

  // Token Errors
  ACCESS_TOKEN_REQUIRED: "Access token is required",
  REFRESH_TOKEN_REQUIRED: "Refresh token is required",
  INVALID_ACCESS_TOKEN: "Access token is invalid or expired",
  INVALID_REFRESH_TOKEN: "Refresh token is invalid or expired",

  // OTP Errors
  OTP_EXPIRED_OR_INVALID: "OTP is expired or invalid",
  OTP_REQUIRED: "OTP is required",
  OTP_NOT_VERIFIED: "OTP is not verified",

  // Authentication & Validation
  INVALID_CREDENTIALS: "Invalid credentials",
  INVALID_TEST_LINK: "Test link is invalid",
  TEST_LINK_EXPIRED: "Test link has expired",

  VALIDATION_FAILED: "Input validation failed",
  REQUIRED_FIELDS_MISSING: "Required fields are missing",
  EMAIL_AND_PASSWORD_REQUIRED: "Email and password are required",
  EMAIL_AND_NEWPASSWORD_REQUIRED: "Email and new password are required",
  EMAIL_REQUIRED: "Email is required",

  // Admin
  ADMIN_ALREADY_EXISTS: "Admin already exists",
  ADMIN_NOT_FOUND: "Admin not found",
  UNAUTHORIZED_USER: "User is not authorized",

  // Test
  INVALID_DATE_FORMAT: "Invalid date format",
  TEST_ID_REQUIRED: "Test ID is required",
  TEST_NOT_FOUND: "Test not found",
  TESTS_NOT_FOUND: "No tests found",
  TEST_CREATION_FAILED: "Failed to creat test",
  TEST_DELETION_FAILED: "Failed to delete test",
  TEST_UPDATE_FAILED: "Failed to update test",

  // Coding Problem
  CODING_PROBLEM_CREATION_FAILED: "Failed to create coding problem",
  CODING_PROBLEM_NOT_FOUND: "Coding problem not found",
  CODING_PROBLEM_ID_REQUIRED: "Coding problem ID is required",
  CODING_PROBLEMS_NOT_FOUND: "No coding problems found",
  CODING_PROBLEM_UPDATE_FAILED: "Failed to update coding problem",
  CODING_PROBLEM_DELETION_FAILED: "Failed to delete coding problem",

  // Test Case
  TEST_CASE_CREATION_FAILED: "Failed to create test case",
  TEST_CASE_ID_REQUIRED: "Test case ID is required",
  TEST_CASE_NOT_FOUND: "Test case not found",
  TEST_CASES_NOT_FOUND: "No test cases found",
  TEST_CASE_DELETION_FAILED: "Failed to delete test case",
  TEST_CASE_UPDATE_FAILED: "Failed to update test case",

  // Student
  STUDENT_ALREADY_EXISTS_WITH_EMAIL: "A student already exists with this email",
  STUDENT_ALREADY_EXISTS_WITH_PHONE: "A student already exists with this phone",
  STUDENT_ID_REQUIRED: "Student ID is required",
  STUDENT_NOT_FOUND: "Student not found",
  STUDENTS_NOT_FOUND: "No students found",
  STUDENT_ALREADY_ACTIVE: "Student is already active",
  STUDENT_CREATION_FAILED: "Failed to create student",
  STUDENT_DELETION_FAILED: "Failed to delete student",
  STUDENT_UPDATE_FAILED: "Failed to update student",

  // Student Attempt
  STUDENT_ATTEMPT_CREATION_FAILED: "Failed to create student attempt",
  STUDENT_ATTEMPT_NOT_FOUND: "Student attempt not found",
  STUDENT_ATTEMPT_DELETION_FAILED: "Failed to delete student attempt",
  STUDENT_ATTEMPT_ID_REQUIRED: "Student attempt ID is required",
  STUDENT_ATTEMPTS_NOT_FOUND: "No student attempts found",
  STUDENT_ATTEMPT_ALREADY_SUBMITTED_OR_INACTIVE: "Student attempt is already submitted or inactive",

  // Judge0
  JUDGE0_SUBMISSION_ID_REQUIRED: "Judge0 submission ID is required",
  CODE_EXECUTION_FAILED: "Failed to execute code",
  JUDGE0_FETCH_FAILED: "Failed to fetch submission result from Judge0",

  // Submission
  SUBMISSION_CREATION_FAILED: "Failed to create submission"
};

export const HttpStatusCode = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502
};