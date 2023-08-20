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

export interface ChangeListItemInfo {
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
