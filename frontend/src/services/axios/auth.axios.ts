import axios from "axios";
import { REFRESH_TOKEN_INTERVAL } from "config/constants.config";
import { LoginParams } from "services/interfaces/auth.interface";
import { useAxiosCustom } from "services/setting/axios.custom";

// authorization 관련 hook > api
export const useAuth_a = () => {
  // my custom axios
  const instance = useAxiosCustom(false);

  const login = async (params: LoginParams) => {
    try {
      const res = await instance.post("/auth/login", params);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const logout = async (mb_id: string, callback: any) => {
    try {
      const res = await instance.post("/auth/logout", { mb_id });
      document.cookie = `isAccess=;max-age=${"0"}`;
      clearInterval(REFRESH_TOKEN_INTERVAL);
      callback();
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // 토큰(instanceAuth :: 토큰 할당 axios)을 이용한 유저 정보 반환 API
  const getUserWithToken = async (token: string) => {
    try {
      const res = await axios.get("/auth/jwt", {
        headers: { Authorization: "Bearer " + token },
      });
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  // 토큰을 갱신하기 위한 API
  const silentRefresh = async () => {
    try {
      const res = await instance.post("/auth/refresh");
      return res;
    } catch (err) {
      document.cookie = `isAccess=;max-age=${"0"}`;
      clearInterval(REFRESH_TOKEN_INTERVAL);
      console.error(err);
    }
  };

  return { login, logout, getUserWithToken, silentRefresh };
};
