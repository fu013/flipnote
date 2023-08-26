import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRecoilValue } from "recoil";
import { useTodo_a } from "services/axios/todo.axios";
import { ListItemInfo } from "services/interfaces/todo.interface";
import { accessTokenAtom } from "services/recoil/auth";
import { socketSetClientLog } from "services/socket/use.socket";

interface Params {
  left: ListItemInfo[];
  right: ListItemInfo[];
}

export const useTodo_h = () => {
  const useTodoA = useTodo_a();
  const queryClient = useQueryClient();

  const accessToken = useRecoilValue(accessTokenAtom);
  const useUpdateTodo = () => {
    return useMutation((params: Params) => useTodoA.setTodoSync(params.left, params.right),
      {
        onSuccess: async (res) => {
          if (res.status && res.status === 201) {
            queryClient.invalidateQueries(['todo']);
            queryClient.invalidateQueries(['todo_c']);
          }
          else throw new Error("Internal Server error");
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };

  const useNewPreset = () => {
    return useMutation((newPreset: ListItemInfo[]) => useTodoA.addNewPreset(newPreset),
      {
        onSuccess: async (res) => {
          if (res.status && res.status === 201) {
            queryClient.invalidateQueries(['todo']);
            queryClient.invalidateQueries(['todo_c']);
            const todoNames = res.resultData.map((item: any) => item.todoName);
            socketSetClientLog({
              message: `${res.message} [${todoNames}]`,
              token: accessToken,
            });
          }
          else throw new Error("Internal Server error");
        },
        onError: (err: any) => {
          console.log(err);
        },
      }
    );
  };


  return { useUpdateTodo, useNewPreset };
};
