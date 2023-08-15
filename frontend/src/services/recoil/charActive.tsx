import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
const { persistAtom } = recoilPersist();


/* 선택된 캐릭터 정보 */
/**
 */
export const charActiveIndexAtom = atom<number>({
  key: "charActiveIndex",
  default: 0,
  effects_UNSTABLE: [persistAtom],
});

export const charActiveNameAtom = atom<string>({
  key: "charActiveName",
  default: "",
  effects_UNSTABLE: [persistAtom],
});
