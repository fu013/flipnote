import { atom } from "recoil";

export interface ListItemInfo {
  id: number;
  image: string;
  name: string;
}

// 오늘의 할일 리스트 상태
export const leftState = atom<readonly ListItemInfo[]>({
  key: "leftState",
  default: [
    { id: 0, image: "image088.png", name: "소멸의 여로 심볼" },
    { id: 1, image: "image090.png", name: "츄츄 심볼" },
    { id: 2, image: "image092.png", name: "레헬른 심볼" },
    { id: 3, image: "image094.png", name: "아르카나 심볼" },
    { id: 4, image: "image050.png", name: "모라스 심볼" },
    { id: 5, image: "image052.png", name: "에스페라 심볼" },
    { id: 6, image: "image060.png", name: "하드 힐라" },
    { id: 7, image: "image062.png", name: "카오스 핑크빈" },
  ],
});

// 완료된 일들 리스트 상태
export const rightState = atom<readonly ListItemInfo[]>({
  key: "rightState",
  default: [],
});

// 선택된 데이터 리스트 상태
export const checkedState = atom<readonly ListItemInfo[]>({
  key: "checkedState",
  default: [],
});
