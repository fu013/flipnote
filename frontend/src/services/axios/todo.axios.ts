import customErrorToast from "lib/customErrorToast";
import customToast from "lib/customToast";
import { ListItemInfo } from "services/interfaces/todo.interface";
import { useAxiosCustom } from "services/setting/axios.custom";

export const useTodo_a = () => {
  const instance = useAxiosCustom(true);

  const getTodo = async () => {
    try {
      const res = await instance.get("/todo/getTodo");
      return res.data;
    } catch (err: any) {
      err.response ? customErrorToast(err.response.data.statusCode) : false;
      err.message ? customErrorToast(err.message) : false;
      console.log(err);
    }
  };

  const getTodoComplete = async () => {
    try {
      const res = await instance.get("/todo/getTodoComplete");
      return res.data;
    } catch (err: any) {
      err.response ? customErrorToast(err.response.data.statusCode) : false;
      err.message ? customErrorToast(err.message) : false;
      console.log(err);
    }
  };

  const setTodoSync = async (left: ListItemInfo[], right: ListItemInfo[]) => {
    try {
      const res = await instance.post("/todo/setTodoSync", { todo_private: left, todo_complete: right });
      res.data.message ? customToast(res.data.message, "success") : false;
      return res.data;
    } catch (err: any) {
      err.response ? customErrorToast(err.response.data.statusCode) : false;
      err.message ? customErrorToast(err.message) : false;
      console.log(err);
    }
  };

  const addNewPreset = async (newPreset: ListItemInfo[]) => {
    try {
      const res = await instance.post("/todo/setNewPreset", { todo_private: newPreset });
      res.data.message ? customToast(res.data.message, "success") : false;
      return res.data;
    } catch (err: any) {
      err.response ? customErrorToast(err.response.data.statusCode) : false;
      err.message ? customErrorToast(err.message) : false;
      console.log(err);
    }
  };

  return { getTodo, setTodoSync, getTodoComplete, addNewPreset };
};
