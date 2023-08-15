import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTodo_a } from "services/axios/todo.axios";

// todo 관련 hook
export const useTodo_h = () => {
  const useTodoA = useTodo_a();
  const queryClient = useQueryClient();
  const useUpdateTodo = () => {
    return useMutation((Params: any) => useTodoA.setTodo(Params.left, Params.right),
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


  return { useUpdateTodo };
};
