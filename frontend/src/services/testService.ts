import axios from "axios";

// Base API URL (same host as other services, different resource)
const API_BASE_URL = "https://marvella-uncontributed-stephania.ngrok-free.dev/api";

// Common headers for ngrok (to bypass browser warning page)
const getCommonHeaders = () => ({
  headers: {
    "ngrok-skip-browser-warning": "69420",
  },
});

const testService = {
  // Create a student before starting the test
  createStudent: async (data: { name: string; email: string; phone: string }) => {
    const response = await axios.post(
      `${API_BASE_URL}/student/create-student`,
      data,
      getCommonHeaders()
    );
    return response.data;
  },

  // Fetch test details from slug
  getTestBySlug: async (slug: string) => {
    const response = await axios.get(
      `${API_BASE_URL}/test/${slug}`,
      getCommonHeaders()
    );
    return response.data;
  },

  // Start test and get problemId
  startTest: async (slug: string, testId: string, studentId: string) => {
    const response = await axios.get(`${API_BASE_URL}/test/${slug}/start`, {
      params: {
        test_id: testId,
        student_id: studentId,
      },
      ...getCommonHeaders(),
    });
    return response.data;
  },
};

export default testService;

