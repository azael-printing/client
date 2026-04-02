import axios from "axios";

export const http = axios.create({
  baseURL:
    import.meta.env.VITE_API_URL ||
    "https://azaelprintingservice.up.railway.app",
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


http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;
    if (status === 401) {
      localStorage.removeItem("azael_auth");
      localStorage.removeItem("accessToken");
      delete http.defaults.headers.common["Authorization"];
      if (!window.location.pathname.includes("/login")) {
        window.location.replace("/login");
      }
    }
    return Promise.reject(error);
  },
);
