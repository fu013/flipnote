import axios, { AxiosInstance, AxiosRequestHeaders } from "axios";
import { useRecoilValue } from "recoil";
import { SERVER_URL } from "config/constants.config";
import { accessTokenAtom } from "services/recoil/auth";
import customToast from "lib/customToast";

// JWT 토큰 인증 Axios 요청폼, 인터셉터 극한의 커스터마이징
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
          : customToast("로그인 토큰이 존재하지 않습니다.", "warning");
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
