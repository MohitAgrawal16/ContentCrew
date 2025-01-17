import axios from "axios";
//import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../store/authSlice";

// Create an Axios instance
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL, // Replace with your actual API base URL
  withCredentials: true, // Include credentials (cookies)
});

// Add a request interceptor
// apiClient.interceptors.request.use((config) => {
//   // Get the access token from cookies
//   const accessToken = Cookies.get("accessToken");

//   if (accessToken) {
//     config.headers.Authorization = `Bearer ${accessToken}`;
//   }

//   return config;
// });

// Add a response interceptor
// apiClient.interceptors.response.use(
//   (response) => response, // Pass through the response if successful
//   async (error) => {
//     console.log(error);
  
//     if (error.response?.status === 401) {
//       // Get the refresh token from cookies
//      // const refreshToken = Cookies.get("refreshToken");
//      // console.log(refreshToken);
//      console.log("hi");
//       // if (refreshToken) {
//         try {
//           // Attempt to refresh the token
//           const backend_url=import.meta.env.VITE_BACKEND_URL;
//           const  data= await axios.post(
//             `${backend_url}/user/refresh-token`,
//             { withCredentials: true } // Include cookies
//           );
//          console.log(data);
//          console.log("check");
//           // Update the access token in cookies
//         //  Cookies.set("accessToken", data.data.accessToken, { secure: true, sameSite: "Strict" });

//           // Retry the original request with the new token
//         //  error.config.headers.Authorization = `Bearer ${data.data.accessToken}`;
//           return axios(error.config);
//         } catch (refreshError) {
//           console.error("Refresh token expired or invalid:", refreshError);
//           return Promise.reject(refreshError);
//         }
//      // }
//     }

//     return Promise.reject(error);
//   }
// );

// apiClient.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     console.log(error);
//     const dispatch = useDispatch();
//     const Navigate = useNavigate();
//     if (error.response?.status === 401) {
//       console.log("Unauthorized");
//       dispatch(logout());
//       Navigate("/loginAgain");
//     }
//     return Promise.reject(error);
//   }
// );

export default apiClient;
