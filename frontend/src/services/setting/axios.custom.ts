import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { useRecoilValue } from "recoil";
import { SERVER_URL } from "config/constants.config";
import { accessTokenAtom } from "services/recoil/auth";
import customToast from "lib/customToast";

// JWT 토큰 인증 ON/OFF 공통 Axios 요청훅
export const useAxiosCustom = (auth: boolean): AxiosInstance => {
  const accessToken = useRecoilValue(accessTokenAtom);
  const axiosInstance = axios.create({
    baseURL: `${SERVER_URL}/`,
    withCredentials: true,
  });

  axiosInstance.interceptors.request.use(
    (config: any) => {
      config.headers = config.headers ?? {};
      config.data instanceof FormData
        ? (config.headers["Content-Type"] = "multipart/form-data")
        : (config.headers["Content-Type"] = "application/json");
      if (auth) {
        accessToken
          ? ((
              config.headers as AxiosRequestHeaders
            ).Authorization = `Bearer ${accessToken}`)
          : customToast(
              "로그인 상태에서만 이용할 수 있는 기능입니다.",
              "warning"
            ) && window.location.replace("/auth/login");
      }
      return config;
    },
    (error: any) => {
      const statusCode = error.response?.status;
      if (statusCode === 401) {
        error.response.statusText = "Unauthorized";
        error.response.status = 401;
        window.location.replace("/");
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
};
