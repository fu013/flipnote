import {
  ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_INTERVAL,
  SET_REFRESH_TOKEN_INTERVAL,
} from "config/constants.config";
import { useSetRecoilState, useResetRecoilState } from "recoil";
import { useMutation } from "@tanstack/react-query";
import { accessTokenAtom, isLoggedInAtom, userInfoAtom } from "services/recoil/auth";
import { useAuth_a } from "services/axios/auth.axios";
import { LoginParams } from "services/interfaces/auth.interface";
import customToast from "lib/customToast";

// authorization 관련 hook
export const useAuth_h = () => {
  const setAccessTokenAtom = useSetRecoilState(accessTokenAtom);
  const setUserInfoAtom = useSetRecoilState(userInfoAtom);
  const setIsLoggedInAtom = useSetRecoilState(isLoggedInAtom);
  const resetUserInfoAtom = useResetRecoilState(userInfoAtom);
  const resetAccessTokenAtom = useResetRecoilState(accessTokenAtom);
  const useAuthA = useAuth_a();

  // 로그인을 하기 위한 훅
  const useLogin = () => {
    return useMutation((params: LoginParams) => useAuthA.login(params), {
      onSuccess: async (res) => {
        clearInterval(REFRESH_TOKEN_INTERVAL);
        const interval = setInterval(async () => {
          const res = await useAuthA.silentRefresh();
          if (res?.status === 201) {
            setAccessTokenAtom(res?.data.token);
          } else {
            resetUserInfoAtom();
            resetAccessTokenAtom();
          }
        }, ACCESS_TOKEN_EXPIRY - 10000);
        SET_REFRESH_TOKEN_INTERVAL(interval);
        setAccessTokenAtom(res.data.token);
        setUserInfoAtom(await useAuthA.getUserWithToken(res.data.token));
        setIsLoggedInAtom(true);
        customToast("환영합니다.", "success");
        window.location.replace("/");
      },
      onError: (err: any) => {
        console.log(err);
      },
    });
  };

  // 새로고침시, 탈취 방지 및 로그인 유지를 위해 액세스 토큰을 갱신
  const useLogCheckOnBrowserRefresh = () => {
    return useMutation(() => useAuthA.silentRefresh(), {
      onSuccess: async (res) => { // 새롭게 refresh된 토큰으로 바로 갱신 후, 만료기간전에 자동으로 갱신되게 Interval 기능 설정
        if (res?.status === 201) {
          setAccessTokenAtom(res?.data.token);
        } else {
          resetUserInfoAtom();
          resetAccessTokenAtom();
        }
        clearInterval(REFRESH_TOKEN_INTERVAL);
        setTimeout(() => {
          const interval = setInterval(async () => {
            const res = await useAuthA.silentRefresh();
            if (res?.status === 201) {
              setAccessTokenAtom(res?.data.token);
            } else {
              resetUserInfoAtom();
              resetAccessTokenAtom();
            }
          }, ACCESS_TOKEN_EXPIRY - 10000);
          SET_REFRESH_TOKEN_INTERVAL(interval);
        }, 1000);
      },
      onError: (err: any) => {
        console.log(err);
      },
    });
  };

  return { useLogin, useLogCheckOnBrowserRefresh };
};
