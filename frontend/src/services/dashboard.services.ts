// import axios from "axios";
// import type { axiosResponse } from "../types/index.types";
// import type { IGlobalResponse, ISingleTestResponse, ITest } from "../types/dashboard.types";

// const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/dashboard`;

// const getAuthHeaders = () => {
//   const token = localStorage.getItem("admin_token");
//   return {
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "ngrok-skip-browser-warning": "69420",
//     },
//     withCredentials: true,
//   };
// };

// // const dashboardService = {
// //     getDashboardService: async(id: string) => {
// //         const response = await axios.get<axiosResponse>(`${API_URL}/test-analytics/${id}`, getAuthHeaders());
// //         return response.data.payload;
// //     }
// // }
// const dashboardService = {
//   getDashboardService: async (id?: string) => {
//     // id provided  →  /test-analytics/:id   (per-test, backend filters by test_id)
//     // id omitted   →  /test-analytics        (all tests, backend applies no filter)
//     const url = id
//       ? `${API_URL}/test-analytics/${id}`
//       : `${API_URL}/test-analytics`;

//     const response = await axios.get<axiosResponse>(url, getAuthHeaders());
//     return response.data.payload;
//   },
//   fetchAllTestsAnalytics: async () => {
//     const url = `${API_URL}/test/global`
//     const response = await axios.get<axiosResponse<IGlobalResponse>>(url, getAuthHeaders());
//     return response.data.payload;
//   },
//   fetchSingleTestAnalytics: async (id:string) => {
//     const url = `${API_URL}/test/${id}`
//     const response = await axios.get<axiosResponse<ISingleTestResponse>>(url, getAuthHeaders());
//     return response.data.payload;
//   },

// };

// export default dashboardService;

import axios from "axios";
import type { axiosResponse } from "../types/index.types";
import type { IGlobalResponse, ISingleTestResponse } from "../types/dashboard.types";

const API_URL = `${import.meta.env.VITE_BACKEND_API_URL}/dashboard`;

const getAuthHeaders = () => {
  const token = localStorage.getItem("admin_token");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
      "ngrok-skip-browser-warning": "69420",
    },
    withCredentials: true,
  };
};

const dashboardService = {
  getDashboardService: async (id?: string) => {
    const url = id
      ? `${API_URL}/test-analytics/${id}`
      : `${API_URL}/test-analytics`;
    const response = await axios.get<axiosResponse>(url, getAuthHeaders());
    return response.data.payload;
  },

  fetchAllTestsAnalytics: async () => {
    const url = `${API_URL}/test/global`;
    const response = await axios.get<axiosResponse<IGlobalResponse>>(url, getAuthHeaders());
    return response.data.payload;
  },

  // ✅ FIX: was hardcoded `/test/:id` — now correctly interpolates the id param
  fetchSingleTestAnalytics: async (id: string) => {
    const url = `${API_URL}/test/${id}`;
    const response = await axios.get<axiosResponse<ISingleTestResponse>>(url, getAuthHeaders());
    return response.data.payload;
  },
};

export default dashboardService;