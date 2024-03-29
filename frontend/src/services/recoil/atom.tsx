import { atom } from "recoil";
import { ListItemInfo } from "services/interfaces/todo.interface";


// 미완료 숙제
export const leftState = atom<ListItemInfo[]>({
  key: "leftState",
  default: [],
});

// 완료 숙제
export const rightState = atom<ListItemInfo[]>({
  key: "rightState",
  default: [],
});

// 체크된 숙제
export const checkedState = atom<ListItemInfo[]>({
  key: "checkedState",
  default: [],
});
