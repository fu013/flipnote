import { atom } from "recoil";

// 로그
export const logAtom = atom<string[]>({
  key: "log",
  default: [],
});
