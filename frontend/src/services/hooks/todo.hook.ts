import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTodo_a } from "services/axios/todo.axios";
import { ListItemInfo } from "services/interfaces/todo.interface";

export const useTodo_h = () => {
  const useTodoA = useTodo_a();
  const queryClient = useQueryClient();
  const useUpdateTodo = () => {
    return useMutation((Params: any) => useTodoA.setTodoSync(Params.left, Params.right),
      {
        onSuccess: async (res) => {
          if (res.status && res.status === 201) queryClient.invalidateQueries(['todo']);
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
          if (res.status && res.status === 201) queryClient.invalidateQueries(['todo']);
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
