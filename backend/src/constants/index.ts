export const SUCCESS_MESSAGES = {
  MONGO_DB_CONNECTION_SUCC: "MongoDB connected successfully",

  OK: "Success",
  CREATED: "Created",

  LOGIN_SUCCESS: "Login successful",
  LOGOUT_SUCCESS: "Logout successful",

  ADMIN_CREATED: "Admin created successfully",

  ACCESS_TOKEN: "Access token generated successfully",
  RESET_PASSWORD_OTP: "Reset password OTP generated successfully",
  PASSWORD_RESET_SUCCESS: "Password reset successfully",

  OTP_VERIFIED: "OTP verified successfully",
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
  ACCESS_TOKEN_INVALID: "Invalid or expired access token", 
  REFRESH_TOKEN_INVALID: "Invalid or expired refresh token", 

  OTP_EXPIRED: "OTP expired or invalid",
  OTP_MISSING: "OTP missing",

  INPUT_VALIDATION_ERROR: "Input is not valid",
  INPUT_MISSING: "Required input(s) are missing",

  INVALID_CREDENTIAL: "Invalid credentials",

  ADMIN_EXISTS: "Admin is already exists",
  ADMIN_NOT_EXIST: "Admin is not exists",
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