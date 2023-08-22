import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();

// 로그
export const logAtom = atom<string[]>({
  key: "log",
  default: [],
  effects_UNSTABLE: [persistAtom],
});