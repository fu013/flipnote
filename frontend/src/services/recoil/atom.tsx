import { atom } from "recoil";
import { recoilPersist } from "recoil-persist";
import { ListItemInfo } from "services/interfaces/todo.interface";
const { persistAtom } = recoilPersist();


// 미완료 숙제
export const leftState = atom<readonly ListItemInfo[]>({
  key: "leftState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 완료 숙제
export const rightState = atom<readonly ListItemInfo[]>({
  key: "rightState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});

// 체크된 숙제
export const checkedState = atom<readonly ListItemInfo[]>({
  key: "checkedState",
  default: [],
  effects_UNSTABLE: [persistAtom],
});
