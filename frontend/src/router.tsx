import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useRecoilValue, useResetRecoilState } from "recoil";
import { accessTokenAtom, isLoggedInAtom, userInfoAtom } from "services/recoil/auth";
import { useAuth_h } from "services/hooks/auth.hook";
import App from "./page/main/App";
import Login from "page/auth/login";

const Router = () => {
  const useAuthH = useAuth_h();
  const setRefresh = useAuthH.useLogCheckOnBrowserRefresh();
  const isLoggedIn = useRecoilValue(isLoggedInAtom);
  const resetUserInfoAtom = useResetRecoilState(userInfoAtom);
  const resetAccessTokenAtom = useResetRecoilState(accessTokenAtom);
  useEffect(() => {
    if (isLoggedIn) { // 로그인 상태 :: setRefresh로 토큰 주기적으로 발급 및 JWT 인증
      setRefresh.mutate();
    } else {
      resetUserInfoAtom();
      resetAccessTokenAtom();
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        {/* 정규 컴포넌트 */}
        <Route path="/" element={<App />} />
        <Route path="/auth/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
};

export default Router;
