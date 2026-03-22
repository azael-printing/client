// import axios from "axios";

// export const http = axios.create({
//   baseURL: import.meta.env.VITE_API_URL || "https://azclient.vercel.app/",
// });

// export function setAuthToken(token) {
//   if (token) http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   else delete http.defaults.headers.common["Authorization"];
// }

// http.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("accessToken");
//     config.headers = config.headers ?? {};
//     if (token) config.headers["Authorization"] = `Bearer ${token}`;
//     return config;
//   },
//   (error) => Promise.reject(error),
// );
import axios from "axios";

export const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

export function setAuthToken(token) {
  if (token) {
    http.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete http.defaults.headers.common["Authorization"];
  }
}

http.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    config.headers = config.headers ?? {};
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);
