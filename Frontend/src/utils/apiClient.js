import axios from "axios";
import { logout } from "../store/authSlice";
import { store } from "../store/store.js";


const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});


export const apiFunc = () => {

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error);
      // const dispatch = useDispatch();
      // const Navigate = useNavigate();
      if (error.response?.status === 401) {
        console.log("Unauthorized");
        store.dispatch(logout());
        //dispatch(logout());
        //Navigate("/loginAgain");
      }
      return Promise.reject(error);
    }
  );
  return apiClient;
}

export const axiosPrivate = () => {

  // const accessToken = store.getState().auth.accessToken;
  // console.log(accessToken);

  // apiClient.interceptors.request.use(
  //   (config) => {
  //     if (!config.headers['Authorization']) {
  //       config.headers['Authorization'] = `Bearer ${accessToken}`;
  //     }
  //     return config;
  //   },
  //   (error) => Promise.reject(error)
  // );

  apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
      console.log(error);
      const prevRequest = error?.config;
      console.log(prevRequest);
      if (error?.response?.status === 401 && !prevRequest?.sent) {
        prevRequest.sent = true;
        const backend_url = import.meta.env.VITE_BACKEND_URL

        try {
          const response = await axios.post(
            `${backend_url}/user/refresh-token`,
            {},
            { withCredentials: true }
          );
          console.log(response);
        } catch (err) {
          console.log(err);
          store.dispatch(logout());
        }
        //prevRequest.headers['Authorization'] = `Bearer ${response.data.newAccessToken}`;
        //store.dispatch(setAccessToken(response.data.newAccessToken));
        return apiClient.request(prevRequest);
      }

      return Promise.reject(error);
    }
  );

  return apiClient;
}

export default apiClient;