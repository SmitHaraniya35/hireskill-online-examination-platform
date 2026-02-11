export const SUCCESS_MESSAGES = {
  MONGO_DB_CONNECTION_SUCC: "MongoDB connected successfully",

  OK: "Success",
  CREATED: "Created",

  LOGIN_SUCCESS: "Login successfully",
  LOGOUT_SUCCESS: "Logout successfullly",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",
  ACCESS_TOKEN_GENERATED: "Access token generated successfully",

  OTP_GENERATED: "Reset password OTP generated successfully",
  OTP_VERIFIED: "OTP verified successfully",

  ADMIN_CREATED: "Admin created successfully",
  ADMIN_FIND: "Admin find successfully",

  TEST_CREATED: "Test created successfully",
  TEST_FIND: "Test find successfully",
  TEST_LIST_FETCHED: "Test list fetched successfully",
  TEST_DELETED: "Test deleted successfully",
  TEST_UPDATED: "Test updated successfully",
  TEST_STARTED: "Test started successfully",

  CODING_PROBLEM_CREATED: "Coding problem created successfully",
  CODING_PROBLEM_FIND: "Coding Problem find successfully",
  CODING_PROBLEM_LIST_FETCHED: "Coding Problem list fetched successfully",
  CODING_PROBLEM_DELETED: "Coding Problem delete successfully",
  CODING_PROBLEM_UPDATED: "Coding Problem update successfully",
  
  TEST_CASES_CREATED: "Test cases created successfully",
  TEST_CASE_FIND: "Test case find successfully",
  TEST_CASE_LIST_FETCHED: "Test case list fetched successfully",
  TEST_CASE_DELETED: "Test case deleted successfully",
  TEST_CASE_UPDATED: "Test case updated successfully",

  VALID_TEST_LINK: "Test link is valid",

  STUDENT_CREATED: "Student created successfully",
  STUDENT_FIND: "Student find successfully",
  STUDENT_LIST_FETCHED: "Student list fetched successfully",
  STUDENT_DELETED: "Student deleted successfully",
  STUDENT_UPDATED: "Student updated successfully",

  CODE_EXECUTED: "Code executed successfully",
  TESTCASES_EXECUTED: "All test cases executed successfully",

  STUDENT_ATTEMPT_CREATED: "Student attempt created successfully",
  STUDENT_ATTEMPT_DELETED: "Student attempt deleted successfully"
}

export const ERROR_MESSAGES = {
  MONGO_DB_CONNECTION_FAIL: "MongoDB connection failed",

  BAD_REQUEST: "Bad Request",
  UNAUTHORIZED: "Not Authorized",
  FORBIDDEN: "Forbidden",
  NOT_FOUND: "Not Found",
  INTERNAL_SERVER_ERROR: "Internal Server Error",

  ACCESS_TOKEN_MISSING: "Access token is missing",
  REFRESH_TOKEN_MISSING: "Refresh token is missing",
  ACCESS_TOKEN_INVALID: "Invalid or Expired access token", 
  REFRESH_TOKEN_INVALID: "Invalid or Expired refresh token", 

  OTP_EXPIRED: "OTP expired or invalid",
  OTP_REQUIRED: "OTP missing",
  OTP_NOT_VERIFIED: "OTP is not verified",
  
  INVALID_CREDENTIAL: "Invalid credentials",
  INVALID_TEST_LINK: "Test link is invalid",
  EXPIRED_TEST_LINK: "Test link is expired",
  
  INPUT_VALIDATION_ERROR: "Input is not valid",
  INPUT_MISSING: "Required input(s) are missing",
  EMAIL_PASSWORD_REQUIRED: "Email and Password are required",
  EMAIL_REQUIRED: "Email is required",

  ADMIN_EXISTS: "Admin is already exists",
  ADMIN_NOT_EXIST: "Admin is not exists",
  USER_UNAUTHORIZED: "User Not Authorized",

  INPUT_DATE_INVALID: "Date is not valid",
  TEST_ID_MISSING: "Test Id is missing",
  TEST_NOT_FOUND: "Test is not found",
  TEST_LIST_NOT_FOUND: "Test list not found",
  TEST_DELETE_FAILED: "Test delete failed",
  TEST_UPDATE_FAILED: "Test update failed",

  CODING_PROBLEM_CREATE_FAILED: "Coding Problem create failed",
  CODING_PROBLEM_NOT_FOUND: "Coding Problem is not found",
  CODING_PROBLEM_ID_MISSING: "Coding Problem Id is missing",
  CODING_PROBLEM_LIST_NOT_FOUND: "Coding Problem list is not found",
  CODING_PROBLEM_UPDATE_FAILED: "Coding Problem update failed",
  CODING_PROBLEM_DELETE_FAILED: "Coding Problem delete failed",

  TEST_CASE_CREATE_FAILED: "Test case create failed",
  TEST_CASE_ID_MISSING: "Test case Id is missing",
  TEST_CASES_NOT_FOUND: "Test cases is not found",
  TEST_CASE_DELETE_FAILED: "Test case delete failed",
  TEST_CASE_UPDATE_FAILED: "Test case update failed",

  STUDENT_EXIST_WITH_EMAIL: "Student exist with this email id",
  STUDENT_ID_MISSING: "Student id is missing",
  STUDENT_NOT_FOUND: "Student is not found",
  STUDENT_LIST_NOT_FOUND: "Student list is not found",

  STUDENT_ALREADY_ACTIVE: "Student already active",
  STUDENT_ATTEMPT_CREATE_FAILED: "Student attempt create failed",
  STUDENT_ATTEMPT_NOT_FOUND: "Student attempt is not found",
  STUDENT_ATTEMPT_DELETE_FAILED: "Student attempt delete failed",
  STUDENT_ATTEMPT_ID_MISSING: "Student attempt Id is missing"
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