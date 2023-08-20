export interface ListItemInfo {
  orderNo: number;
  todoId: string;
  todoName: string;
  todoType: string;
  todoImage: string;
  mbId: string;
  chName: string;
  createdDate: string;
}

// 투두를 변경할 때 사용하는 인터페이스, is로 시작하는 프로퍼티는 백엔드에서 필터 처리 용도, 데이터베이스와 CRUD 작업시엔 제거해서 사용
export interface changeListItemInfo {
  orderNo: number;
  todoId: string;
  todoName: string;
  todoType: string;
  todoImage: string;
  mbId: string;
  chName: string;
  createdDate: string;
  isDelete: boolean;
}
