import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();


/* 프리셋 타입 아톰 */
/**
 * 1: 일간
 * 2: 주간
 * 3: 월간
 */
export const presetTypeAtom = atom<number>({
  key: "presetType",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});
