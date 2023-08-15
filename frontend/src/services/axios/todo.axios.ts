import customErrorToast from "lib/customErrorToast";
import { ListItemInfo } from "services/interfaces/todo.interface";
import { useAxiosCustom } from "services/setting/axios.custom";

export const useTodo_a = () => {
  const instance = useAxiosCustom(true);

  const getTodo = async () => {
    try {
      const res = await instance.get("/todo/getTodo");
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  const getTodoComplete = async () => {
    try {
      const res = await instance.get("/todo/getTodoComplete");
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  const setTodo = async (left: ListItemInfo[], right: ListItemInfo[]) => {
    try {
      const res = await instance.post("/todo/setTodo", { todo_private: left, todo_complete: right });
      return res.data;
    } catch (err: any) {
      if (err.response) customErrorToast(err.response.data.statusCode);
      if (err.message) customErrorToast(err.message);
      console.log(err);
    }
  };

  return { getTodo, setTodo, getTodoComplete };
};
