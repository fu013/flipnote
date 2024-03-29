import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

export interface User {
  mbId: string | null;
}

// 액세스 토큰 정보
export const accessTokenAtom = atom<string>({
  key: "accessToken",
  default: "",
  effects_UNSTABLE: [persistAtom],
});

// 로그인 유저 정보
export const userInfoAtom = atom<any>({
  key: "user",
  default: {
    mbId: null as string | null,
  },
  effects_UNSTABLE: [persistAtom],
});

// 로그인 여부
export const isLoggedInAtom = atom({
  key: "isLoggedIn",
  default: false,
  effects_UNSTABLE: [persistAtom],
});
