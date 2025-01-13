import axios from "axios";
import Cookies from "js-cookie";


// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your actual API base URL
  withCredentials: true, // Include credentials (cookies)
});

// Add a request interceptor
apiClient.interceptors.request.use((config) => {
  // Get the access token from cookies
  const accessToken = Cookies.get("accessToken");

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

// Add a response interceptor
apiClient.interceptors.response.use(
  (response) => response, // Pass through the response if successful
  async (error) => {
    if (error.response?.status === 401) {
      // Get the refresh token from cookies
      const refreshToken = Cookies.get("refreshToken");

      if (refreshToken) {
        try {
          // Attempt to refresh the token
          const { data } = await axios.post(
            "/api/v1/user/refresh-token",
            { refreshToken },
            { withCredentials: true } // Include cookies
          );

          // Update the access token in cookies
          Cookies.set("accessToken", data.accessToken, { secure: true, sameSite: "Strict" });

          // Retry the original request with the new token
          error.config.headers.Authorization = `Bearer ${data.accessToken}`;
          return axios(error.config);
        } catch (refreshError) {
          console.error("Refresh token expired or invalid:", refreshError);
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
