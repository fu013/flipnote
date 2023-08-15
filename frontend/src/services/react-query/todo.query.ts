import { useQuery } from "@tanstack/react-query";
import { useTodo_a } from "services/axios/todo.axios";

const QUERY_KEY = {
  char: "todo",
};

// 캐싱 :: 할일 목록
export const useFetchTodo = () => {
  const myAxios = useTodo_a();

  const { data, isLoading } = useQuery([QUERY_KEY.char], () =>
    myAxios.getTodo()
  );
  if (typeof data === "undefined") {
    throw new Error("데이터를 불러올 수 없습니다.");
  }

  return {
    todo: data,
    todo_isLoading: isLoading,
  };
};
