import { Cookies } from "react-cookie";

const cookies = new Cookies();

// 쿠키 관련 함수들 정의
export const setCookie = (name: string, value: string, option?: any) => {
  return cookies.set(name, value, { ...option });
};
export const getCookie = (name: string) => {
  return cookies.get(name);
};
